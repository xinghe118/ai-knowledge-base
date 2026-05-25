"use client";

import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";

type LoginFormProps = {
  error?: string;
};

export function LoginForm({ error }: LoginFormProps) {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCsrfToken() {
      const response = await fetch("/api/auth/csrf");
      const data = (await response.json()) as { csrfToken?: string };

      if (isMounted) {
        setCsrfToken(data.csrfToken ?? "");
      }
    }

    void loadCsrfToken();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <form
      action="/api/auth/callback/credentials"
      className="mt-8 space-y-5"
      method="post"
    >
      <input name="csrfToken" type="hidden" value={csrfToken} />
      <input name="callbackUrl" type="hidden" value="/dashboard" />
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <div>
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          id="password"
          name="password"
          placeholder="At least 8 characters"
          required
          type="password"
        />
      </div>
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={!csrfToken}
        type="submit"
      >
        <LogIn size={16} aria-hidden />
        Sign in
      </button>
    </form>
  );
}
