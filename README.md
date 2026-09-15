# NetPulse — Social Network Graph Analyzer

A full-stack social network analytics platform that models users and friendships as a graph, and exposes real graph algorithms — shortest path, community detection, mutual connections, and friend suggestions — as a REST API with an interactive visualization layer on top.

**Live Demo:** [social-network-graph-analyzer-beryl.vercel.app](https://social-network-graph-analyzer-beryl.vercel.app/)
**Backend API:** [social-network-graph-analyzer-g4wu.onrender.com](https://social-network-graph-analyzer-g4wu.onrender.com/api/health)

> Note: the backend runs on Render's free tier, which spins down after inactivity. The first request after idle time may take 30–60 seconds to wake up — please give it a moment on first load.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Vite](https://img.shields.io/badge/Vite-purple)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Overview

Social platforms like LinkedIn or Facebook rely on graph theory under the hood — degrees of separation, mutual friends, friend suggestions, and community clusters are all classic graph problems. This project builds that system from scratch: a Java backend that models the social graph as an in-memory adjacency list and implements the actual algorithms (BFS, DFS/connected components, set-based intersection), paired with a React frontend that visualizes the network interactively.

The backend and frontend are deliberately separated by responsibility:
- **Backend** owns all graph data and algorithms — nothing is duplicated or faked on the client.
- **Frontend** owns presentation, interaction, and visualization — it consumes the backend's REST API for every real computation.

## Features

- **Interactive network graph** — canvas-based visualization of users (nodes) and friendships (edges), with hover, selection, and neighbor highlighting.
- **Shortest path / degrees of separation** — BFS-based pathfinding between any two users, correctly distinguishing "no path exists" from an actual error.
- **Community detection** — connected-components analysis to surface friend clusters.
- **Mutual friends** — set-intersection lookup between any two users.
- **Friend suggestions** — friends-of-friends ranked by mutual connection count.
- **Full CRUD** — add/remove users and friendships through the API and UI.
- **Network analytics dashboard** — density, average degree, and topology diagnostics computed from live graph data.

## Tech Stack

**Backend**
- Java 17, Spring Boot 3.3.5, Maven
- In-memory graph model (`HashMap` / `HashSet` adjacency list) — no database, by design, to keep the focus on the algorithms
- Dockerized, deployed on Render

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS
- HTML5 Canvas for graph rendering
- Deployed on Vercel

## Architecture

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│   React + TypeScript (SPA)  │  REST   │   Spring Boot Backend         │
│                              │◄───────►│                                │
│  • Network canvas renderer  │  JSON   │  Graph.java                    │
│  • API client layer         │         │   └─ adjacency list model      │
│  • State context            │         │   └─ BFS / DFS algorithms      │
│  • Dashboard & analytics    │         │  GraphService                  │
│                              │         │   └─ validation, orchestration │
│  Deployed on Vercel          │         │  REST Controllers              │
└─────────────────────────────┘         │   └─ Users / Friendships /     │
                                          │      Graph / Health            │
                                          │  Deployed on Render (Docker)   │
                                          └──────────────────────────────┘
```

## API Reference

All error responses share one consistent shape: `{ "message": "...", "status": <code> }`

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/users` | GET | List all users |
| `/api/users` | POST | Create a user — `{ "id": 1, "name": "Alice" }` |
| `/api/users/{id}` | DELETE | Delete a user (cascades friendship removal) |
| `/api/users/{id}/friends` | GET | List a user's direct friends |
| `/api/friendships` | POST | Create a friendship — `{ "userId1": 1, "userId2": 2 }` |
| `/api/friendships` | DELETE | Remove a friendship |
| `/api/graph` | GET | Full graph snapshot — all nodes + deduplicated edges |
| `/api/graph/path?source={id}&target={id}` | GET | BFS shortest path between two users |
| `/api/graph/communities` | GET | Connected components (friend clusters) |
| `/api/users/{id}/mutual-friends/{otherId}` | GET | Mutual friends between two users |
| `/api/users/{id}/suggestions` | GET | Friends-of-friends ranked by mutual connections |

## Getting Started

### Prerequisites
- JDK 17
- Maven
- Node.js + npm

### Run the backend
```bash
cd Backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`. Health check: `http://localhost:8080/api/health`

### Run the frontend
```bash
cd Frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

### Run frontend tests
```bash
cd Frontend
npm test
```

## Project Structure

```
Social-Network-Graph-Analyzer/
├── Backend/
│   ├── src/main/java/com/snga/
│   │   ├── model/          # Graph.java — pure Java graph + algorithms
│   │   ├── service/        # GraphService — validation & orchestration
│   │   ├── controller/     # REST endpoints
│   │   ├── dto/            # Request/response shapes
│   │   └── config/         # CORS configuration
│   └── Dockerfile
└── Frontend/
    ├── src/
    │   ├── api/             # REST client layer
    │   ├── components/      # Network canvas, UI components
    │   ├── context/         # Central graph state
    │   ├── pages/            # Dashboard, Path Finder, Communities, Suggestions
    │   └── utils/            # Presentational analytics helpers
    └── vite.config.ts
```

## Design Notes

- **Why no database?** The project's focus is graph algorithms, not persistence. Keeping the graph in memory as plain Java collections (`HashMap<Integer, Set<Integer>>`) keeps the algorithm layer framework-agnostic, easy to reason about, and simple to test in isolation.
- **Disconnected pairs aren't errors.** `GET /api/graph/path` returns `200` with `distance: -1` when no path exists between two valid users — a disconnected pair is a legitimate graph query result, not a failure.
- **Algorithms live in one place.** All graph logic sits in `Graph.java` with no Spring dependency, so it can be read, tested, and explained independently of the web framework around it.

## Contributors

- **Sukhpreet Singh** — Backend architecture, graph algorithms, REST API, deployment ([GitHub](https://github.com/Sukhpreet-Singh2428))
- **Prince Mathur** — Frontend architecture, network visualization, UI/UX

## License

This project is licensed under the MIT License.
