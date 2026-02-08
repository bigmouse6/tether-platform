import { createClient } from "@/lib/supabase/server";
import VipUpgradeButton from "./vip-upgrade-button";

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default async function VipPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div className="text-white/70">Not authenticated.</div>;

  const [{ data: profile }, { data: wallet }, { data: plans }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("vip_level")
        .eq("user_id", user.id)
        .single(),
      supabase.from("wallets").select("balance").eq("user_id", user.id).single(),
      supabase
        .from("vip_plans")
        .select("level, price, monthly_withdraw_limit")
        .order("level", { ascending: true }),
    ]);

  const vipLevel = Number(profile?.vip_level ?? 0);
  const balance = Number(wallet?.balance ?? 0);

  return (
    <div>
      <h1 className="text-3xl font-semibold">VIP</h1>
      <p className="text-white/60 mt-2">
        Current VIP:{" "}
        <span className="text-white">
          {vipLevel === 0 ? "None" : `VIP-${vipLevel}`}
        </span>{" "}
        · Balance: <span className="text-white">{fmt(balance)} USDT</span>
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(plans ?? []).map((p) => {
          const level = Number(p.level);
          const price = Number(p.price);
          const limit = Number(p.monthly_withdraw_limit);

          const isCurrent = level === vipLevel;
          const isUnlocked = level <= vipLevel;

          return (
            <div
              key={level}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">{`VIP-${level}`}</div>

                {isCurrent ? (
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                    Current
                  </span>
                ) : isUnlocked ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                    Unlocked
                  </span>
                ) : null}
              </div>

              <div className="mt-2 text-sm text-white/70">
                Monthly withdraw limit:{" "}
                <span className="text-white font-semibold">
                  {fmt(limit)} USDT
                </span>
              </div>

              <div className="mt-5 text-sm text-white/70">
                Upgrade price:{" "}
                <span className="text-white font-semibold">
                  {fmt(price)} USDT
                </span>
              </div>

              <div className="mt-5">
               <VipUpgradeButton
                 targetLevel={level}
                 currentVipLevel={vipLevel}
                 disabled={
                 level <= vipLevel ||             // eyni/aşağı level olmasın
                 level > vipLevel + 1 ||          // step-by-step qaydası
                (level === vipLevel + 1 && balance < price) // balans çatmır
              }
              />

              </div>

              {/* Məlumat mesajları */}
              {level > vipLevel + 1 ? (
                <div className="mt-3 text-xs text-white/50">
                  You must upgrade step-by-step.
                </div>
              ) : null}

              {level === vipLevel + 1 && balance < price ? (
                <div className="mt-3 text-xs text-red-300/80">
                  Not enough balance for this upgrade.
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}


