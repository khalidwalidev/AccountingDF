"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@deshfiri.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  return (
    <div className="mx-auto mt-20 max-w-md card p-6">
      <h2 className="mb-5 text-xl font-bold text-brand-700">Admin Login</h2>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const response = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/dashboard" });
          if (response?.error) setError("Invalid credentials");
        }}
      >
        <input className="w-full rounded-lg border border-brand-200 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-lg border border-brand-200 px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">Sign in</button>
      </form>
    </div>
  );
}
