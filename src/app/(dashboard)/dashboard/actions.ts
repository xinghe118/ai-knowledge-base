"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";

const knowledgeBaseSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240).optional(),
});

async function requireUserId() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

export async function createKnowledgeBase(formData: FormData) {
  const userId = await requireUserId();
  const parsed = knowledgeBaseSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  await prisma.knowledgeBase.create({
    data: {
      userId,
      name: parsed.data.name,
      description: parsed.data.description,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateKnowledgeBase(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");
  const parsed = knowledgeBaseSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!id || !parsed.success) {
    return;
  }

  await prisma.knowledgeBase.updateMany({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteKnowledgeBase(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await prisma.knowledgeBase.updateMany({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
}
