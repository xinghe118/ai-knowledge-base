import { prisma } from "./client";

type DashboardDocument = Awaited<
  ReturnType<typeof prisma.document.findMany>
>[number] & {
  knowledgeBase: {
    name: string;
  };
  _count: {
    chunks: number;
  };
};

type DashboardChat = Awaited<ReturnType<typeof prisma.chatSession.findMany>>[number] & {
  knowledgeBase: {
    name: string;
  };
  messages: Array<{
    content: string;
  }>;
};

export async function getDashboardData(userId: string) {
  const knowledgeBases = await prisma.knowledgeBase.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const knowledgeBaseIds = knowledgeBases.map((base) => base.id);

  if (knowledgeBaseIds.length === 0) {
    return {
      knowledgeBases: [],
      documents: [] as DashboardDocument[],
      recentChats: [] as DashboardChat[],
      documentCount: 0,
      chunkCount: 0,
      chatCount: 0,
    };
  }

  const knowledgeBasesWithCounts = knowledgeBases.map((base) => ({
    ...base,
    _count: {
      documents: 0,
      chats: 0,
    },
  }));

  return {
    knowledgeBases: knowledgeBasesWithCounts,
    documents: [] as DashboardDocument[],
    recentChats: [] as DashboardChat[],
    documentCount: 0,
    chunkCount: 0,
    chatCount: 0,
  };
}
