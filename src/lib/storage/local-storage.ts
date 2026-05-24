import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export async function saveUploadFile(file: File, userId: string) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = getSafeExtension(file.name);
  const fileName = `${randomUUID()}${extension}`;
  const absoluteDir = path.join(process.cwd(), "uploads", userId);
  const absolutePath = path.join(absoluteDir, fileName);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, bytes);

  return {
    storagePath: path.join("uploads", userId, fileName).replaceAll("\\", "/"),
  };
}

function getSafeExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();

  if ([".pdf", ".md", ".markdown", ".txt"].includes(extension)) {
    return extension;
  }

  return "";
}
