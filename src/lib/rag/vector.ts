export function toPgVector(vector: number[]) {
  return `[${vector.map((value) => formatVectorNumber(value)).join(",")}]`;
}

function formatVectorNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Embedding vector contains a non-finite value.");
  }

  return Number(value).toPrecision(8);
}
