const SUPPORTED_FILE_TYPES = new Map([
  ["application/pdf", ".pdf"],
  ["text/markdown", ".md"],
  ["text/plain", ".txt"],
]);

const SUPPORTED_EXTENSIONS = new Set([".pdf", ".md", ".markdown", ".txt"]);
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export type FileValidationInput = {
  name: string;
  type?: string;
  size: number;
};

export function validateKnowledgeFile(file: FileValidationInput) {
  const extension = getFileExtension(file.name);
  const hasSupportedMime = file.type
    ? SUPPORTED_FILE_TYPES.has(file.type)
    : false;
  const hasSupportedExtension = SUPPORTED_EXTENSIONS.has(extension);

  if (!hasSupportedMime && !hasSupportedExtension) {
    return {
      ok: false,
      error: "Only PDF, Markdown, and TXT files are supported.",
    } as const;
  }

  if (file.size <= 0) {
    return {
      ok: false,
      error: "The selected file is empty.",
    } as const;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: "Files must be 20 MB or smaller.",
    } as const;
  }

  return {
    ok: true,
    extension,
  } as const;
}

function getFileExtension(fileName: string) {
  const index = fileName.lastIndexOf(".");

  if (index === -1) {
    return "";
  }

  return fileName.slice(index).toLowerCase();
}
