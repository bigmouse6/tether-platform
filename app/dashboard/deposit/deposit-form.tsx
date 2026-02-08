"use client";

import { useMemo, useState } from "react";

type Props = {
  address: string;
};

type Exchange = {
  name: string;
  url: string;
};

export default function DepositForm({ address }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const exchanges: Exchange[] = useMemo(
    () => [
      { name: "OKX", url: "https://www.okx.com/" },
      { name: "Bybit", url: "https://www.bybit.com/" },
      { name: "KuCoin", url: "https://www.kucoin.com/" },
      { name: "Gate.io", url: "https://www.gate.io/" },
      { name: "Bitget", url: "https://www.bitget.com/" },
      { name: "MEXC", url: "https://www.mexc.com/" },
      { name: "Crypto.com", url: "https://crypto.com/" },
      { name: "Kraken", url: "https://www.kraken.com/" },
    ],
    []
  );

  const amountNumber = Number(amount);
  const amountValid = Number.isFinite(amountNumber) && amountNumber > 0;

  async function onCopy() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  function onContinue() {
    if (!amountValid || !address) return;
    setOpen(true);
  }

  return (
    <>
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
        <div className="space-y-5">
          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm text-white/70">Amount (USDT)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="e.g. 100"
              className="w-full rounded-xl bg-black/20 px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
            />
          </div>

          {/* Address (read-only) + copy */}
          <div>
            <label className="mb-2 block text-sm text-white/70">USDT TRC20 Address</label>

            <div className="flex items-stretch gap-2">
              <input
                value={address || "Deposit address is not set"}
                readOnly
                aria-readonly="true"
                className="w-full rounded-xl bg-black/20 px-4 py-3 text-white/90 outline-none ring-1 ring-white/10"
              />

              <button
                type="button"
                onClick={onCopy}
                disabled={!address}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white ring-1 ring-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                title="Copy address"
              >
                <CopyIcon />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <p className="mt-2 text-xs text-white/50">
              Address is locked to prevent accidental edits.
            </p>
          </div>

          {/* Continue */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onContinue}
              disabled={!amountValid || !address}
              className="rounded-xl bg-cyan-500/10 px-5 py-3 text-sm font-medium text-white ring-1 ring-cyan-400/20 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-lg rounded-2xl bg-[#0b1220] p-6 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Choose an exchange</h2>
                <p className="mt-1 text-sm text-white/60">
                  Amount: <span className="text-white">{amountNumber.toLocaleString()} USDT</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/10 hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="mt-5">
              <p className="text-sm text-white/70">
                Click a platform to open it (new tab):
              </p>

              <div className="mt-4 space-y-2">
                {exchanges.map((ex) => (
                  <a
                    key={ex.name}
                    href={ex.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-white ring-1 ring-white/10 hover:bg-white/10"
                  >
                    <span className="font-medium">{ex.name}</span>
                    <span className="text-xs text-white/60">Open →</span>
                  </a>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs text-white/70">
                  Send USDT (TRC20) to the copied address. Then contact support for manual confirmation if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-90"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3V7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 17v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3h1"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
