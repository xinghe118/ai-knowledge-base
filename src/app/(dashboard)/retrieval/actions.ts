"use server";

import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth/session";
import { searchKnowledgeBase } from "@/lib/rag/retrieval";

export async function searchKnowledgeBaseAction(formData: FormData) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const knowledgeBaseId = String(formData.get("knowledgeBaseId") ?? "");
  const question = String(formData.get("question") ?? "").trim();

  if (!knowledgeBaseId || !question) {
    return [];
  }

  return searchKnowledgeBase({
    userId,
    knowledgeBaseId,
    question,
  });
}
