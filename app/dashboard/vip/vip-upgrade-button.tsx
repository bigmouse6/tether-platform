"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type Props = {
  targetLevel: number;        // məsələn 1,2,3...
  currentVipLevel: number;    // səhifədən gələcək vipLevel
  disabled?: boolean;         // sənin page.tsx hesablayır
};

export default function VipUpgradeButton({
  targetLevel,
  currentVipLevel,
  disabled = false,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const isDisabled = disabled || loading;

  const onUpgrade = async () => {
    setMsg(null);

    // Step-by-step qaydası (VIP-1 -> VIP-2 -> VIP-3...)
    if (targetLevel !== currentVipLevel + 1) {
      setMsg("You must upgrade step-by-step.");
      return;
    }

    setLoading(true);
    try {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const user = userRes.user;
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("vip_upgrade", { target_level: targetLevel });

      if (error) throw error;

      setMsg(`Success! VIP-${data?.[0]?.new_vip_level} activated ✅`);
      router.refresh();


      // ✅ Sidebar + page yenilənsin
      router.refresh();
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onUpgrade}
        disabled={isDisabled}
        className="rounded-xl bg-cyan-500/90 hover:bg-cyan-500 px-6 py-3 text-sm font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Upgrading..." : `Upgrade to VIP-${targetLevel}`}
      </button>

      {msg && <div className="text-xs text-white/60">{msg}</div>}
    </div>
  );
}
