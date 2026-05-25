import { createEmbedding } from "@/lib/ai/embeddings";
import { prisma } from "@/lib/db/client";
import type { RetrievedChunk } from "./types";

type SearchKnowledgeBaseOptions = {
  userId: string;
  knowledgeBaseId: string;
  question: string;
  topK?: number;
  minScore?: number;
};

export async function searchKnowledgeBase({
  userId,
  knowledgeBaseId,
  question,
  topK = 5,
  minScore = 0,
}: SearchKnowledgeBaseOptions): Promise<RetrievedChunk[]> {
  const embedding = await createEmbedding(question);
  const chunks = await prisma.documentChunk.findMany({
    where: {
      userId,
      knowledgeBaseId,
      embeddingJson: {
        not: undefined,
      },
      knowledgeBase: {
        deletedAt: null,
      },
    },
    include: {
      document: {
        select: {
          id: true,
          fileName: true,
        },
      },
    },
  });

  return chunks
    .map((chunk) => {
      const chunkEmbedding = parseEmbedding(chunk.embeddingJson);

      return {
        chunk,
        score: chunkEmbedding ? cosineSimilarity(embedding, chunkEmbedding) : 0,
      };
    })
    .filter((item) => item.score >= minScore)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK)
    .map(({ chunk, score }) => ({
      chunkId: chunk.id,
      documentId: chunk.document.id,
      documentName: chunk.document.fileName,
      content: chunk.content,
      score,
      sourcePage: chunk.sourcePage ?? undefined,
      sourceTitle: chunk.sourceTitle ?? undefined,
      preview: chunk.content.slice(0, 240),
    }));
}

function parseEmbedding(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const vector = value.map((item) => Number(item));

  if (vector.some((item) => !Number.isFinite(item))) {
    return null;
  }

  return vector;
}

function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;

    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}
