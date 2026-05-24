import { prisma } from "./client";

export async function getDashboardData(userId: string) {
  const [knowledgeBases, documents, documentCount, chunkCount, chatCount] =
    await Promise.all([
      prisma.knowledgeBase.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          _count: {
            select: {
              documents: true,
              chats: true,
            },
          },
        },
      }),
      prisma.document.findMany({
        where: {
          userId,
          knowledgeBase: {
            deletedAt: null,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
        include: {
          knowledgeBase: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              chunks: true,
            },
          },
        },
      }),
      prisma.document.count({
        where: {
          userId,
          knowledgeBase: {
            deletedAt: null,
          },
        },
      }),
      prisma.documentChunk.count({
        where: {
          userId,
          knowledgeBase: {
            deletedAt: null,
          },
        },
      }),
      prisma.chatSession.count({
        where: {
          userId,
          knowledgeBase: {
            deletedAt: null,
          },
        },
      }),
    ]);

  return {
    knowledgeBases,
    documents,
    documentCount,
    chunkCount,
    chatCount,
  };
}
