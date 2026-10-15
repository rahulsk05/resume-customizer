# ResumeTailor

ResumeTailor is an AI-powered resume customization web application that tailors an existing resume to a specific job description.

Users can create reusable **Resume Profiles**, add job applications against a selected profile, and generate a tailored resume with a match score, feedback, suggestions, and a section-wise change view.

## Live Demo

- **Frontend:** https://resume-customizer-ui.vercel.app
- **Backend API:** https://resume-customizer-api-8ca9.onrender.com
- **API Documentation:** https://resume-customizer-api-8ca9.onrender.com/docs
- **Demo Video:** https://drive.google.com/file/d/1TRHslDFemJv0DViMimvqrg3xcITpcvhA/view?usp=sharing

## Project Overview

The application follows this hierarchy:

```text
User
 └── Resume Profiles
      └── Job Applications
           └── Tailored Resume / Analysis Result
```

### Main Features

- User signup, login and logout
- JWT authentication using an HttpOnly cookie
- Multiple reusable Resume Profiles
- PDF/DOCX resume upload with file validation
- Deterministic resume text extraction
- Gemini-based resume structuring
- Job Description analysis
- Resume-to-JD semantic retrieval using RAG
- AI-generated resume tailoring
- Match score
- Feedback and suggestions
- Section-wise change tracking
- ATS-friendly standardized tailored resume output
- PDF/DOCX download support
- Job application history with pagination
- Processing state while AI analysis is running
- User-specific data isolation

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic / Pydantic Settings
- PostgreSQL
- pgvector
- Argon2id
- PyMuPDF
- python-docx
- ReportLab

### AI / RAG

- Google Gemini API
- `gemini-2.5-flash` — resume analysis and tailoring
- `gemini-embedding-001` — resume/JD embeddings
- PostgreSQL + pgvector for vector similarity search
- Direct Gemini SDK integration (`google-genai`)
- No LangChain or LlamaIndex

## LLM and RAG Approach

The application uses a two-stage approach for resume analysis.

### Resume Processing

```text
PDF / DOCX
    ↓
Deterministic text extraction
    ↓
Raw resume text
    ↓
Gemini structuring
    ↓
Canonical resume JSON
```

The structured resume is kept as the source of truth. The application does not modify the original Resume Profile when generating a tailored version.

### RAG Pipeline

Relevant resume content is indexed as semantic entries in PostgreSQL using pgvector.

```text
Canonical Resume
      ↓
Semantic resume entries
      ↓
Gemini Embeddings
      ↓
PostgreSQL + pgvector
```

For a Job Description:

```text
Job Description
      ↓
Query embedding
      ↓
Profile-scoped vector similarity search
      ↓
Top relevant resume evidence
      ↓
Gemini
      ↓
Tailored Resume + Match Score + Feedback + Suggestions + Changes
```

The RAG layer helps the generation step focus on relevant evidence from the selected Resume Profile while preventing the model from needing to rely only on a large unstructured resume prompt.

## Architecture

ResumeTailor is implemented as a modular monolith backend with a separate Next.js frontend.

```text
                        ┌──────────────────────┐
                        │      Next.js UI      │
                        │   TypeScript + React │
                        └──────────┬───────────┘
                                   │ REST API
                                   ▼
                        ┌──────────────────────┐
                        │     FastAPI API      │
                        │      Python          │
                        └──────────┬───────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
        │ PostgreSQL   │   │   pgvector   │   │ Google Gemini│
        │              │   │              │   │     API      │
        └──────────────┘   └──────────────┘   └──────────────┘
```

### Backend Request Flow

```text
Controller
    ↓
Service
    ↓
Repository / RAG / AI Services
    ↓
Database / Gemini API
```

The backend uses asynchronous I/O for database and external API operations and keeps module-specific logic separated into controllers, services, repositories and schemas.

## Deployment Architecture

The application is deployed using Vercel, Render and Render PostgreSQL.

```text
                         GitHub
                           │
                  ┌────────┴────────┐
                  │                 │
                  ▼                 ▼
              Vercel             Render
           Next.js Frontend    FastAPI Backend
                                  │
                         ┌────────┴─────────┐
                         │                  │
                         ▼                  ▼
                  Render PostgreSQL     Gemini API
                    + pgvector
```

### Deployment

- **Frontend:** Vercel
- **Backend:** Render Web Service
- **Database:** Render PostgreSQL
- **Vector Search:** PostgreSQL with pgvector
- **LLM:** Google Gemini API
- **Source Control:** GitHub

The production frontend communicates with the FastAPI backend through REST APIs. Authentication is maintained using a secure HttpOnly cookie.

## Local Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Python 3.11+
- PostgreSQL
- Git

A PostgreSQL database with the `vector` extension enabled is required for RAG functionality.

### 1. Clone the repository

```bash
git clone https://github.com/rahulsk05/resume-customizer.git
cd resume-customizer
```

### 2. Backend Setup

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell execution policy prevents activation, the virtual environment's Python executable can be used directly.

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
backend/.env
```

Use the provided `.env.example` as the reference and configure:

```env
APP_NAME=Resume Customizer API
APP_ENV=development

DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/resume_customizer

JWT_SECRET=your-secure-secret
JWT_EXPIRES_IN_MINUTES=60

JWT_COOKIE_NAME=access_token
JWT_COOKIE_SECURE=false
JWT_COOKIE_HTTP_ONLY=true
JWT_COOKIE_SAME_SITE=lax

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=models/gemini-embedding-001
GEMINI_EMBEDDING_DIMENSION=768

FRONTEND_URL=http://localhost:3000
```

Enable pgvector in the PostgreSQL database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Run database migrations:

```bash
python -m alembic upgrade head
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

The local API will be available at:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

## Environment Variables

Environment files containing secrets must not be committed to Git.

Use the following files as references:

```text
backend/.env.example
frontend/.env.example
```

Required backend configuration includes:

- Database connection
- JWT configuration
- Gemini API key and model configuration
- Frontend origin

Required frontend configuration:

- Backend API URL

## Project Structure

```text
resume_customizer/
├── backend/
│   ├── alembic/
│   ├── app/
│   ├── .env.example
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── public/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## API Documentation

When the backend is running, FastAPI provides interactive API documentation through Swagger UI:

```text
/docs
```

The deployed API documentation is available at:

https://resume-customizer-api-8ca9.onrender.com/docs

## Known Limitations and Trade-offs

This project was designed as a focused hiring assignment, so implementation choices intentionally prioritize clarity and scope over large-scale infrastructure.

- AI analysis is asynchronous from the user's perspective through a processing state and frontend polling; a background job infrastructure such as Celery/Redis is not used.
- No WebSocket connection is used for analysis progress.
- There is one current analysis result per Job Application in the current implementation.
- Resume formatting from the uploaded PDF/DOCX is not preserved; the generated resume uses the application's standardized ATS-friendly template.
- The application relies on Gemini for resume structuring and tailoring, so AI output quality depends on the supplied resume, Job Description and model response.
- RAG uses PostgreSQL/pgvector rather than a dedicated vector database to keep the architecture simple for the assignment.
- Vector search uses profile-scoped similarity retrieval and a configurable top-K rather than introducing a more complex retrieval pipeline.
- The Render PostgreSQL free-tier database used for the demo has service/lifecycle limitations and is intended for assignment/demo use rather than production workloads.
- The deployed application is not designed as a high-scale production system; enterprise infrastructure such as Redis, Celery, Kafka, Kubernetes or microservices is intentionally outside the assignment scope.

## Security Considerations

- Passwords are hashed using Argon2id.
- JWTs are stored in HttpOnly cookies rather than browser local storage.
- Production authentication cookies use Secure settings.
- API keys and secrets are provided through environment variables.
- User-owned resources are scoped to the authenticated user.
- Uploaded resume files are validated before processing.
- Internal backend/LLM errors are not exposed directly to users.

## Design Principles

The project follows a few core principles:

- Keep the implementation simple and assignment-focused.
- Avoid unnecessary infrastructure and abstractions.
- Keep the Resume Profile immutable during tailoring.
- Never intentionally fabricate resume information.
- Separate API, business logic, persistence and AI/RAG responsibilities.
- Keep configuration and secrets outside source control.
- Prefer reusable components and consistent API contracts.

## Future Improvements

Possible improvements for a production-scale version include:

- Background job processing with a dedicated task queue
- Streaming analysis updates
- More advanced retrieval and reranking
- Automated evaluation of generated resume claims
- Multiple tailored versions per Job Application
- More advanced ATS analysis
- Usage monitoring and cost controls
- Object storage for uploaded documents when long-term retention is required
- Automated CI/CD checks and test coverage expansion

## License

This project was created as a hiring assignment and demonstration project.
