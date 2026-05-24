# KnowFlow

AI knowledge base Q&A system built with Next.js, TypeScript, and Tailwind CSS.

The first target is a complete MVP loop:

```text
Login
-> Create knowledge base
-> Upload PDF / Markdown / TXT
-> Parse and chunk documents
-> Generate embeddings
-> Store vectors
-> Ask questions
-> Stream cited answers
-> Save chat history
```

## Current Status

This repository currently contains the project foundation and a product-shaped dashboard shell. The next implementation phase is authentication and database schema.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL + pgvector, planned
- Auth.js, planned
- OpenAI-compatible chat and embedding API, planned

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` when backend integration starts.

```bash
cp .env.example .env.local
```

## Database

The schema is defined in `prisma/schema.prisma`. The first migration enables `pgvector` and creates the user, knowledge base, document, chunk, chat, and usage tables.

Validate the schema:

```bash
npm run db:validate
```

Generate Prisma Client:

```bash
npm run db:generate
```

Run migrations after PostgreSQL is available:

```bash
npm run db:migrate
```

## Development Plan

See:

- `docs/DEVELOPMENT.md`
- `docs/MILESTONES.md`
