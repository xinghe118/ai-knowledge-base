import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm font-medium text-emerald-700">Start your workspace</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
        Create your KnowFlow account
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Register to create knowledge bases and keep document answers scoped to
        your own data.
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link className="font-medium text-emerald-700" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
