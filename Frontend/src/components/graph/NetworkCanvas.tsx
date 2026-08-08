import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGraph } from '../../context/GraphContext';
import { ZoomIn, ZoomOut, RefreshCw, Layers } from 'lucide-react';

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

  // Node Positions
  const nodePositionsRef = useRef<Map<string, NodePosition>>(new Map());
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const initializePositions = useCallback(() => {
    const map = new Map<string, NodePosition>();
    const width = 1000;
    const height = 700;

    const clusterCenters: { [key: string]: { x: number; y: number } } = {
      c1: { x: width * 0.28, y: height * 0.32 }, // Top-Left (Tech Innovators)
      c2: { x: width * 0.72, y: height * 0.32 }, // Top-Right (Data Scientists)
      c3: { x: width * 0.28, y: height * 0.72 }, // Bottom-Left (Product Designers)
      c4: { x: width * 0.72, y: height * 0.72 }  // Bottom-Right (Growth Engineers)
    };

    const communityCounts: { [key: string]: number } = { c1: 0, c2: 0, c3: 0, c4: 0 };

    users.forEach(user => {
      const commId = user.communityId || 'c1';
      const center = clusterCenters[commId] || { x: width / 2, y: height / 2 };
      const index = communityCounts[commId] || 0;
      communityCounts[commId] = index + 1;

      const radiusOffset = 80 + (index % 3) * 35;
      const angle = (index * (Math.PI * 2 / 6)) + (commId === 'c1' ? 0.3 : 0);

      const x = center.x + Math.cos(angle) * radiusOffset;
      const y = center.y + Math.sin(angle) * radiusOffset;
      const nodeRadius = Math.max(16, Math.min(26, 14 + user.connectionCount * 1.5));

      map.set(user.id, { id: user.id, x, y, radius: nodeRadius });
    });

    nodePositionsRef.current = map;
  }, [users]);

  useEffect(() => {
    if (nodePositionsRef.current.size === 0 || nodePositionsRef.current.size !== users.length) {
      initializePositions();
    }
  }, [users, initializePositions]);

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

    // Search matches
    const matchingSearchIds = new Set<string>();
    if (searchTerm.trim()) {
      users.forEach(u => {
        if (
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.username.toLowerCase().includes(searchTerm.toLowerCase())
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

    // 1. Draw Edges
    connections.forEach(conn => {
      const sourcePos = positions.get(conn.sourceUserId);
      const targetPos = positions.get(conn.targetUserId);
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2.5 / scale;
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1 / scale;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 2. Draw Nodes
    users.forEach(user => {
      if (communityFilter !== 'all' && user.communityId !== communityFilter) return;

      const pos = positions.get(user.id);
      if (!pos) return;

      const isSelected = selectedNodeId === user.id;
      const isHovered = hoveredNodeId === user.id;
      const isInPath = highlightedPath.includes(user.id);
      const isSearchMatch = matchingSearchIds.has(user.id);
      const commColor = communityColorMap[user.communityId] || '#ffffff';

      // Outer Highlight Ring
      if (isSelected || isSearchMatch || isInPath) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#ffffff' : isSearchMatch ? '#e4e4e7' : '#a1a1aa';
        ctx.lineWidth = 2.5 / scale;
        ctx.stroke();
      }

      // Base Node
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#18181b';
      ctx.fill();

      // Community Border
      ctx.lineWidth = (isHovered ? 4 : 2.5) / scale;
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
      if (nodeLabelsVisible || isSelected || isHovered || isSearchMatch) {
        ctx.fillStyle = isSelected ? '#ffffff' : '#a1a1aa';
        ctx.font = `${isSelected ? 'bold' : '500'} ${11 / scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(user.name, pos.x, pos.y + pos.radius + 5);
      }
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

  const screenToCanvasPoint = (screenX: number, screenY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (screenX - rect.left - offset.x) / scale;
    const y = (screenY - rect.top - offset.y) / scale;
    return { x, y };
  };

  const getNodeAtPoint = (point: Point): string | null => {
    const positions = nodePositionsRef.current;
    for (const [id, pos] of positions.entries()) {
      const dx = point.x - pos.x;
      const dy = point.y - pos.y;
      if (dx * dx + dy * dy <= pos.radius * pos.radius) {
        return id;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = screenToCanvasPoint(e.clientX, e.clientY);
    const clickedNodeId = getNodeAtPoint(pt);

    if (clickedNodeId) {
      setDraggingNodeId(clickedNodeId);
      setSelectedNodeId(clickedNodeId);
    } else {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = screenToCanvasPoint(e.clientX, e.clientY);

    if (draggingNodeId) {
      const pos = nodePositionsRef.current.get(draggingNodeId);
      if (pos) {
        pos.x = pt.x;
        pos.y = pt.y;
        render();
      }
    } else if (isPanning) {
      setOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else {
      const hoverId = getNodeAtPoint(pt);
      if (hoverId !== hoveredNodeId) {
        setHoveredNodeId(hoverId);
      }
    }
  };

  const handleMouseUp = () => {
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
  const handleResetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    initializePositions();
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-[#09090b] select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

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

      {/* Viewport Toolbar Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-white/10 shadow-2xl">
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
