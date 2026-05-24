import { BookOpenText, Database, FileText, MessageSquareText } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-screen bg-[#f5f7fb] text-slate-950 lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="hidden border-r border-slate-200 bg-white px-10 py-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <BookOpenText size={21} aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">KnowFlow</p>
              <p className="text-xs text-slate-500">AI knowledge base</p>
            </div>
          </div>

          <div className="mt-20 max-w-xl">
            <p className="text-sm font-medium text-emerald-700">
              Document-grounded answers
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
              Build searchable knowledge bases with cited AI responses.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Upload technical documents, split them into searchable chunks, and
              keep every answer tied to the source material.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {[
            ["Knowledge bases", Database],
            ["Document pipeline", FileText],
            ["Cited chat history", MessageSquareText],
          ].map(([label, Icon]) => (
            <div
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              key={label as string}
            >
              <Icon className="text-emerald-600" size={18} aria-hidden />
              <span className="text-sm font-medium text-slate-700">
                {label as string}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        {children}
      </section>
    </main>
  );
}
