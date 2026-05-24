# Local Demo Guide

## Progress

Current MVP progress: 7 of 7 planned stages complete.

## Before Running

Make sure these are available:

- Node.js 22+
- PostgreSQL
- pgvector extension
- OpenAI-compatible API key

## Environment

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_CHAT_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536
```

## Database

Create database:

```sql
CREATE DATABASE knowflow;
```

Enable extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Apply schema:

```bash
npm run db:migrate
```

## Demo Script

1. Open `http://localhost:3000`.
2. Register an account.
3. Create a knowledge base named `Demo Docs`.
4. Upload a small `.txt` or `.md` file first.
5. Confirm the document status becomes `ready`.
6. Ask a question that is answerable from the uploaded file.
7. Confirm the answer includes citations.
8. Refresh the page and confirm the recent chat remains visible.

## Troubleshooting

- If registration fails, check `DATABASE_URL`.
- If upload succeeds but processing fails, check `OPENAI_API_KEY`.
- If PDF parsing fails, try a text-based PDF first. Scanned image PDFs need OCR, which is not part of the MVP.
- If vector search fails, confirm `CREATE EXTENSION IF NOT EXISTS vector;` was run on the target database.
