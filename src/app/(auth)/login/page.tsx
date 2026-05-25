import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm font-medium text-emerald-700">Welcome back</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
        Sign in to KnowFlow
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Continue managing your knowledge bases, documents, and cited chats.
      </p>

      {params.registered ? (
        <p className="mt-5 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Account created. Sign in with your new credentials.
        </p>
      ) : null}

      <LoginForm
        error={
          params.error
            ? "Invalid email or password."
            : undefined
        }
      />

      <p className="mt-6 text-center text-sm text-slate-500">
        No account yet?{" "}
        <Link className="font-medium text-emerald-700" href="/register">
          Create one
        </Link>
      </p>
    </div>
  );
}
