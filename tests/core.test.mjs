import assert from "node:assert/strict";
import test from "node:test";

const { chunkText } = await import("../src/lib/rag/chunk-text.ts");
const { validateKnowledgeFile } = await import(
  "../src/lib/storage/file-validation.ts"
);

test("chunkText splits long text with stable indexes", () => {
  const text = Array.from({ length: 40 }, (_, index) => `Sentence ${index}.`).join(
    " ",
  );
  const chunks = chunkText(text, {
    chunkSize: 80,
    overlap: 10,
  });

  assert.ok(chunks.length > 1);
  assert.deepEqual(
    chunks.map((chunk) => chunk.chunkIndex),
    chunks.map((_, index) => index),
  );
});

test("validateKnowledgeFile accepts supported document extensions", () => {
  const result = validateKnowledgeFile({
    name: "notes.md",
    type: "text/markdown",
    size: 128,
  });

  assert.equal(result.ok, true);
  assert.equal(result.extension, ".md");
});

test("validateKnowledgeFile rejects unsupported extensions", () => {
  const result = validateKnowledgeFile({
    name: "image.png",
    type: "image/png",
    size: 128,
  });

  assert.equal(result.ok, false);
});
