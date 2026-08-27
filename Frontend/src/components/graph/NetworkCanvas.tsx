import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGraph } from '../../context/GraphContext';
import { ZoomIn, ZoomOut, RefreshCw, Maximize2, Layers, Info } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export const NetworkCanvas: React.FC = () => {
  const {
    users,
    connections,
    communities,
    selectedNodeId,
    setSelectedNodeId,
    highlightedPath,
    setHighlightedPath,
    searchTerm,
    communityFilter,
    nodeLabelsVisible
  } = useGraph();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport Transform (Zoom & Pan)
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<Point>({ x: 0, y: 0 });
  const [mouseDownPos, setMouseDownPos] = useState<Point>({ x: 0, y: 0 });

  // Node Positions (Persistent across re-renders for node position stability)
  const nodePositionsRef = useRef<Map<string, NodePosition>>(new Map());
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoverScreenPos, setHoverScreenPos] = useState<Point | null>(null);

  // Incremental Position Update: Keeps existing positions stable, adds new nodes, removes deleted nodes
  const updateNodePositions = useCallback(() => {
    const map = nodePositionsRef.current;
    const currentIds = new Set(users.map(u => u.id));

    // 1. Remove entries for IDs no longer present in users
    for (const id of Array.from(map.keys())) {
      if (!currentIds.has(id)) {
        map.delete(id);
      }
    }

    const width = 1000;
    const height = 700;
    const clusterCenters: { [key: string]: { x: number; y: number } } = {
      c1: { x: width * 0.28, y: height * 0.32 }, // Top-Left
      c2: { x: width * 0.72, y: height * 0.32 }, // Top-Right
      c3: { x: width * 0.28, y: height * 0.72 }, // Bottom-Left
      c4: { x: width * 0.72, y: height * 0.72 }  // Bottom-Right
    };

    const communityCounts: { [key: string]: number } = { c1: 0, c2: 0, c3: 0, c4: 0 };

    // Count existing nodes per community to maintain cluster alignment
    users.forEach(user => {
      if (map.has(user.id)) {
        const commId = user.communityId || 'c1';
        communityCounts[commId] = (communityCounts[commId] || 0) + 1;
      }
    });

    // 2. Add positions for new nodes and update radius for existing nodes
    users.forEach(user => {
      const nodeRadius = Math.max(16, Math.min(26, 14 + user.connectionCount * 1.5));
      const existing = map.get(user.id);

      if (existing) {
        // Keep x & y stable, update radius to reflect new connection count
        existing.radius = nodeRadius;
      } else {
        // Calculate stable position for newly added node
        const commId = user.communityId || 'c1';
        const center = clusterCenters[commId] || { x: width / 2, y: height / 2 };
        const index = communityCounts[commId] || 0;
        communityCounts[commId] = index + 1;

        const radiusOffset = 80 + (index % 3) * 35;
        const angle = (index * (Math.PI * 2 / 6)) + (commId === 'c1' ? 0.3 : 0);

        const x = center.x + Math.cos(angle) * radiusOffset;
        const y = center.y + Math.sin(angle) * radiusOffset;

        map.set(user.id, { id: user.id, x, y, radius: nodeRadius });
      }
    });
  }, [users]);

  useEffect(() => {
    updateNodePositions();
  }, [users, updateNodePositions]);

  // 2B.7 — Keyboard Escape Listener for clearing selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'select' && activeTag !== 'textarea') {
          setSelectedNodeId(null);
          setHighlightedPath([]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedNodeId, setHighlightedPath]);

  // 2B.1 — Coordinate transformation utility
  const screenToGraphPoint = useCallback((screenX: number, screenY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (screenX - rect.left - offset.x) / scale;
    const y = (screenY - rect.top - offset.y) / scale;
    return { x, y };
  }, [offset, scale]);

  // 2B.2 — Node Hit-Testing with Z-Order and Filter Respect
  const getNodeAtScreenPoint = useCallback((screenX: number, screenY: number): string | null => {
    const graphPt = screenToGraphPoint(screenX, screenY);
    const positions = nodePositionsRef.current;

    // Build filtered users set
    const validUsers = new Set<string>();
    users.forEach(u => {
      if (communityFilter !== 'all' && u.communityId !== communityFilter) return;
      validUsers.add(u.id);
    });

    const entries = Array.from(positions.entries());
    // Reverse z-order iteration so topmost node wins
    for (let i = entries.length - 1; i >= 0; i--) {
      const [id, pos] = entries[i];
      if (!validUsers.has(id)) continue;

      const dx = graphPt.x - pos.x;
      const dy = graphPt.y - pos.y;
      if (dx * dx + dy * dy <= (pos.radius + 3) * (pos.radius + 3)) {
        return id;
      }
    }
    return null;
  }, [screenToGraphPoint, users, communityFilter]);

  // 2B.8 — Center viewport on node
  const centerOnNode = useCallback((nodeId: string) => {
    const pos = nodePositionsRef.current.get(nodeId);
    const canvas = canvasRef.current;
    if (!pos || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const targetOffsetX = (rect.width / 2) - (pos.x * scale);
    const targetOffsetY = (rect.height / 2) - (pos.y * scale);

    setOffset({ x: targetOffsetX, y: targetOffsetY });
  }, [scale]);

  // Trigger search focus when search term matches exactly one user
  useEffect(() => {
    if (searchTerm.trim()) {
      const matches = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matches.length === 1) {
        setSelectedNodeId(matches[0].id);
        centerOnNode(matches[0].id);
      }
    }
  }, [searchTerm, users, setSelectedNodeId, centerOnNode]);

  // Main Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Monochrome Canvas Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle Monochrome Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40 * scale;
    const startX = (offset.x % gridSize);
    const startY = (offset.y % gridSize);

    for (let x = startX; x < rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = startY; y < rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Apply Viewport Transforms
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    const positions = nodePositionsRef.current;

    // Monochrome Community Palette
    const communityColorMap: { [key: string]: string } = {
      c1: '#ffffff', // Solid White
      c2: '#a1a1aa', // Silver
      c3: '#71717a', // Medium Gray
      c4: '#e4e4e7'  // Off-white
    };

    // 2B.5 — Compute Neighbors of Selected Node
    const selectedNeighborIds = new Set<string>();
    if (selectedNodeId) {
      connections.forEach(conn => {
        if (conn.sourceUserId === selectedNodeId) {
          selectedNeighborIds.add(conn.targetUserId);
        } else if (conn.targetUserId === selectedNodeId) {
          selectedNeighborIds.add(conn.sourceUserId);
        }
      });
    }

    // Search matches
    const matchingSearchIds = new Set<string>();
    if (searchTerm.trim()) {
      users.forEach(u => {
        if (
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.id.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          matchingSearchIds.add(u.id);
        }
      });
    }

    // Path Edge Lookup
    const pathEdges = new Set<string>();
    if (highlightedPath.length > 1) {
      for (let i = 0; i < highlightedPath.length - 1; i++) {
        pathEdges.add(`${highlightedPath[i]}-${highlightedPath[i + 1]}`);
        pathEdges.add(`${highlightedPath[i + 1]}-${highlightedPath[i]}`);
      }
    }

    // 1. Draw Edges (with Dangling-Edge & Neighbor Safety)
    connections.forEach(conn => {
      const sourcePos = positions.get(conn.sourceUserId);
      const targetPos = positions.get(conn.targetUserId);
      // Dangling-edge safety: no-op if either endpoint node is missing
      if (!sourcePos || !targetPos) return;

      const isPathEdge = pathEdges.has(`${conn.sourceUserId}-${conn.targetUserId}`);
      const isConnectedToSelected =
        selectedNodeId === conn.sourceUserId || selectedNodeId === conn.targetUserId;

      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);

      if (isPathEdge) {
        // High Contrast White Bold Path Edge
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4 / scale;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
      } else if (isConnectedToSelected) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.5 / scale;
        ctx.shadowBlur = 0;
      } else if (selectedNodeId) {
        // Dim unrelated edges when a node is selected
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1 / scale;
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1 / scale;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 2. Draw Nodes (with Neighbor Dimming & Highlighting)
    users.forEach(user => {
      if (communityFilter !== 'all' && user.communityId !== communityFilter) return;

      const pos = positions.get(user.id);
      if (!pos) return;

      const isSelected = selectedNodeId === user.id;
      const isNeighbor = selectedNeighborIds.has(user.id);
      const isHovered = hoveredNodeId === user.id;
      const isInPath = highlightedPath.includes(user.id);
      const isSearchMatch = matchingSearchIds.has(user.id);
      const commColor = communityColorMap[user.communityId] || '#ffffff';

      // 2B.5 — Dimming unrelated nodes when selection is active
      const isDimmed = selectedNodeId && !isSelected && !isNeighbor && !isInPath && !isSearchMatch;

      ctx.save();
      if (isDimmed) {
        ctx.globalAlpha = 0.25;
      }

      // Outer Highlight Ring
      if (isSelected || isSearchMatch || isInPath || isNeighbor) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius + (isSelected ? 6 : 4), 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#ffffff' : isSearchMatch ? '#e4e4e7' : isNeighbor ? 'rgba(255, 255, 255, 0.7)' : '#a1a1aa';
        ctx.lineWidth = (isSelected ? 3 : 2) / scale;
        ctx.stroke();
      }

      // Base Node
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#27272a' : '#18181b';
      ctx.fill();

      // Community Border
      ctx.lineWidth = (isHovered ? 4 : isSelected ? 3.5 : 2.5) / scale;
      ctx.strokeStyle = commColor;
      ctx.stroke();

      // Node Initials or Path Number
      if (isInPath) {
        const stepIndex = highlightedPath.indexOf(user.id) + 1;
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, pos.radius * 0.9)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${stepIndex}`, pos.x, pos.y);
      } else {
        const initials = user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        ctx.fillStyle = '#fafafa';
        ctx.font = `bold ${Math.max(9, pos.radius * 0.65)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, pos.x, pos.y);
      }

      // Node Label
      if (nodeLabelsVisible || isSelected || isHovered || isSearchMatch || isNeighbor) {
        ctx.fillStyle = isSelected ? '#ffffff' : isNeighbor ? '#e4e4e7' : '#a1a1aa';
        ctx.font = `${isSelected || isNeighbor ? 'bold' : '500'} ${11 / scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(user.name, pos.x, pos.y + pos.radius + 5);
      }

      ctx.restore();
    });

    ctx.restore();
  }, [
    scale,
    offset,
    users,
    connections,
    selectedNodeId,
    hoveredNodeId,
    highlightedPath,
    searchTerm,
    communityFilter,
    nodeLabelsVisible
  ]);

  useEffect(() => {
    render();
  }, [render]);

  // Event Handlers (Pan, Drag, Click & Hover)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    const clickedNodeId = getNodeAtScreenPoint(e.clientX, e.clientY);

    if (clickedNodeId) {
      setDraggingNodeId(clickedNodeId);
    } else {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingNodeId) {
      const graphPt = screenToGraphPoint(e.clientX, e.clientY);
      const pos = nodePositionsRef.current.get(draggingNodeId);
      if (pos) {
        pos.x = graphPt.x;
        pos.y = graphPt.y;
        render();
      }
    } else if (isPanning) {
      setOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else {
      // 2B.3 — Hover Hit-Testing & Tooltip Positioning
      const hoverId = getNodeAtScreenPoint(e.clientX, e.clientY);
      if (hoverId !== hoveredNodeId) {
        setHoveredNodeId(hoverId);
      }
      if (hoverId) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          setHoverScreenPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
        }
      } else {
        setHoverScreenPos(null);
      }
    }
  };

  // 2B.4 — Click to Select with drag distance threshold
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const moveDist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);

    if (moveDist < 5) {
      // It is a clean click gesture!
      const targetNodeId = getNodeAtScreenPoint(e.clientX, e.clientY);
      if (targetNodeId) {
        setSelectedNodeId(targetNodeId);
      } else {
        // Empty canvas click clears selection & path
        setSelectedNodeId(null);
        setHighlightedPath([]);
      }
    }

    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.4, Math.min(2.5, scale * zoomFactor));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newOffsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
    const newOffsetY = mouseY - (mouseY - offset.y) * (newScale / scale);

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleZoomIn = () => setScale(prev => Math.min(2.5, prev * 1.2));
  const handleZoomOut = () => setScale(prev => Math.max(0.4, prev / 1.2));

  // 2B.10 — Reset View: resets scale and translation only, preserves node positions
  const handleResetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // 2B.9 — Fit Graph: calculates bounding box of all nodes and fits within viewport
  const handleFitGraph = () => {
    const positions = Array.from(nodePositionsRef.current.values());
    const canvas = canvasRef.current;
    if (positions.length === 0 || !canvas) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    positions.forEach(p => {
      minX = Math.min(minX, p.x - p.radius);
      maxX = Math.max(maxX, p.x + p.radius);
      minY = Math.min(minY, p.y - p.radius);
      maxY = Math.max(maxY, p.y + p.radius);
    });

    const padding = 60;
    const bboxW = Math.max(100, (maxX - minX) + padding * 2);
    const bboxH = Math.max(100, (maxY - minY) + padding * 2);
    const bboxCenterX = (minX + maxX) / 2;
    const bboxCenterY = (minY + maxY) / 2;

    const rect = canvas.getBoundingClientRect();
    const fitScale = Math.max(0.4, Math.min(2.5, Math.min(rect.width / bboxW, rect.height / bboxH)));

    const fitOffsetX = (rect.width / 2) - (bboxCenterX * fitScale);
    const fitOffsetY = (rect.height / 2) - (bboxCenterY * fitScale);

    setScale(fitScale);
    setOffset({ x: fitOffsetX, y: fitOffsetY });
  };

  const hoveredUser = users.find(u => u.id === hoveredNodeId);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-[#09090b] select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`w-full h-full block ${
          hoveredNodeId ? 'cursor-pointer' : isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* 2B.3 — Hover Tooltip */}
      {hoveredUser && hoverScreenPos && (
        <div
          className="absolute z-30 pointer-events-none p-2.5 rounded-lg bg-zinc-900/95 backdrop-blur-md border border-white/10 shadow-2xl text-xs space-y-0.5"
          style={{
            top: `${Math.min(window.innerHeight - 100, hoverScreenPos.y + 14)}px`,
            left: `${Math.min(window.innerWidth - 200, hoverScreenPos.x + 14)}px`
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-100">{hoveredUser.name}</span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
              #{hoveredUser.id}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">
            {hoveredUser.connectionCount} edges • {hoveredUser.role}
          </p>
        </div>
      )}

      {/* Info Badge for Unconnected Nodes */}
      {users.length > 0 && connections.length === 0 && (
        <div className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-[#18181b]/90 backdrop-blur-md border border-white/10 shadow-xl flex items-center gap-2 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-zinc-300 shrink-0" />
          <span>These users are currently not connected.</span>
        </div>
      )}

      {/* Community Legend Overlay */}
      <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-[#18181b]/90 backdrop-blur-md border border-white/10 shadow-xl space-y-2 text-xs">
        <div className="flex items-center gap-2 font-mono font-bold text-zinc-300 uppercase tracking-widest text-[10px] border-b border-white/10 pb-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-100" />
          <span>Communities</span>
        </div>
        <div className="space-y-1.5">
          {communities.map(comm => (
            <div key={comm.id} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: comm.color }} />
              <span className="text-zinc-300 truncate text-[11px] font-medium">{comm.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Viewport Toolbar Controls (Includes 2B.9 Fit Graph & 2B.10 Reset View) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-white/10 shadow-2xl z-20">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* 2B.9 — Fit Graph Button */}
        <button
          onClick={handleFitGraph}
          className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Fit Graph to Viewport"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* 2B.10 — Reset View Button */}
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Reset View"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />
        <span className="px-2 text-xs font-mono text-zinc-100 font-bold">
          {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
};
