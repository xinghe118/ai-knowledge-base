const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_CHAT_MODEL = "gpt-4.1-mini";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionResponse = {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function createChatCompletion(messages: ChatMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required to generate answers.");
  }

  const baseUrl = process.env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL;
  const model = process.env.OPENAI_CHAT_MODEL ?? DEFAULT_CHAT_MODEL;
  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`Chat completion failed: ${response.status} ${body}`);
  }

  const json = (await response.json()) as ChatCompletionResponse;
  const content = json.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Chat completion response did not include content.");
  }

  return content;
}
