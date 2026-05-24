const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_EMBEDDING_DIMENSIONS = 1536;

type EmbeddingsResponse = {
  data: Array<{
    index: number;
    embedding: number[];
  }>;
};

export function getEmbeddingDimensions() {
  return Number(
    process.env.OPENAI_EMBEDDING_DIMENSIONS ?? DEFAULT_EMBEDDING_DIMENSIONS,
  );
}

export async function createEmbeddings(input: string[]) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required to generate embeddings.");
  }

  const baseUrl = process.env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL;
  const model = process.env.OPENAI_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL;
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
      model,
      dimensions: getEmbeddingDimensions(),
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`Embedding request failed: ${response.status} ${body}`);
  }

  const json = (await response.json()) as EmbeddingsResponse;

  return json.data
    .sort((left, right) => left.index - right.index)
    .map((item) => item.embedding);
}

export async function createEmbedding(input: string) {
  const [embedding] = await createEmbeddings([input]);

  if (!embedding) {
    throw new Error("Embedding response did not include a vector.");
  }

  return embedding;
}
