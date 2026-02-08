"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function TransferForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [toEmail, setToEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setMsg(null);

    const a = Number(amount);
    if (!toEmail.includes("@")) return setMsg("Enter a valid receiver email.");
    if (!Number.isFinite(a) || a <= 0) return setMsg("Amount must be > 0.");

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("internal_transfer", {
        to_email: toEmail.trim(),
        amount: a,
      });

      if (error) throw error;

      const sb = Number(data?.[0]?.sender_balance ?? 0);
      setMsg(`✅ Transfer success. New balance: ${sb.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`);
      setAmount("");
      setToEmail("");
      router.refresh();
    } catch (e: any) {
      setMsg("❌ Transfer failed. Receiver must be VIP-1 or higher.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm text-white/70">Receiver email</div>
        <input
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white outline-none focus:border-cyan-400/40"
        />
      </div>

      <div>
        <div className="text-sm text-white/70">Amount (USDT)</div>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white outline-none focus:border-cyan-400/40"
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="rounded-xl bg-cyan-500/20 border border-cyan-400/30 px-4 py-2 text-sm text-white hover:bg-cyan-500/30 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send USDT"}
      </button>

      {msg ? <div className="text-sm text-white/80">{msg}</div> : null}

      <div className="text-xs text-white/50">
        Rule: Receiver must be VIP-1 or higher.
      </div>
    </div>
  );
}

