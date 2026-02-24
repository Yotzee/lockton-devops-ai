# Lockton DevOps AI

## Workflow Rules

- **Commit and push** when a task is complete
- **Always write unit tests and mocks** for new code
- **All components and pages must have Storybook stories**
- **Update this file** when new context is added (new pages, components, resources, commands, patterns)

## Project Structure

```
app/
├── backend/              # Go REST API service
│   └── src/              # Go module root (module: lockton-backend)
│       ├── main.go
│       ├── config/       # Environment-based configuration
│       ├── models/       # Data entities (DTOs and domain objects)
│       ├── repository/   # Data access layer (interfaces + Postgres implementations)
│       ├── service/      # Business logic layer (depends on repository interfaces)
│       ├── controllers/  # HTTP handlers (MVC controllers)
│       ├── routes/       # Chi router setup and middleware
│       └── mocks/        # Testify mock implementations for interfaces
└── frontend/             # React SPA (TypeScript + Vite + Tailwind + shadcn/ui)
    ├── .storybook/       # Storybook configuration
    └── src/
        ├── components/   # Reusable UI components
        │   ├── ui/       # shadcn/ui primitives (Button, Input, Label, Card)
        │   ├── Layout/   # App shell with sidebar + main content area
        │   └── LeftNav/  # Sidebar navigation
        ├── pages/        # Route-level page components
        │   ├── LoginPage/
        │   ├── HomePage/
        │   └── ChatPage/  # AI Chat interface (mocked UI, bottom-up chat view)
        ├── resources/    # Shared state, context providers, data fetching
        │   └── auth.tsx  # AuthProvider + useAuth hook (static credentials)
        ├── lib/          # Utility functions (cn helper)
        └── test/         # Test setup and helpers
```

## Backend Architecture

**Pattern**: MVC + Repository/Service

- **Models** — Plain structs with JSON tags, used across all layers
- **Repository** — Interface-based data access; Postgres implementation via `database/sql` + `lib/pq`
- **Service** — Business logic and validation; depends on repository interfaces (not concrete types)
- **Controllers** — HTTP request/response handling; depends on service interfaces
- **Routes** — Chi router wiring with logging and recovery middleware

## Frontend Architecture

**Stack**: TypeScript, Vite, React, Tailwind CSS v4, shadcn/ui, Storybook v10

**Pattern**: Pages / Components / Resources

- **Pages** — Route-level components (LoginPage, HomePage, ChatPage), each in its own folder with `.tsx`, `.test.tsx`, `.stories.tsx`
- **Components** — Reusable UI (Layout, LeftNav, shadcn primitives), each with tests and stories
- **Resources** — Shared state and context (AuthProvider with static credentials: admin/admin, user/user)
- **Routing** — react-router-dom v7; Layout component wraps authenticated routes, redirects to /login when unauthenticated

### Authentication

Static credentials for development:
- `admin` / `admin` (role: admin)
- `user` / `user` (role: user)

AuthProvider accepts an optional `initialUser` prop for test pre-authentication.

## Commands

### Backend
```bash
cd app/backend/src && go run .             # Run the backend
cd app/backend/src && go test ./...        # Run all backend tests
cd app/backend/src && go test -v ./...     # Verbose backend tests
```

### Frontend
```bash
cd app/frontend && npm run dev             # Dev server
cd app/frontend && npm run build           # Production build
cd app/frontend && npm run test            # Run all frontend tests (vitest)
cd app/frontend && npm run test:watch      # Watch mode tests
cd app/frontend && npm run storybook       # Storybook dev server (port 6006)
cd app/frontend && npm run build-storybook # Build static storybook
```

## Environment Variables (Backend)

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

## Frontend Routes

| Path   | Component | Auth Required |
|--------|-----------|---------------|
| /login | LoginPage | No            |
| /      | HomePage  | Yes           |
| /chat  | ChatPage  | Yes           |

## Key Dependencies

### Backend
- **github.com/go-chi/chi/v5** — HTTP router
- **github.com/lib/pq** — PostgreSQL driver
- **github.com/stretchr/testify** — Test assertions and mocks
- **github.com/DATA-DOG/go-sqlmock** — SQL mock for repository tests

### Frontend
- **react / react-dom** — UI framework
- **react-router-dom** — Client-side routing
- **tailwindcss v4** — Utility-first CSS (via @tailwindcss/vite plugin)
- **class-variance-authority + clsx + tailwind-merge** — shadcn/ui styling
- **lucide-react** — Icon library
- **vitest + @testing-library/react + jsdom** — Unit testing
- **storybook v10 + @storybook/react-vite** — Component development and documentation

## Testing Strategy

### Backend
- **Repository tests** use `go-sqlmock` to mock the `database/sql` layer
- **Service tests** use mock repositories (testify mocks in `mocks/` package)
- **Controller tests** use mock services + `httptest` for HTTP round-trip testing
- Each layer is tested in isolation; no real database required

### Frontend
- **Resource tests** — Test auth context hooks directly with `renderHook`
- **Component tests** — Render with test providers (`renderWithProviders` helper), assert DOM
- **Page tests** — Full render with routing context, test user interactions with `@testing-library/user-event`
- **Storybook stories** — Every component and page has stories for visual development and documentation
- Test helpers in `src/test/helpers.tsx` provide wrapped render functions with AuthProvider + MemoryRouter
