import { DocumentStatus } from "@prisma/client";

import { createEmbeddings } from "@/lib/ai/embeddings";
import { prisma } from "@/lib/db/client";
import { chunkText } from "@/lib/rag/chunk-text";
import { parseStoredDocument } from "@/lib/rag/parse-document";

export async function processDocument(documentId: string, userId: string) {
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      userId,
      knowledgeBase: {
        deletedAt: null,
      },
    },
  });

  if (!document) {
    throw new Error("Document not found.");
  }

  await prisma.document.update({
    where: {
      id: document.id,
    },
    data: {
      status: DocumentStatus.PROCESSING,
      errorMessage: null,
    },
  });

  try {
    const parsed = await parseStoredDocument(
      document.storagePath,
      document.fileType,
    );
    const chunks = chunkText(parsed.text, {
      sourceTitle: parsed.title || document.fileName,
    });

    if (chunks.length === 0) {
      throw new Error("No extractable text was found in this document.");
    }

    const embeddings = await createEmbeddings(
      chunks.map((chunk) => chunk.content),
    );

    await prisma.$transaction(async (tx) => {
      await tx.documentChunk.deleteMany({
        where: {
          documentId: document.id,
          userId,
        },
      });

      await tx.documentChunk.createMany({
        data: chunks.map((chunk) => ({
          documentId: document.id,
          knowledgeBaseId: document.knowledgeBaseId,
          userId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          tokenCount: estimateTokenCount(chunk.content),
          sourcePage: chunk.sourcePage,
          sourceTitle: chunk.sourceTitle,
        })),
      });

      const createdChunks = await tx.documentChunk.findMany({
        where: {
          documentId: document.id,
          userId,
        },
        orderBy: {
          chunkIndex: "asc",
        },
        select: {
          id: true,
          chunkIndex: true,
        },
      });

      for (const chunk of createdChunks) {
        const embedding = embeddings[chunk.chunkIndex];

        if (!embedding) {
          throw new Error("Missing embedding for document chunk.");
        }

        await tx.documentChunk.updateMany({
          where: {
            id: chunk.id,
            userId,
          },
          data: {
            embeddingJson: embedding,
          },
        });
      }

      await tx.document.update({
        where: {
          id: document.id,
        },
        data: {
          status: DocumentStatus.READY,
          errorMessage: null,
        },
      });
    });

    return {
      chunkCount: chunks.length,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Document processing failed.";

    await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        status: DocumentStatus.FAILED,
        errorMessage: message,
      },
    });

    throw error;
  }
}

function estimateTokenCount(text: string) {
  return Math.ceil(text.length / 4);
}
