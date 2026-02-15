# 🐼 Panda Portal

A genomic data center for panda research. Built with FastAPI + Next.js.

## Features

- **🔬 Genome Browser** - Interactive JBrowse2 visualization with IndexedFastaAdapter
- **🧬 BLAST Tool** - Sequence similarity search (mock results for demo)
- **📊 Dataset Management** - Upload and browse genomic datasets
- **🌳 Pedigree Database** - Family relationship visualization
- **👤 User Profiles** - Manage your account and preferences

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI + Python 3.11 |
| Frontend | Next.js 14 + TypeScript |
| Database | PostgreSQL + Redis (Docker) |
| Auth | JWT + bcrypt |
| Genome Browser | JBrowse2 + IndexedFastaAdapter |

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL + Redis (or use Docker)

### Installation

```bash
# Clone the repository
cd panda-portal

# Start database services
docker-compose up -d

# Setup backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install

# Run development servers
cd ../backend && uvicorn main:app --reload
cd ../frontend && npm run dev
```

### Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Test Account

- Email: `test2@example.com`
- Password: `testpass123`

## Project Structure

```
panda-portal/
├── backend/
│   ├── api/           # API endpoints
│   ├── db/           # Database models
│   ├── services/     # Business logic
│   └── main.py       # FastAPI app
├── frontend/
│   ├── src/
│   │   ├── pages/    # Next.js pages
│   │   ├── components/
│   │   └── lib/      # API client
│   └── public/
└── data/
    └── genomes/      # Reference genome data
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Genome Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/genome/species` | List species |
| GET | `/api/genome/{species}/refs` | List reference genomes |

### Datasets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/datasets` | List datasets |
| GET | `/api/datasets/{id}` | Get dataset details |
| POST | `/api/files/datasets` | Upload dataset |

### Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tools/blast` | Run BLAST search |
| GET | `/api/tools/blast/{id}` | Get BLAST results |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update profile |

## Reference Genomes

### Giant Panda (Ailuropoda melanoleuca)

| Assembly | Chromosomes | Size | Genes |
|----------|-------------|------|-------|
| ASM200744v3 (Complete) | 21 | 2.24 Gb | 218 |
| ASM200744v3 (Test) | 8 | 8.4 Kb | 8 |

Key Genes: BDNF, FGF2, LEPR, GHRH, GHRL, IGF1, DIO2, UCP1, NPY, AGRP, POMC, MC4R

## Development Notes

- Frontend runs on port 3000 (or 3001 if 3000 is busy)
- Backend runs on port 8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## License

MIT License
