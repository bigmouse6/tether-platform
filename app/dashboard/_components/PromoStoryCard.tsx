"use client";

import { useMemo, useState } from "react";

export default function PromoStoryCard() {
  const [open, setOpen] = useState(false);

  const content = useMemo(() => {
    return {
      eyebrow: "Announcement",
      titleA: "Trade smarter",
      titleB: "with real-time insights",
      subtitle:
        "New tools and market signals are rolling out gradually to all users.",
      badge: "New",
      ctaOpen: "Learn more",
      ctaClose: "Hide details",
      detailsTitle: "How it works",
      details: [
        "Signals track price momentum and volatility across major assets in real time.",
        "We highlight unusual movement and short-term trend shifts so you can spot changes earlier.",
        "Rollout is gradual to validate accuracy, reduce noise, and keep performance stable for everyone.",
      ],
      note:
        "Tip: These insights are informational only — always manage risk and confirm with your own analysis.",
    };
  }, []);

  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 relative overflow-hidden">
      {/* soft glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/40">
            {content.eyebrow}
          </div>

          <div className="mt-3 text-2xl font-semibold leading-snug">
            <span className="text-cyan-200">{content.titleA}</span>{" "}
            <span className="text-emerald-200">{content.titleB}</span>
          </div>

          <p className="mt-3 max-w-2xl text-sm text-white/50">
            {content.subtitle}
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/60">
          {content.badge}
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
        >
          {open ? content.ctaClose : content.ctaOpen}
        </button>

        <div className="text-xs text-white/35">
          Updates arrive gradually • Stable rollout
        </div>
      </div>

      {/* expandable details */}
      <div
        className={[
          "transition-all duration-500 ease-out",
          open ? "mt-6 max-h-[420px] opacity-100" : "mt-0 max-h-0 opacity-0",
          "overflow-hidden",
        ].join(" ")}
      >
        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
          <div className="text-sm font-semibold text-white/80">
            {content.detailsTitle}
          </div>

          <ul className="mt-3 space-y-2 text-sm text-white/55">
            {content.details.map((t, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-xs text-white/35">{content.note}</div>
        </div>
      </div>
    </div>
  );
}
