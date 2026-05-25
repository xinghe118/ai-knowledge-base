# KnowFlow

KnowFlow is an AI knowledge base Q&A system built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, Prisma, and OpenAI-compatible APIs.

It supports the full MVP loop:

```text
Register / login
-> Create a knowledge base
-> Upload PDF / Markdown / TXT
-> Parse and chunk documents
-> Generate embeddings
-> Store embeddings
-> Ask questions
-> Generate cited answers
-> Save chat history
```

## Features

- Credentials authentication with hashed passwords.
- User-scoped knowledge bases.
- PDF, Markdown, and TXT upload.
- Local file storage under `uploads/`.
- Document parsing and chunking.
- Embedding generation through an OpenAI-compatible API.
- Cosine similarity retrieval over stored embeddings.
- RAG answer generation with source citations.
- Saved chat sessions and recent chat display.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma 7
- PostgreSQL
- NextAuth
- OpenAI-compatible chat and embedding APIs

## Requirements

- Node.js 22+
- PostgreSQL, or Docker
- OpenAI-compatible API key

## Local Setup

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Update `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/knowflow"
NEXTAUTH_SECRET="replace-with-a-secure-random-secret"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_CHAT_MODEL="gpt-4.1-mini"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
OPENAI_EMBEDDING_DIMENSIONS="1536"
```

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Or create the database manually:

```sql
CREATE DATABASE knowflow;
```

Run migrations and generate Prisma Client:

```bash
npm run db:migrate
npm run db:generate
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

Run the full local check:

```bash
npm run check
```

Or run individual checks:

```bash
npm run db:validate
npm run lint
npm run build
```

## Demo Flow

1. Register a new account.
2. Create a knowledge base.
3. Upload a TXT, Markdown, or PDF file.
4. Wait for the document to become `ready`.
5. Ask a question in the right-side Q&A panel.
6. Review the generated answer and citations.
7. Check recent chats below the Q&A panel.

## Notes

- Real `.env` files are ignored by Git.
- Uploaded files are ignored by Git through `/uploads`.
- The app stores files locally for development. S3 or Supabase Storage can replace this later.
- Embedding and chat generation require `OPENAI_API_KEY`.

## Development Plan

See:

- `docs/DEVELOPMENT.md`
- `docs/MILESTONES.md`
