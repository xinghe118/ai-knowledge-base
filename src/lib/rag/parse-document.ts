import { readFile } from "node:fs/promises";

import { PDFParse } from "pdf-parse";

import type { ParsedDocument } from "./types";

export async function parseStoredDocument(
  storagePath: string,
  fileType: string,
): Promise<ParsedDocument> {
  const buffer = await readFile(storagePath);
  const normalizedType = fileType.toLowerCase();

  if (normalizedType === ".pdf") {
    const parser = new PDFParse({ data: buffer });
    const [textResult, infoResult] = await Promise.all([
      parser.getText(),
      parser.getInfo(),
    ]);

    await parser.destroy();

    return {
      text: textResult.text,
      title: infoResult.info?.Title,
    };
  }

  if (
    normalizedType === ".md" ||
    normalizedType === ".markdown" ||
    normalizedType === ".txt"
  ) {
    const text = buffer.toString("utf-8");

    return {
      title: getTitleFromText(text),
      text,
    };
  }

  throw new Error(`Unsupported document type: ${fileType}`);
}

function getTitleFromText(text: string) {
  const firstHeading = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  return firstHeading?.replace(/^#+\s*/, "");
}
