# Social Network Graph Analyzer — Final Technical Walkthrough & Handoff Document

**Release Version**: Final Integration Release (Production Ready).  
**Backend**: Java 17 / Spring Boot 3.3.5 (`http://localhost:8080`).  
**Frontend**: React 19 / TypeScript / Vite / Tailwind CSS v4 (`http://localhost:5173`).

---

## 1. Project Overview

The **Social Network Graph Analyzer** is a full-stack web application designed for interactive graph visualization, social network topology metrics, graph traversals, and mutual connection recommendations.

With the final integration sprint complete, core graph algorithms (Shortest Path, Connected Component Detection, Friends-of-Friends Suggestions, Mutual Connections) are owned and computed by the Spring Boot backend, while the frontend provides an interactive HTML5 `<canvas>` visualization, real-time metrics dashboard, and educational BFS/DFS traversal step visualizations.

---

## 2. Final Architecture

```
+-----------------------------------------------------------------------------------+
|                            Spring Boot Backend (Port 8080)                        |
|                                                                                   |
|  Graph.java (In-Memory Topology & Adjacency Sets)                                 |
|       │                                                                           |
|       ▼                                                                           |
|  GraphService.java (BFS Path, Connected Components, Mutual Suggestions)           |
|       │                                                                           |
|       ▼                                                                           |
|  REST Controllers:                                                                |
|  - UserController (/api/users, /api/users/{id}/suggestions, /mutual-friends)      |
|  - FriendshipController (/api/friendships)                                        |
|  - GraphController (/api/graph, /api/graph/path, /api/graph/communities)          |
|  - HealthController (/api/health)                                                 |
+------------------------------------------+----------------------------------------+
                                           | REST JSON API
                                           v
+-----------------------------------------------------------------------------------+
|                        React 19 + TypeScript Frontend                             |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | API Client Layer (src/api/client.ts, userApi.ts, connectionApi.ts)         |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Central State Context (src/context/GraphContext.tsx)                        |  |
|  | - Single Source of Truth for loaded users, connections, & communities        |  |
|  | - Delegates shortest path & communities to API client                        |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|            +---------------------------+---------------------------+              |
|            |                                                       |              |
|            v                                                       v              |
|  +-----------------------------------+             +---------------------------+  |
|  | Interactive HTML5 Canvas          |             | Educational & Presentation|  |
|  | (src/components/graph/            |             | Graph Utilities           |  |
|  |  NetworkCanvas.tsx)               |             | (src/utils/               |  |
|  | - Incremental Position Stability  |             |  graphAlgorithms.ts)      |  |
|  | - Hover Tooltips & Hit-Testing    |             | - BFS Level Traversal     |  |
|  | - Neighbor Dimming & Highlighting |             | - Iterative DFS Stack     |  |
|  | - Fit Graph & Viewport Controls   |             | - Network Analytics       |  |
|  | - Dynamic N-Cluster Circular      |             |   Calculations            |  |
|  +-----------------------------------+             +---------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Technology Stack

- **Backend**: Java 17 LTS, Spring Boot 3.3.5, Spring Web, Jakarta Validation, Maven.
- **Frontend**: React 19.2.8, TypeScript 6.0.2, Vite 8.2.1, Tailwind CSS v4.3.3, Lucide React icons, Recharts 3.10.1.
- **Testing**: Vitest 4.1.11 (`npm test`).
- **Linting**: Oxlint 1.75.0 (`npm run lint`).

---

## 4. Frontend Folder Structure

```
Frontend/
├── src/
│   ├── api/                 # Native fetch REST client bindings
│   │   ├── client.ts        # Base fetch wrapper & typed exception handling
│   │   ├── userApi.ts       # User & suggestion bindings (/api/users)
│   │   └── connectionApi.ts # Graph, path, & community bindings (/api/graph, /api/friendships)
│   ├── components/
│   │   ├── common/          # StatCard, Modal, Tooltips
│   │   ├── graph/           # NetworkCanvas.tsx & NodeDetailsPanel.tsx
│   │   ├── layout/          # Navbar, Sidebar, ToastContainer
│   │   └── modals/          # AddUserModal, AddConnectionModal, ConfirmDeleteModal
│   ├── context/
│   │   └── GraphContext.tsx # Centralized state provider & data transformer
│   ├── data/
│   │   └── mockData.ts      # Type fallback definitions
│   ├── pages/               # 9 Core View Pages
│   │   ├── Dashboard.tsx    # Topology health diagnostics & stats
│   │   ├── NetworkGraphPage.tsx # Full screen interactive canvas
│   │   ├── UsersPage.tsx    # User directory (Grid & Table views)
│   │   ├── ConnectionsPage.tsx # Edge directory
│   │   ├── PathFinderPage.tsx # Backend Shortest Path & Educational BFS/DFS
│   │   ├── CommunitiesPage.tsx # Backend Connected Components
│   │   ├── SuggestionsPage.tsx # Backend Mutual Friends Recommendations
│   │   ├── AnalyticsPage.tsx # Degree distribution & network density
│   │   └── SettingsPage.tsx # Theme, labels, backup export
│   ├── types/
│   │   └── index.ts         # Central TypeScript interfaces
│   └── utils/
│       ├── graphAlgorithms.ts # Retained educational traversal & analytics functions
│       └── graphAlgorithms.test.ts # Vitest unit test suite (8 tests)
├── vitest.config.ts         # Vitest runner configuration
└── package.json             # Scripts: dev, build, test, lint
```

---

## 5. Backend API Contract

| Endpoint | Method | Request Body | Response Body | Frontend Usage | Error Handling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | None | `{"status": "UP", "service": "social-network-graph-analyzer"}` | Server health verification | `500` -> Offline alert |
| `/api/users` | `GET` | None | `[{"id": 1, "name": "Alice"}]` | User listing & lookup | `500` -> Error banner |
| `/api/users` | `POST` | `{"id": 1, "name": "Alice"}` | `{"id": 1, "name": "Alice"}` | `AddUserModal` submit | `400` -> Invalid input, `409` -> Duplicate ID toast |
| `/api/users/{id}` | `DELETE` | None | None | `ConfirmDeleteModal` submit | `404` -> User missing toast |
| `/api/users/{id}/friends` | `GET` | None | `[2, 3]` | User direct friends list | `404` -> User missing |
| `/api/graph` | `GET` | None | `{"nodes": [...], "edges": [...]}` | Canvas & `GraphContext` | `500` -> Global error state with Retry button |
| `/api/graph/path` | `GET` | `?source=1&target=6` | `{"source": 1, "target": 6, "path": [1,2,5,6], "distance": 3}` | `PathFinderPage` & `GraphContext.findPath` | Disconnected pair returns `200 OK` with `distance: -1` and `path: []` (rendered as "No path found", NOT an error). `404` for missing nodes. |
| `/api/graph/communities` | `GET` | None | `{"communities": [{"id": 1, "members": [1,2,3], "size": 3, "internalEdgeCount": 2}]}` | `CommunitiesPage` & Canvas circular layout | `500` -> Error state |
| `/api/users/{id}/suggestions` | `GET` | None | `[{"userId": 3, "name": "Charlie", "mutualFriendCount": 1, "mutualFriends": [2]}]` | `SuggestionsPage` | `404` -> Missing user, `200 []` for no candidates |
| `/api/users/{id}/mutual-friends/{otherId}` | `GET` | None | `{"userId1": 1, "userId2": 2, "mutualFriends": [3], "count": 1}` | Inspector panel | `400` -> Same user, `404` -> Missing user |
| `/api/friendships` | `POST` | `{"userId1": 1, "userId2": 2}` | `{"message": "Friendship created"}` | `AddConnectionModal` | `400` -> Self-friendship, `404` -> Missing user, `409` -> Duplicate edge toast |
| `/api/friendships` | `DELETE` | `{"userId1": 1, "userId2": 2}` | None | `ConfirmDeleteModal` | `404` -> Connection missing |

---

## 6. Data Flow

```
Backend Storage (Graph.java)
       │
       ▼
Spring Boot REST Controllers
       │  (JSON API on http://localhost:8080)
       ▼
API Client Layer (src/api/client.ts, userApi.ts, connectionApi.ts)
       │  (Typed fetch responses with status exception handling)
       ▼
GraphContext (src/context/GraphContext.tsx)
       │  (Single source of truth for users, connections, communities)
       ├──────────────────────────────────────┐
       ▼                                      ▼
Canvas Renderer (NetworkCanvas.tsx)      UI Pages & Educational Utilities
- Stable node positioning                - PathFinderPage (Shortest Path API)
- Hover tooltips & hit-testing           - CommunitiesPage (Communities API)
- Selected neighbor dimming              - SuggestionsPage (Suggestions API)
- Fit Graph & view transforms            - AnalyticsPage (Degree distribution)
```

---

## 7. Data Models

### A. Backend Types
- `User`: `{ id: number, name: string }`
- `Graph`: `{ nodes: [{ id, name }], edges: [{ source, target }] }`
- `PathResponse`: `{ source: number, target: number, path: number[], distance: number }`
- `CommunityResponse`: `{ communities: [{ id: number, members: number[], size: number, internalEdgeCount: number }] }`
- `SuggestionResponse`: `{ userId: number, name: string, mutualFriendCount: number, mutualFriends: number[] }`

### B. Frontend Types (`src/types/index.ts`)
- `User`: Full presentational object containing `id` (stringified), `name`, `username`, `email`, `avatar`, `role`, `location`, `status`, `communityId`, `communityName`, `connectionCount`, `degreeCentrality`.
- `Connection`: `{ id, sourceUserId, targetUserId, sourceUserName, targetUserName, sourceUserAvatar, targetUserAvatar, connectionType, status, connectedSince, strength }`.
- `Community`: `{ id: string, name: string, color: string, bgGlow: string, memberCount: number, connectionCount: number, density: number, mostConnectedMember: string, description: string, memberIds: string[] }`.

---

## 8. ID Conventions

- **Backend**: Numeric integer (`number`), e.g. `1`, `2`.
- **Frontend**: String (`string`), e.g. `'1'`, `'2'`, for string key compatibility in React state, canvas maps, and URL search params.
- **Boundary Conversion**:
  - **Reading API**: `transformUser` converts `backendUser.id` via `String(backendUser.id)`.
  - **Calling API**: Frontend converts string IDs back to integer numbers using `parseInt(strId, 10)` before invoking `userApi` / `connectionApi` endpoints.

---

## 9. Undirected Graph Semantics

- Friendship edges are strictly undirected and symmetric.
- A connection between user 1 and user 2 represents a single edge `(1, 2)`.
- Backend normalizes edge pairs such that `source < target`.
- Duplicate connection creation is prevented both on backend (`Set` storage) and frontend (pre-submit check & HTTP 409 handling).

---

## 10. Graph Visualization (HTML5 Canvas)

`NetworkCanvas.tsx` renders nodes and edges onto a high-resolution HTML5 canvas:

- **Incremental Position Stability**: `updateNodePositions()` retains existing node coordinates in `nodePositionsRef.current`. Adding or deleting users/connections does not alter positions of existing nodes.
- **Dynamic Circular Cluster Layout**: Calculates component centers evenly around a circle for $N$ dynamic backend communities.
- **Hit-Testing & Coordinate Conversion**: `screenToGraphPoint` translates mouse screen coordinates into canvas graph space considering pan offset, zoom scale, pixel ratio, and element offset.
- **Hover & Tooltips**: Mousemove events perform reverse z-order hit-testing, changing cursor to `pointer` and displaying a monochrome floating tooltip div.
- **Click Selection & Neighbor Highlighting**: Click selection highlights the active node and direct neighbors while dimming unrelated nodes (`globalAlpha = 0.25`).

---

## 11. Graph Algorithms: Backend-Owned vs. Frontend-Educational

| Algorithm | Owner | Execution Location | Rationale |
| :--- | :--- | :--- | :--- |
| **Shortest Path** | **Backend** | `GET /api/graph/path` | Graph query algorithm; backend BFS guarantees authoritative shortest path. |
| **Connected Components** | **Backend** | `GET /api/graph/communities` | Graph partition algorithm; backend BFS discovers graph clusters. |
| **Friend Suggestions** | **Backend** | `GET /api/users/{id}/suggestions` | Recommendation algorithm; backend ranks friends-of-friends by mutual count. |
| **Mutual Connections** | **Backend** | `GET /api/users/{id}/mutual-friends/{otherId}` | Graph query algorithm; backend returns set intersection. |
| **BFS Traversal Demo** | **Frontend** | `bfsTraversal` in `graphAlgorithms.ts` | Educational step visualization; allows users to explore level-order step traversal. |
| **DFS Traversal Demo** | **Frontend** | `dfsTraversal` in `graphAlgorithms.ts` | Educational step visualization; allows users to explore iterative stack sequence. |
| **Network Analytics** | **Frontend** | `computeNetworkAnalytics` in `graphAlgorithms.ts` | Derived presentation metrics (averages, graph density, degree frequency histogram). |

---

## 12. Communities Integration

- `GraphContext.tsx` fetches `GET /api/graph/communities` inside `refetchData()`.
- Maps backend community ordinals to presentational `Community` objects.
- User nodes are dynamically assigned their backend `communityId` (`c_1`, `c_2`, etc.) and `communityName`.
- `CommunitiesPage.tsx` renders cluster cards, summary metrics, and roster modals.

---

## 13. Suggestions Integration

- `SuggestionsPage.tsx` invokes `userApi.getSuggestions(numUserId)` when a user is selected.
- Candidate users are displayed with mutual friend count, mutual friends sample pills, and a working "Connect Node" action (`addConnection`).

---

## 14. Analytics Formulas

Implemented in `computeNetworkAnalytics()`:
- **Total Vertices ($N$)**: `users.length`
- **Total Edges ($E$)**: `connections.length`
- **Average Degree**: $\frac{2E}{N}$ for $N > 0$, else `0`
- **Graph Density**: $\frac{2E}{N(N-1)}$ for $N > 1$, else `0`
- **Degree Centrality**: $\frac{\text{degree}}{N-1}$ for $N > 1$, else `0`
- **Isolated Vertices Count**: count of users where `connectionCount === 0`
- **Degree Distribution**: frequency histogram of nodes per degree count

---

## 15. Dashboard

`Dashboard.tsx` displays real-time graph intelligence:
- Key stat cards: Total Vertices, Total Edges, Active Clusters, Avg Degree, Graph Density, Top Influencer.
- Interactive canvas preview banner.
- Top Centrality Influencers table.
- **Network Topology Diagnostics** panel: Isolated Vertices ($N=1$), Largest Component Size, Peak Degree Count.
- Zero fake activity feed data.

---

## 16. Loading, Error, and Empty States

- **Loading**: `usersLoading || connectionsLoading` renders animated `Loader2` spinners.
- **Error**: Server outage renders red alert cards with a **Retry Connection** button calling `refetchData()`.
- **Empty**: 0 users or 0 connections render clean guidance cards ("No users yet in graph database", "No connections created yet").
- **Disconnected Shortest Path**: `distance === -1` renders "No path found between these nodes" card (HTTP 200 OK, no error toast).

---

## 17. CRUD Flow

1. **Create User**: `AddUserModal` $\rightarrow$ `POST /api/users` $\rightarrow$ Backend `addUser` $\rightarrow$ Toast $\rightarrow$ `refetchData()`.
2. **Delete User**: `ConfirmDeleteModal` $\rightarrow$ `DELETE /api/users/{id}` $\rightarrow$ Backend `removeUser` (cascades edges) $\rightarrow$ Toast $\rightarrow$ `refetchData()`.
3. **Create Connection**: `AddConnectionModal` $\rightarrow$ `POST /api/friendships` $\rightarrow$ Backend `addFriendship` $\rightarrow$ Toast $\rightarrow$ `refetchData()`.
4. **Delete Connection**: `ConfirmDeleteModal` $\rightarrow$ `DELETE /api/friendships` $\rightarrow$ Backend `removeFriendship` $\rightarrow$ Toast $\rightarrow$ `refetchData()`.

---

## 18. Frontend/Backend Responsibility Split

| Feature / Responsibility | Backend (`Backend/`) | Frontend (`Frontend/`) |
| :--- | :--- | :--- |
| Graph Topology Storage | **Owner** (In-Memory `Graph.java`) | Consumes snapshot (`GET /api/graph`) |
| User Node CRUD | **Owner** (`/api/users`) | Renders forms & calls API |
| Friendship Edge CRUD | **Owner** (`/api/friendships`) | Renders forms & calls API |
| Shortest Path Calculation | **Owner** (`GET /api/graph/path`) | Calls API & highlights canvas route |
| Connected Component Detection | **Owner** (`GET /api/graph/communities`) | Calls API & renders cluster cards |
| Mutual Friends Recommendations | **Owner** (`GET /api/users/{id}/suggestions`) | Calls API & renders suggestion cards |
| Canvas Node & Edge Rendering | None | **Owner** (HTML5 Canvas) |
| Viewport Pan, Zoom, Fit Graph | None | **Owner** (Canvas state) |
| Educational BFS/DFS Demos | None | **Owner** (`bfsTraversal`, `dfsTraversal`) |
| Presentation Metrics & Charts | None | **Owner** (`computeNetworkAnalytics`) |

---

## 19. Removed Redundant Frontend Algorithms

The following local algorithm functions were **completely removed** from `Frontend/src/utils/graphAlgorithms.ts` and `graphAlgorithms.test.ts` because the backend now owns them:

1. `bfsShortestPath` $\rightarrow$ replaced by `GET /api/graph/path`
2. `findConnectedComponents` $\rightarrow$ replaced by `GET /api/graph/communities`
3. `getSuggestions` $\rightarrow$ replaced by `GET /api/users/{id}/suggestions`

---

## 20. Remaining Frontend Algorithms

The following pure utility functions are intentionally retained in `Frontend/src/utils/graphAlgorithms.ts`:

1. `buildAdjacencyList`: Symmetric adjacency list builder.
2. `bfsTraversal`: Educational level-order traversal generator for UI step demonstration.
3. `dfsTraversal`: Educational iterative stack traversal generator for UI step demonstration.
4. `computeNetworkAnalytics`: Derived metrics calculator for average degree, graph density, degree histogram, and centrality rankings.

---

## 21. Automated Testing Results (`npm test`)

Ran **Vitest 4.1.11** unit test runner (`npm test`):

```
 RUN  v4.1.11 D:/Social-Network-Graph-Analyzer/Frontend

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Duration  870ms
```

- `bfsTraversal` tests: single node, level grouping, disconnected component traversal. (All Passed)
- `dfsTraversal` tests: single node, iterative stack cycle handling. (All Passed)
- `computeNetworkAnalytics` tests: $N=0$ safety, $N=1$ safety, $N=2$ metrics calculation. (All Passed)

---

## 22. Build Verification (`npm run build`)

Ran `npm run build` (`tsc -b && vite build`):

```
vite v8.2.1 building client environment for production...
transforming...✓ 2397 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.90 kB │ gzip:   0.48 kB
dist/assets/index-BEDuEJjA.css   36.12 kB │ gzip:   7.04 kB
dist/assets/index-HHR_jYgi.js   733.53 kB │ gzip: 207.22 kB

✓ built in 6.47s
```

**Result**: Production build compiled with **exit code 0** and zero TypeScript errors.

---

## 23. Runtime & End-to-End Verification

- **Backend Startup**: Spring Boot started on port `8080` (process running on Tomcat).
- **Health Check**: `GET http://localhost:8080/api/health` returned `200 OK` (`{"status":"UP","service":"social-network-graph-analyzer"}`).
- **Phase E Test Graph Executed**:
  - Users created: Alice(1), Bob(2), Charlie(3), David(4), Eve(5), Frank(6), IsolatedUser(7).
  - Edges created: 1-2, 2-3, 3-4, 2-5, 5-6.
- **Shortest Path Verified**: `GET /api/graph/path?source=1&target=6` returned `path: [1,2,5,6], distance: 3`. Disconnected pair (1 to 7) returned `distance: -1, path: []` with `200 OK` (rendered cleanly as "No path found").
- **Communities Verified**: `GET /api/graph/communities` returned 2 components (Component 1 size 6, Component 2 size 1).
- **Suggestions Verified**: `GET /api/users/1/suggestions` returned Charlie and Eve (mutual friends with Bob).
- **Browser Console**: Clean, zero runtime errors.

---

## 24. Known Limitations

1. **In-Memory Graph Store**: The backend uses an in-memory graph model (`Graph.java`). Restarting the Spring Boot backend resets data to empty.
2. **Canvas Pixel Bounds**: HTML5 Canvas uses fixed coordinate bounds (`1000x700`) for precise hit-testing accuracy.

---

## 25. Backend Contributor Handoff Notes

- **CORS Config**: `CorsConfig.java` allows `http://localhost:5173`.
- **API Response Formats**: All backend endpoints match the documented contract exactly.
- **Cascading Deletions**: Deleting a user in `GraphService.removeUser(id)` automatically removes all associated edges, keeping graph topology clean.

---

## 26. Final Integration Checklist

- [x] **API contract verified** (Every endpoint inspected and tested against live backend).
- [x] **User CRUD verified** (Create, list, and delete user flow tested).
- [x] **Connection CRUD verified** (Create and delete friendship edge flow tested).
- [x] **Graph canvas rendering verified** (Nodes, edges, and incremental position stability).
- [x] **Graph canvas interaction verified** (Hover tooltips, click selection, neighbor dimming, Fit Graph, Escape clearing).
- [x] **Path Finder integrated** (`GET /api/graph/path` wired, disconnected `distance: -1` handled cleanly without error toast).
- [x] **BFS traversal verified** (Educational level-order traversal retained on frontend).
- [x] **DFS traversal verified** (Educational iterative stack traversal retained on frontend).
- [x] **Communities integrated** (`GET /api/graph/communities` wired, dynamic cluster cards & circular canvas layout).
- [x] **Suggestions integrated** (`GET /api/users/{id}/suggestions` wired, mutual connection ranking displayed).
- [x] **Analytics verified** (Mathematically safe metrics calculation for $N=0$ and $N=1$).
- [x] **Dashboard verified** (Real network topology diagnostics, zero fake activity feed).
- [x] **Error handling verified** (Graceful backend offline alert with Retry button).
- [x] **Empty states verified** (Prompts for 0 users or 0 connections).
- [x] **Responsive UI checked** (Desktop, laptop, tablet, and mobile breakpoints).
- [x] **Accessibility checked** (`aria-label` attributes and keyboard Escape listener).
- [x] **Automated tests verified** (8/8 Vitest unit tests passed).
- [x] **`npm run build` passes** (Clean build with exit code 0).
- [x] **Browser console checked** (Zero runtime console errors).
- [x] **Redundant algorithms removed** (`bfsShortestPath`, `findConnectedComponents`, `getSuggestions` deleted from frontend).
- [x] **Final walkthrough generated** (`FINAL_PROJECT_WALKTHROUGH.md`).

---

### Final Project Status

**READY FOR HANDOFF** — The full-stack integration between the Spring Boot backend and React 19 frontend is complete, fully tested, and verified end-to-end.
