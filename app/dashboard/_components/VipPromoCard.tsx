"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type Props = {
  vipLevel?: string | null;
};

function normalizeVip(vipLevel?: string | null) {
  const v = String(vipLevel ?? "").trim().toUpperCase();
  if (!v) return { tier: 0, label: "Standard" };

  
  const m = v.match(/VIP[\s-]?(\d+)/);
  if (m?.[1]) return { tier: Number(m[1]), label: `VIP ${m[1]}` };

  
  return { tier: 0, label: "Standard" };
}

export default function VipPromoCard({ vipLevel }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
  
    const dismissed = sessionStorage.getItem("vip_promo_dismissed");
    if (!dismissed) setOpen(true);
  }, []);

  const vip = useMemo(() => normalizeVip(vipLevel), [vipLevel]);

  const title = "VIP Upgrade";
  const headline = "Unlock higher limits, priority support and exclusive rewards";

  const current = vip.label;
  const next = vip.tier >= 1 ? `VIP ${vip.tier + 1}` : "VIP 1";

  const cta =
    vip.tier >= 1 ? "Upgrade your access" : "Unlock VIP benefits";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* very soft backdrop (not aggressive) */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-[520px] pointer-events-auto rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-2 text-white/60 hover:text-white hover:bg-white/10"
          onClick={() => {
            sessionStorage.setItem("vip_promo_dismissed", "1");
            setOpen(false);
          }}
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <div className="text-sm text-white/60">{title}</div>

          {/* Gradient headline (premium, not overdone) */}
          <div className="mt-2 text-lg font-semibold leading-snug">
            <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">
              {headline}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-white/50">Current level</div>
              <div className="mt-1 text-sm font-semibold">{current}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs text-white/50">Next level</div>
              <div className="mt-1 text-sm font-semibold">{next}</div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="text-xs text-white/40">
              VIP levels update automatically.
            </div>

            <Link
              href="/dashboard/vip"
              className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
