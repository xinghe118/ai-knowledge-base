"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Search } from "lucide-react";

import { searchKnowledgeBaseAction } from "@/app/(dashboard)/retrieval/actions";
import type { RetrievedChunk } from "@/lib/rag/types";

type RetrievalTestFormProps = {
  knowledgeBases: Array<{
    id: string;
    name: string;
  }>;
};

export function RetrievalTestForm({ knowledgeBases }: RetrievalTestFormProps) {
  const [results, setResults] = useState<RetrievedChunk[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasKnowledgeBases = knowledgeBases.length > 0;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError(null);
    startTransition(async () => {
      try {
        const chunks = await searchKnowledgeBaseAction(formData);
        setResults(chunks);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Retrieval failed. Check embedding configuration.",
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
        className="h-24 w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        disabled={!hasKnowledgeBases || isPending}
        name="question"
        placeholder="Test semantic retrieval against this knowledge base"
        required
      />
      <button
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!hasKnowledgeBases || isPending}
      >
        <Search size={16} aria-hidden />
        {isPending ? "Searching..." : "Search chunks"}
      </button>
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result) => (
            <article
              className="rounded-lg border border-slate-200 p-3"
              key={result.chunkId}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {result.documentName}
                </p>
                <span className="text-xs font-medium text-emerald-700">
                  {result.score.toFixed(3)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {result.preview}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </form>
  );
}
