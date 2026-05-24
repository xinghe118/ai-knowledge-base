"use server";

import { DocumentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { validateKnowledgeFile } from "@/lib/storage/file-validation";
import { saveUploadFile } from "@/lib/storage/local-storage";

export type UploadDocumentState = {
  error?: string;
  success?: string;
};

async function requireUserId() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

export async function uploadDocument(
  _previousState: UploadDocumentState,
  formData: FormData,
): Promise<UploadDocumentState> {
  const userId = await requireUserId();
  const knowledgeBaseId = String(formData.get("knowledgeBaseId") ?? "");
  const file = formData.get("file");

  if (!knowledgeBaseId) {
    return {
      error: "Create or select a knowledge base before uploading.",
    };
  }

  if (!(file instanceof File)) {
    return {
      error: "Select a file to upload.",
    };
  }

  const validation = validateKnowledgeFile(file);

  if (!validation.ok) {
    return {
      error: validation.error,
    };
  }

  const knowledgeBase = await prisma.knowledgeBase.findFirst({
    where: {
      id: knowledgeBaseId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!knowledgeBase) {
    return {
      error: "Knowledge base not found.",
    };
  }

  const { storagePath } = await saveUploadFile(file, userId);

  await prisma.document.create({
    data: {
      knowledgeBaseId,
      userId,
      fileName: file.name,
      fileType: validation.extension,
      fileSize: file.size,
      storagePath,
      status: DocumentStatus.PENDING,
    },
  });

  revalidatePath("/dashboard");

  return {
    success: "Document uploaded and queued for processing.",
  };
}
