import type { DocumentChunkInput } from "./types";

const DEFAULT_CHUNK_SIZE = 3200;
const DEFAULT_OVERLAP = 450;

export type ChunkTextOptions = {
  chunkSize?: number;
  overlap?: number;
  sourcePage?: number;
  sourceTitle?: string;
};

export function chunkText(
  text: string,
  {
    chunkSize = DEFAULT_CHUNK_SIZE,
    overlap = DEFAULT_OVERLAP,
    sourcePage,
    sourceTitle,
  }: ChunkTextOptions = {},
): DocumentChunkInput[] {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  if (overlap >= chunkSize) {
    throw new Error("Chunk overlap must be smaller than chunk size.");
  }

  const chunks: DocumentChunkInput[] = [];
  let start = 0;

  while (start < normalized.length) {
    const hardEnd = Math.min(start + chunkSize, normalized.length);
    const end = findReadableBoundary(normalized, start, hardEnd);
    const content = normalized.slice(start, end).trim();

    if (content) {
      chunks.push({
        content,
        chunkIndex: chunks.length,
        sourcePage,
        sourceTitle,
      });
    }

    if (end >= normalized.length) {
      break;
    }

    start = Math.max(0, end - overlap);
  }

  return chunks;
}

function findReadableBoundary(text: string, start: number, hardEnd: number) {
  if (hardEnd >= text.length) {
    return text.length;
  }

  const boundaryWindow = text.slice(start, hardEnd);
  const sentenceBoundary = Math.max(
    boundaryWindow.lastIndexOf(". "),
    boundaryWindow.lastIndexOf("? "),
    boundaryWindow.lastIndexOf("! "),
    boundaryWindow.lastIndexOf("; "),
  );

  if (sentenceBoundary > hardEnd - start - 500) {
    return start + sentenceBoundary + 1;
  }

  const spaceBoundary = boundaryWindow.lastIndexOf(" ");

  if (spaceBoundary > 0) {
    return start + spaceBoundary;
  }

  return hardEnd;
}
