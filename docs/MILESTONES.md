# Milestones

## 1. Project Foundation

Status: done

- Next.js project initialized.
- TypeScript, Tailwind CSS, and ESLint configured.
- Product dashboard shell created.
- Project README and environment template created.
- Lint and production build verified.

Done when:

- `npm run lint` passes.
- `npm run build` passes.
- The app runs locally.

## 2. Authentication

Status: done

- Add Auth.js.
- Add user model.
- Add login/register pages.
- Protect dashboard routes.
- Add credentials-based sign in.
- Add password hashing.
- Add logout control.

Done when:

- A user can register, log in, and log out.
- Anonymous users cannot access protected routes.

## 2.5 Database Foundation

Status: done

- Add Prisma.
- Add PostgreSQL and pgvector schema.
- Add initial migration SQL.
- Add database client.
- Add user-scoped data model indexes.
- Validate schema and generate Prisma Client.

Done when:

- `npm run db:validate` passes.
- `npm run db:generate` passes.
- A local PostgreSQL database can run the migration.

## 3. Knowledge Base Management

Status: done

- Add database schema for knowledge bases.
- Add create, rename, and delete actions.
- Add real dashboard data.
- Add user-scoped dashboard statistics.
- Add soft-delete behavior for knowledge bases.

Done when:

- Users can manage their own knowledge bases.
- Data is isolated by user.

## 4. Document Upload

Status: done

- Validate PDF, Markdown, and TXT uploads.
- Store file metadata.
- Parse text.
- Save document processing status.
- Store uploaded files locally under `uploads/`.
- Show recent uploaded documents on the dashboard.

Done when:

- Uploaded files are visible in the document list.
- Failed parsing is visible to the user.

## 5. Chunking And Embeddings

Status: done

- Split parsed documents into chunks.
- Parse TXT, Markdown, and PDF files.
- Store chunks in `DocumentChunk`.
- Update document status during processing.
- Generate embeddings.
- Store vectors in pgvector.
- Add retry-safe processing.
- Add knowledge-base scoped similarity retrieval.
- Add dashboard retrieval test form.

Done when:

- A question embedding can retrieve relevant document chunks.

## 6. Cited Chat

Status: pending

- Add chat sessions and messages.
- Build retrieval-augmented prompts.
- Stream answers.
- Persist citations.

Done when:

- A user can ask a question and get an answer with source citations.

## 7. Demo Readiness

Status: pending

- Add empty states.
- Add error states.
- Add tests for chunking and prompt construction.
- Add setup instructions.

Done when:

- The project can be cloned, configured, run, and demonstrated from the README.
