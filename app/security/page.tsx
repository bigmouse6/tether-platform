"use client";

import { useState, useTransition } from "react";
import { setKeyPassword } from "./actions";

export default function SecurityPage() {
  const [keyPassword, setKeyPasswordValue] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    startTransition(async () => {
      const res = await setKeyPassword({ keyPassword });
      setMsg(res.message);
      if (res.ok) setKeyPasswordValue("");
    });
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">Security</h1>
        <p className="mt-2 text-white/60">
          Set a Key Password for withdrawals.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs text-white/60">Key Password</label>
            <input
              type="password"
              value={keyPassword}
              onChange={(e) => setKeyPasswordValue(e.target.value)}
              placeholder="Create / update key password"
              className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-cyan-500/20 px-4 py-3 text-sm text-white hover:bg-cyan-500/30 disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save Key Password"}
          </button>

          {msg && <div className="text-sm text-white/70">{msg}</div>}
        </form>
      </div>
    </main>
  );
}

