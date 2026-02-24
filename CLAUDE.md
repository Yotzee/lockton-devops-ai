# Lockton DevOps AI

## Project Structure

```
app/
├── backend/          # Go REST API service
│   └── src/          # Go module root (module: lockton-backend)
│       ├── main.go
│       ├── config/       # Environment-based configuration
│       ├── models/       # Data entities (DTOs and domain objects)
│       ├── repository/   # Data access layer (interfaces + Postgres implementations)
│       ├── service/      # Business logic layer (depends on repository interfaces)
│       ├── controllers/  # HTTP handlers (MVC controllers)
│       ├── routes/       # Chi router setup and middleware
│       └── mocks/        # Testify mock implementations for interfaces
└── frontend/         # Frontend application (TBD)
```

## Backend Architecture

**Pattern**: MVC + Repository/Service

- **Models** — Plain structs with JSON tags, used across all layers
- **Repository** — Interface-based data access; Postgres implementation via `database/sql` + `lib/pq`
- **Service** — Business logic and validation; depends on repository interfaces (not concrete types)
- **Controllers** — HTTP request/response handling; depends on service interfaces
- **Routes** — Chi router wiring with logging and recovery middleware

## Commands

### Run the backend
```bash
cd app/backend/src && go run .
```

### Run all tests
```bash
cd app/backend/src && go test ./...
```

### Run tests with verbose output
```bash
cd app/backend/src && go test -v ./...
```

### Run tests for a specific package
```bash
cd app/backend/src && go test -v ./service/
cd app/backend/src && go test -v ./repository/
cd app/backend/src && go test -v ./controllers/
```

## Environment Variables

| Variable      | Default     | Description            |
|---------------|-------------|------------------------|
| SERVER_PORT   | 8080        | HTTP server port       |
| DB_HOST       | localhost   | PostgreSQL host        |
| DB_PORT       | 5432        | PostgreSQL port        |
| DB_USER       | postgres    | PostgreSQL user        |
| DB_PASSWORD   | postgres    | PostgreSQL password    |
| DB_NAME       | lockton     | PostgreSQL database    |
| DB_SSLMODE    | disable     | PostgreSQL SSL mode    |

## API Endpoints

| Method | Path               | Description       |
|--------|--------------------|--------------------|
| GET    | /health            | Health check       |
| GET    | /api/v1/items      | List all items     |
| POST   | /api/v1/items      | Create an item     |
| GET    | /api/v1/items/{id} | Get item by ID     |
| PUT    | /api/v1/items/{id} | Update an item     |
| DELETE | /api/v1/items/{id} | Delete an item     |

## Key Dependencies

- **github.com/go-chi/chi/v5** — HTTP router
- **github.com/lib/pq** — PostgreSQL driver
- **github.com/stretchr/testify** — Test assertions and mocks
- **github.com/DATA-DOG/go-sqlmock** — SQL mock for repository tests

## Testing Strategy

- **Repository tests** use `go-sqlmock` to mock the `database/sql` layer
- **Service tests** use mock repositories (testify mocks in `mocks/` package)
- **Controller tests** use mock services + `httptest` for HTTP round-trip testing
- Each layer is tested in isolation; no real database required
