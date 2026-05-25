# Development Document

The root workspace contains a broader planning document. This file keeps the project-local version for implementation work inside this repository.

## MVP Goal

Build a complete AI knowledge base Q&A workflow:

```text
User login
-> Create knowledge base
-> Upload document
-> Parse and chunk document
-> Generate embeddings
-> Store vectors
-> Ask questions
-> Retrieve relevant chunks
-> Generate cited answer
-> Save chat history
```

## MVP Scope

Included:

- Authentication.
- Knowledge base CRUD.
- PDF, Markdown, and TXT upload.
- Document parsing and chunking.
- Embedding generation.
- Vector search with pgvector.
- Chat Q&A with citations.
- Chat history.

Excluded for the first version:

- Team workspaces.
- Role-based permissions.
- OCR.
- Web crawling.
- Payment.
- Public sharing.
- Advanced analytics.

## Architecture

```text
Browser
-> Next.js App Router
-> Server Actions / Route Handlers
-> Application services
-> PostgreSQL
-> AI provider
```

Core modules:

- `lib/auth`: session and current-user helpers.
- `lib/db`: database client and repositories.
- `lib/storage`: upload persistence.
- `lib/rag`: parsing, chunking, retrieval, citation mapping.
- `lib/ai`: chat and embedding provider wrappers.
- `components/chat`: chat UI and citation display.
- `components/documents`: upload and processing UI.
- `components/dashboard`: workspace overview.

## Data Model Draft

```text
User
KnowledgeBase
Document
DocumentChunk
ChatSession
ChatMessage
UsageLog
```

Every user-owned table must include `userId` and every query must be scoped to the current user.

## RAG Rules

- Retrieval must be scoped by `userId` and `knowledgeBaseId`.
- Answers should use only retrieved context.
- If retrieved context is insufficient, the assistant should say it cannot answer from the uploaded documents.
- Citations must map to stored document chunks.
- API keys must stay server-side.
- Embeddings are stored as JSON for broad PostgreSQL compatibility; retrieval uses application-level cosine similarity.

## Implementation Status

Current MVP progress: complete.

Completed stages:

1. Project shell and documentation.
2. Database schema.
3. Authentication.
4. Knowledge base CRUD.
5. Document upload and parsing.
6. Chunking, embeddings, and retrieval.
7. Cited chat.
8. Demo readiness.

## First Implementation Order

1. Project shell and documentation.
2. Database schema.
3. Authentication.
4. Knowledge base CRUD.
5. Document upload and parsing.
6. Chunking and embeddings.
7. Retrieval and cited chat.
8. Polish, tests, and demo data.
