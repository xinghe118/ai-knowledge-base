import { ChatMessageRole } from "@prisma/client";

import { createChatCompletion } from "@/lib/ai/chat";
import { prisma } from "@/lib/db/client";
import { searchKnowledgeBase } from "./retrieval";
import type { Citation } from "./types";

type AnswerQuestionOptions = {
  userId: string;
  knowledgeBaseId: string;
  question: string;
};

export async function answerKnowledgeBaseQuestion({
  userId,
  knowledgeBaseId,
  question,
}: AnswerQuestionOptions) {
  const knowledgeBase = await prisma.knowledgeBase.findFirst({
    where: {
      id: knowledgeBaseId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!knowledgeBase) {
    throw new Error("Knowledge base not found.");
  }

  const chunks = await searchKnowledgeBase({
    userId,
    knowledgeBaseId,
    question,
    topK: 5,
  });

  const citations: Citation[] = chunks.map((chunk) => ({
    documentId: chunk.documentId,
    documentName: chunk.documentName,
    chunkId: chunk.chunkId,
    sourcePage: chunk.sourcePage,
    sourceTitle: chunk.sourceTitle,
    preview: chunk.preview,
  }));

  const answer =
    chunks.length > 0
      ? await createChatCompletion([
          {
            role: "system",
            content:
              "You answer questions using only the provided knowledge base context. If the context is insufficient, say the uploaded documents do not contain enough information. Do not invent facts or citations.",
          },
          {
            role: "user",
            content: buildRagPrompt(question, chunks),
          },
        ])
      : "I could not find enough relevant information in the uploaded documents to answer this question.";

  const chat = await prisma.chatSession.create({
    data: {
      knowledgeBaseId,
      userId,
      title: question.slice(0, 80),
      messages: {
        create: [
          {
            role: ChatMessageRole.USER,
            content: question,
          },
          {
            role: ChatMessageRole.ASSISTANT,
            content: answer,
            citationsJson: citations,
          },
        ],
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return {
    chatId: chat.id,
    answer,
    citations,
  };
}

function buildRagPrompt(
  question: string,
  chunks: Array<{
    content: string;
    documentName: string;
    sourcePage?: number;
    sourceTitle?: string;
  }>,
) {
  const context = chunks
    .map((chunk, index) => {
      const location = [
        chunk.sourceTitle ? `section: ${chunk.sourceTitle}` : null,
        chunk.sourcePage ? `page: ${chunk.sourcePage}` : null,
      ]
        .filter(Boolean)
        .join(", ");

      return [
        `[${index + 1}] ${chunk.documentName}${location ? ` (${location})` : ""}`,
        chunk.content,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "Question:",
    question,
    "",
    "Knowledge base context:",
    context,
    "",
    "Answer with a concise, source-grounded response.",
  ].join("\n");
}
