import {
  BarChart3,
  BookOpenText,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  FolderPlus,
  KeyRound,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";

const knowledgeBases = [
  {
    name: "Product Docs",
    description: "Roadmaps, specs, release notes",
    documents: 18,
    status: "Ready",
  },
  {
    name: "Learning Notes",
    description: "AI, database, backend notes",
    documents: 42,
    status: "Ready",
  },
  {
    name: "Client Research",
    description: "PDF briefs and meeting notes",
    documents: 7,
    status: "Indexing",
  },
];

const documents = [
  {
    name: "rag-system-design.pdf",
    type: "PDF",
    chunks: 128,
    status: "Ready",
    updatedAt: "2 min ago",
  },
  {
    name: "deployment-checklist.md",
    type: "Markdown",
    chunks: 36,
    status: "Ready",
    updatedAt: "18 min ago",
  },
  {
    name: "meeting-notes.txt",
    type: "Text",
    chunks: 14,
    status: "Indexing",
    updatedAt: "Now",
  },
];

const citations = [
  {
    title: "rag-system-design.pdf",
    location: "Page 6",
    excerpt:
      "The retrieval step should filter chunks by workspace and knowledge base before ranking semantic matches.",
  },
  {
    title: "deployment-checklist.md",
    location: "Heading: Vector Search",
    excerpt:
      "Use pgvector for the first release to keep the storage layer simple and reduce operational complexity.",
  },
];

const roadmap = [
  "Project foundation",
  "Authentication",
  "Knowledge base CRUD",
  "Document upload",
  "Embeddings and retrieval",
  "Cited chat answers",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <BookOpenText size={21} aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">KnowFlow</p>
              <p className="text-xs text-slate-500">AI knowledge base</p>
            </div>
          </div>

          <button className="mt-7 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800">
            <FolderPlus size={16} aria-hidden />
            New knowledge base
          </button>

          <nav className="mt-7 space-y-1">
            {[
              ["Dashboard", BarChart3],
              ["Knowledge bases", Database],
              ["Chat history", MessageSquareText],
              ["API keys", KeyRound],
              ["Security", ShieldCheck],
            ].map(([label, Icon]) => (
              <a
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 first:bg-emerald-50 first:text-emerald-700"
                href="#"
                key={label as string}
              >
                <Icon size={16} aria-hidden />
                {label as string}
              </a>
            ))}
          </nav>

          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              MVP progress
            </p>
            <div className="mt-4 space-y-3">
              {roadmap.map((item, index) => (
                <div className="flex items-center gap-3" key={item}>
                  <div
                    className={`flex size-5 items-center justify-center rounded-full ${
                      index === 0
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-400 ring-1 ring-slate-200"
                    }`}
                  >
                    {index === 0 ? (
                      <CheckCircle2 size={13} aria-hidden />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                  </div>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Developer knowledge workspace
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 md:text-3xl">
                  AI Knowledge Base Q&A System
                </h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                    aria-hidden
                  />
                  <input
                    className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-72"
                    placeholder="Search documents or chats"
                  />
                </label>
                <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <UploadCloud size={16} aria-hidden />
                  Upload
                </button>
                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="grid flex-1 gap-6 px-4 py-6 md:px-8 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-6">
              <section className="grid gap-4 md:grid-cols-3">
                {[
                  ["Knowledge bases", "3", "2 ready, 1 indexing", Database],
                  ["Indexed documents", "67", "178 chunks generated", FileText],
                  ["Saved chats", "24", "12 with citations", MessageSquareText],
                ].map(([label, value, detail, Icon]) => (
                  <div
                    className="rounded-lg border border-slate-200 bg-white p-5"
                    key={label as string}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">
                        {label as string}
                      </span>
                      <Icon className="text-emerald-600" size={18} aria-hidden />
                    </div>
                    <p className="mt-5 text-3xl font-semibold text-slate-950">
                      {value as string}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {detail as string}
                    </p>
                  </div>
                ))}
              </section>

              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">
                      Knowledge bases
                    </h2>
                    <p className="text-sm text-slate-500">
                      Separate document collections keep retrieval scoped.
                    </p>
                  </div>
                  <button
                    className="flex size-9 items-center justify-center rounded-md bg-emerald-600 text-white transition hover:bg-emerald-700"
                    aria-label="Create knowledge base"
                  >
                    <Plus size={18} aria-hidden />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {knowledgeBases.map((base) => (
                    <button
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                      key={base.name}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-950">
                            {base.name}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              base.status === "Ready"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {base.status}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-500">
                          {base.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="text-sm text-slate-500">
                          {base.documents} docs
                        </span>
                        <ChevronRight size={17} aria-hidden />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-base font-semibold text-slate-950">
                    Document pipeline
                  </h2>
                  <p className="text-sm text-slate-500">
                    Upload, parse, chunk, embed, then search.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Document</th>
                        <th className="px-5 py-3 font-semibold">Type</th>
                        <th className="px-5 py-3 font-semibold">Chunks</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents.map((document) => (
                        <tr key={document.name}>
                          <td className="px-5 py-4 font-medium text-slate-950">
                            {document.name}
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {document.type}
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {document.chunks}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                                document.status === "Ready"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {document.status === "Ready" ? (
                                <CheckCircle2 size={13} aria-hidden />
                              ) : (
                                <Clock3 size={13} aria-hidden />
                              )}
                              {document.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {document.updatedAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Bot className="text-emerald-600" size={19} aria-hidden />
                    <h2 className="text-base font-semibold text-slate-950">
                      Ask your documents
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Responses are grounded in retrieved source chunks.
                  </p>
                </div>

                <div className="space-y-4 px-5 py-5">
                  <div className="rounded-lg bg-slate-100 p-4">
                    <p className="text-sm font-medium text-slate-950">
                      How should we scope retrieval for multi-user data?
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-sm leading-6 text-slate-800">
                      Scope retrieval by both user and knowledge base before
                      semantic ranking. This prevents cross-user leakage and
                      keeps answers tied to the selected document collection.
                    </p>
                  </div>
                  <label className="block">
                    <span className="sr-only">Ask a question</span>
                    <textarea
                      className="h-28 w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Ask a question about the selected knowledge base"
                    />
                  </label>
                  <button className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800">
                    <MessageSquareText size={16} aria-hidden />
                    Ask with citations
                  </button>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-base font-semibold text-slate-950">
                    Source citations
                  </h2>
                  <p className="text-sm text-slate-500">
                    Every useful answer should expose its evidence.
                  </p>
                </div>
                <div className="space-y-3 p-5">
                  {citations.map((citation) => (
                    <article
                      className="rounded-lg border border-slate-200 p-4"
                      key={`${citation.title}-${citation.location}`}
                    >
                      <div className="flex items-start gap-3">
                        <FileText
                          className="mt-0.5 shrink-0 text-emerald-600"
                          size={17}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-950">
                            {citation.title}
                          </h3>
                          <p className="mt-0.5 text-xs font-medium text-slate-500">
                            {citation.location}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {citation.excerpt}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
