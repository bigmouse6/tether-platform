"use client";

import { useState, useTransition } from "react";
import { submitWithdraw } from "./actions";
import { useRouter } from "next/navigation";


export default function WithdrawForm() {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [keyPassword, setKeyPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    startTransition(async () => {
      const res = await submitWithdraw({
        amount: Number(amount),        
        address,
        keyPassword,
      });

      setMsg(res.message);

       if (res.ok) {
        setAmount("");
        setAddress("");
        setKeyPassword("");
        router.refresh(); 
 }

    });
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs text-white/60">Amount (USDT)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="e.g. 50"
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/60">Crypto Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="TRC20 / ERC20 address..."
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/60">Key Password</label>
          <input
            type="password"
            value={keyPassword}
            onChange={(e) => setKeyPassword(e.target.value)}
            placeholder="Withdrawal security password"
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none"
            required
          />
          <div className="mt-2 text-xs text-white/40">
            This password is only required for withdrawal operations.
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-cyan-500/20 px-4 py-3 text-sm text-white hover:bg-cyan-500/30 disabled:opacity-60"
        >
          {pending ? "Processing..." : "Withdraw"}
        </button>

        {msg && <div className="text-sm text-white/70">{msg}</div>}
      </form>
    </div>
  );
}
