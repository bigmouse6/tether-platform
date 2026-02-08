"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";


type Mode = "deposit" | "withdraw";

export default function ManualAdjustForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState("");

  // datetime-local üçün default: indi
  const [dt, setDt] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const title = mode === "deposit" ? "Deposit" : "Withdraw";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const targetEmail = email.trim();
    const amt = Number(amount);

    if (!targetEmail || !targetEmail.includes("@")) {
      setMsg("Please enter a valid user email.");
      return;
    }

    if (!Number.isFinite(amt) || amt <= 0) {
      setMsg("Amount must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      // datetime-local -> ISO
      const iso = dt ? new Date(dt).toISOString() : new Date().toISOString();

      const { error } = await supabase.rpc("admin_manual_adjust", {
       target_email: targetEmail,
       p_type: mode,
       p_amount: amt,
       p_datetime: iso,
       p_note: note.trim() ? note.trim() : null,
   });



      if (error) {
        setMsg(error.message);
        return;
      }

      setMsg(`${title} successful ✅`);
      setEmail("");
      setAmount("");
      setNote("");

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/70">User Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@gmail.com"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <div className="text-xs text-white/40 mt-1">
            Target user by email (admin-only).
          </div>
        </div>

        <div>
          <label className="text-sm text-white/70">Amount (USDT)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            inputMode="decimal"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Date & Time</label>
          <input
            type="datetime-local"
            value={dt}
            onChange={(e) => setDt(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:outline-none"
          />
          <div className="text-xs text-white/40 mt-1">
            Transaction time (optional).
          </div>
        </div>

        <div>
          <label className="text-sm text-white/70">Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason / comment"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
      </div>

      {msg && (
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80">
          {msg}
        </div>
      )}

      <button
        disabled={loading}
        className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {loading ? "Processing..." : `Manual ${title}`}
      </button>

      <div className="text-xs text-white/40">
        Updates <b>wallets.balance</b> and inserts into <b>transactions</b>.
      </div>
    </form>
  );
}
