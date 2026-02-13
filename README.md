# 🐼 Panda Genomics Portal

**A genomic data center for giant panda research**

## Features

- 🔬 Genome Browser (IGV.js + JBrowse2)
- 🧬 BLAST Sequence Alignment
- 📊 Dataset Browser
- 🐼 Pedigree Visualization
- 🔐 Multi-level User System
- 🌐 REST API

## Tech Stack

- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Backend:** FastAPI + Python
- **Database:** PostgreSQL
- **Genome Browsers:** IGV.js + JBrowse2

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+

### Local Development

```bash
# Start all services
docker-compose up -d

# Services:
# - Frontend: http://localhost:3000
# - Backend:  http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Manual Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Project Structure

```
panda-portal/
├── frontend/         # Next.js + TypeScript
├── backend/          # FastAPI + Python
├── data/             # Genomic data files
├── static/           # Static assets
└── docker-compose.yml
```

## License

MIT
