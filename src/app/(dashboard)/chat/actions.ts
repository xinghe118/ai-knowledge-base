"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth/session";
import { answerKnowledgeBaseQuestion } from "@/lib/rag/answer";

export async function askKnowledgeBaseQuestion(formData: FormData) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const knowledgeBaseId = String(formData.get("knowledgeBaseId") ?? "");
  const question = String(formData.get("question") ?? "").trim();

  if (!knowledgeBaseId || !question) {
    throw new Error("Select a knowledge base and enter a question.");
  }

  const result = await answerKnowledgeBaseQuestion({
    userId,
    knowledgeBaseId,
    question,
  });

  revalidatePath("/dashboard");

  return result;
}
