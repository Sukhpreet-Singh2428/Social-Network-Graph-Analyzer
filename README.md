# Social-Network-Graph-Analyzer

---

## Backend Setup

### Prerequisites

- **JDK 17** (or newer)
- **Apache Maven 3.8+**

### Running the backend

```bash
cd Backend
mvn spring-boot:run
```

The API server starts on **http://localhost:8080** by default.

### Health check

Verify the backend is running:

```
GET http://localhost:8080/api/health
```

Expected response:

```json
{ "status": "UP", "service": "social-network-graph-analyzer" }
```

### CORS

The backend allows requests from `http://localhost:5173` (Vite dev server default).
If your frontend runs on a different port, update the `ALLOWED_ORIGIN` constant
in `Backend/src/main/java/com/snga/config/CorsConfig.java`.