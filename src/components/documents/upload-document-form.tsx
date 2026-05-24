"use client";

import { useActionState } from "react";
import { UploadCloud } from "lucide-react";

import {
  uploadDocument,
  type UploadDocumentState,
} from "@/app/(dashboard)/documents/actions";

type UploadDocumentFormProps = {
  knowledgeBases: Array<{
    id: string;
    name: string;
  }>;
};

const initialState: UploadDocumentState = {};

export function UploadDocumentForm({
  knowledgeBases,
}: UploadDocumentFormProps) {
  const [state, formAction, isPending] = useActionState(
    uploadDocument,
    initialState,
  );
  const hasKnowledgeBases = knowledgeBases.length > 0;

  return (
    <form
      action={formAction}
      className="grid gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto]"
    >
      <select
        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
      <input
        accept=".pdf,.md,.markdown,.txt,application/pdf,text/markdown,text/plain"
        className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        disabled={!hasKnowledgeBases || isPending}
        name="file"
        required
        type="file"
      />
      <button
        className="flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!hasKnowledgeBases || isPending}
      >
        <UploadCloud size={16} aria-hidden />
        {isPending ? "Uploading..." : "Upload"}
      </button>
      {state.error ? (
        <p className="md:col-span-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="md:col-span-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
