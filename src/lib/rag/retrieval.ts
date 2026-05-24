import { createEmbedding } from "@/lib/ai/embeddings";
import { prisma } from "@/lib/db/client";
import { toPgVector } from "./vector";
import type { RetrievedChunk } from "./types";

type SearchKnowledgeBaseOptions = {
  userId: string;
  knowledgeBaseId: string;
  question: string;
  topK?: number;
  minScore?: number;
};

type RetrievedChunkRow = {
  chunkId: string;
  documentId: string;
  documentName: string;
  content: string;
  sourcePage: number | null;
  sourceTitle: string | null;
  score: number;
};

export async function searchKnowledgeBase({
  userId,
  knowledgeBaseId,
  question,
  topK = 5,
  minScore = 0,
}: SearchKnowledgeBaseOptions): Promise<RetrievedChunk[]> {
  const embedding = await createEmbedding(question);
  const vector = toPgVector(embedding);
  const rows = await prisma.$queryRawUnsafe<RetrievedChunkRow[]>(
    `
      SELECT
        dc.id AS "chunkId",
        d.id AS "documentId",
        d."fileName" AS "documentName",
        dc.content,
        dc."sourcePage",
        dc."sourceTitle",
        1 - (dc.embedding <=> $1::vector) AS score
      FROM document_chunks dc
      INNER JOIN documents d ON d.id = dc."documentId"
      INNER JOIN knowledge_bases kb ON kb.id = dc."knowledgeBaseId"
      WHERE dc."userId" = $2
        AND dc."knowledgeBaseId" = $3
        AND dc.embedding IS NOT NULL
        AND kb."deletedAt" IS NULL
      ORDER BY dc.embedding <=> $1::vector
      LIMIT $4
    `,
    vector,
    userId,
    knowledgeBaseId,
    topK,
  );

  return rows
    .filter((row) => row.score >= minScore)
    .map((row) => ({
      chunkId: row.chunkId,
      documentId: row.documentId,
      documentName: row.documentName,
      content: row.content,
      score: row.score,
      sourcePage: row.sourcePage ?? undefined,
      sourceTitle: row.sourceTitle ?? undefined,
      preview: row.content.slice(0, 240),
    }));
}
