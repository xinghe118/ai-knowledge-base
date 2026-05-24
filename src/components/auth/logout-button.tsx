"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      onClick={() => signOut({ callbackUrl: "/login" })}
      type="button"
    >
      <LogOut size={16} aria-hidden />
      Sign out
    </button>
  );
}
