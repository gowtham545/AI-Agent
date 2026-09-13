# CircularFlow AI — FastAPI Backend (Phase 11 + 12 + 13)

Institutional Governance OS API backed by **FastAPI**, **SQLAlchemy 2.x**, and a **real hosted PostgreSQL database**.

> **Phase 13**: SQLite is no longer supported. A real hosted PostgreSQL database is required.

---

## Architecture

```
React + TypeScript Frontend (Vite, port 5173)
                ↓  HTTP REST
FastAPI Backend (uvicorn, port 8000)
                ↓  SQLAlchemy ORM  (psycopg2-binary driver)
         Hosted PostgreSQL
                ↓
     Persistent Institutional Data
```

**Security rule**: `DATABASE_URL` lives only in `backend/.env`. The React frontend never touches the database directly and never sees the connection string.

---

## Quick Start

### Step 1 — Create a free hosted PostgreSQL database

You need a real PostgreSQL database. Choose any provider (all have free tiers):

| Provider | URL | Free Tier |
|---|---|---|
| **Neon** | https://neon.tech | 512 MB, always free |
| **Supabase** | https://supabase.com | 500 MB, always free |
| **Railway** | https://railway.app | $5 credit/month |
| **ElephantSQL** | https://elephantsql.com | 20 MB (Tiny Turtle) |

After creating a database, copy the **connection string**. It looks like:

```
postgresql://username:password@host.region.provider.com:5432/dbname
```

For SSL-enabled providers (Neon, Supabase), it often ends with:

```
?sslmode=require
```

### Step 2 — Set up your local environment

```powershell
# From the backend/ directory:

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1     # Windows PowerShell
# source venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create your .env file
copy .env.example .env          # Windows
# cp .env.example .env          # macOS/Linux
```

### Step 3 — Configure DATABASE_URL

Edit `backend/.env` and replace the placeholder with your real connection string:

```ini
DATABASE_URL=postgresql://username:password@host:5432/dbname
```

Provider-specific examples:

```ini
# Neon (with SSL — required)
DATABASE_URL=postgresql://myuser:mypass@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require

# Supabase
DATABASE_URL=postgresql://postgres:mypass@db.abcdef.supabase.co:5432/postgres

# Railway
DATABASE_URL=postgresql://postgres:mypass@containers-us-west-123.railway.app:5432/railway

# Local PostgreSQL (if installed)
DATABASE_URL=postgresql://postgres:password@localhost:5432/circularflow
```

> **Important**: If `DATABASE_URL` is missing or starts with `sqlite://`, the server will refuse to start with a clear error message. SQLite is not accepted in Phase 13.

### Step 4 — Run database migrations

```powershell
alembic upgrade head
```

This creates all 8 tables in your PostgreSQL database:

| Table | Purpose |
|---|---|
| `departments` | University departments |
| `users` | Users with RBAC permission flags |
| `circulars` | Core directives with lineage (supersedes/superseded_by) |
| `circular_versions` | Version history per circular |
| `recipients` | Designated recipients |
| `acknowledgements` | Per-circular digital acknowledgement tracking |
| `actions` | Compliance action items |
| `audit_logs` | Full activity audit trail |

### Step 5 — Seed demo data

```powershell
python -m app.db.seed
```

Populates 8 tables with realistic Vignan University institutional data:
- 9 Departments, 3 Users, 7 Circulars, 5 Versions
- 10 Recipients, 8 Acknowledgements, 8 Actions, 8 Audit Logs

**Idempotent**: Safe to run multiple times. Uses `db.merge()` (upsert) — no duplicate records will be created.

### Step 6 — Start the backend server

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Step 7 — Verify PostgreSQL connectivity

```powershell
# Check health endpoint
curl http://127.0.0.1:8000/api/v1/health
```

Expected response when PostgreSQL is connected:

```json
{
  "status": "ok",
  "service": "CircularFlow AI Backend",
  "version": "1.0.0",
  "environment": "development",
  "database": "connected",
  "db_dialect": "postgresql",
  "db_driver": "psycopg2"
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Service index |
| GET | `/api/health` | Health + PostgreSQL connectivity |
| GET | `/api/v1/health` | Versioned health check |
| GET | `/api/v1/circulars` | List circulars from PostgreSQL |
| GET | `/api/v1/circulars/{id}` | Single circular by ID or ref number |
| GET | `/docs` | Swagger interactive API docs |
| GET | `/redoc` | ReDoc API reference |

### Query Parameters for GET /api/v1/circulars

```
?status=Active
?department=Academic%20Affairs
?category=Policy%20%26%20Compliance
?search=Biometric
?page=1&page_size=20
```

---

## Alembic Migration Commands

```powershell
# Apply all pending migrations (run this first on a fresh database)
alembic upgrade head

# Generate a new migration after changing a model
alembic revision --autogenerate -m "describe_your_change"

# Roll back the last migration
alembic downgrade -1

# See migration history
alembic history

# See current migration version applied to DB
alembic current
```

---

## File Structure

```text
backend/
├── app/
│   ├── main.py                     # FastAPI entry, CORS, routes
│   ├── config.py                   # Settings + PostgreSQL URL validation
│   ├── api/routes/
│   │   ├── health.py               # /health — reports PostgreSQL dialect & driver
│   │   └── circulars.py            # /circulars — reads from PostgreSQL via SQLAlchemy
│   ├── db/
│   │   ├── base.py                 # SQLAlchemy declarative Base
│   │   ├── database.py             # PostgreSQL engine, session, get_db(), get_db_info()
│   │   └── seed.py                 # Idempotent seed script (uses db.merge / upsert)
│   ├── models/                     # SQLAlchemy ORM models (8 tables)
│   ├── schemas/                    # Pydantic API schemas
│   └── services/
│       └── circular_service.py     # Business logic querying PostgreSQL
├── alembic/
│   ├── env.py                      # Reads DATABASE_URL from app config
│   └── versions/
│       └── *_initial_schema_all_tables.py
├── requirements.txt                # Python dependencies incl. psycopg2-binary
├── .env.example                    # Safe template — copy to .env
├── .env                            # Local config with real DATABASE_URL — NOT committed
├── .gitignore                      # Prevents .env, *.db, venv from Git
└── README.md
```

---

## Security Checklist

- [x] `DATABASE_URL` only exists in `backend/.env`
- [x] `.env` is listed in `.gitignore` and must never be committed
- [x] No credentials appear anywhere in source code
- [x] No credentials appear in any API response
- [x] No credentials are passed to or exposed in React frontend code
- [x] Health endpoint reports only `db_dialect` and `db_driver` — never the connection string
- [x] SQLite is explicitly rejected — prevents accidental silent fallback
- [x] Global exception handler strips internal stack traces from API responses

---

## Troubleshooting

### "PostgreSQL DATABASE_URL is not configured"
→ Your `backend/.env` is missing `DATABASE_URL`. Copy `.env.example` to `.env` and fill in your PostgreSQL connection string.

### "SQLite DATABASE_URL detected — this is not allowed"
→ Change your `DATABASE_URL` in `.env` from `sqlite://...` to `postgresql://...`

### "could not connect to server"
→ Check your hosted PostgreSQL is running. Verify host, port, username, password, and database name. For Neon/Supabase, ensure `?sslmode=require` is appended.

### "SSL connection is required"
→ Add `?sslmode=require` to your `DATABASE_URL`. Most hosted providers require SSL.

### Alembic "No such table" errors
→ Run `alembic upgrade head` to create all tables before starting the server.
