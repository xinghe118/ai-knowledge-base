"use client";

import { useState, useTransition, type FormEvent } from "react";
import { MessageSquareText } from "lucide-react";

import { askKnowledgeBaseQuestion } from "@/app/(dashboard)/chat/actions";
import type { Citation } from "@/lib/rag/types";

type AskQuestionFormProps = {
  knowledgeBases: Array<{
    id: string;
    name: string;
  }>;
};

type AnswerState = {
  answer: string;
  citations: Citation[];
};

export function AskQuestionForm({ knowledgeBases }: AskQuestionFormProps) {
  const [result, setResult] = useState<AnswerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasKnowledgeBases = knowledgeBases.length > 0;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError(null);
    startTransition(async () => {
      try {
        const response = await askKnowledgeBaseQuestion(formData);
        setResult({
          answer: response.answer,
          citations: response.citations,
        });
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Question answering failed. Check AI configuration.",
        );
      }
    });
  }

  return (
    <form className="space-y-4 px-5 py-5" onSubmit={onSubmit}>
      <select
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        disabled={!hasKnowledgeBases || isPending}
        name="knowledgeBaseId"
        required
      >
        {hasKnowledgeBases ? (
          knowledgeBases.map((base) => (
            <option key={base.id} value={base.id}>
              {base.name}
            </option>
          ))
        ) : (
          <option value="">Create a knowledge base first</option>
        )}
      </select>
      <textarea
        className="h-28 w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        disabled={!hasKnowledgeBases || isPending}
        name="question"
        placeholder="Ask a question about the selected knowledge base"
        required
      />
      <button
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!hasKnowledgeBases || isPending}
      >
        <MessageSquareText size={16} aria-hidden />
        {isPending ? "Answering..." : "Ask with citations"}
      </button>
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {result ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm leading-6 text-slate-800">{result.answer}</p>
          </div>
          {result.citations.length > 0 ? (
            <div className="space-y-3">
              {result.citations.map((citation) => (
                <article
                  className="rounded-lg border border-slate-200 p-3"
                  key={citation.chunkId}
                >
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {citation.documentName}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {citation.sourceTitle || "Source chunk"}
                    {citation.sourcePage ? ` · Page ${citation.sourcePage}` : ""}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {citation.preview}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
