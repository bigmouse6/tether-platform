import { createClient } from "@/lib/supabase/server";
import VipPromoCard from "./_components/VipPromoCard";
import PromoStoryCard from "./_components/PromoStoryCard";


export const dynamic = "force-dynamic";

type CGItem = { usd?: number; usd_24h_change?: number };
type Prices = Record<string, CGItem>;

const popular = [
  { id: "bitcoin", label: "BTC" },
  { id: "ethereum", label: "ETH" },
  { id: "solana", label: "SOL" },
  { id: "ripple", label: "XRP" },
  { id: "dogecoin", label: "DOGE" },
  { id: "usd-coin", label: "USDC" },
  { id: "tron", label: "TRX" },
] as const;

async function fetchPrices(): Promise<Prices | null> {
  try {
    const ids = [
      "tether",
      "tron",
      ...popular.map((c) => c.id),
    ].join(",");

    // CoinGecko simple price (server-side)
    const url =
      `https://api.coingecko.com/api/v3/simple/price` +
      `?ids=${encodeURIComponent(ids)}` +
      `&vs_currencies=usd&include_24hr_change=true`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    return (await res.json()) as Prices;
  } catch {
    return null;
  }
}



export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-white/70">Not authenticated.</div>;
  }

  // Wallet balance
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  // VIP level (profiles.vip_level is integer in sənin DB-də)
  const { data: profile } = await supabase
    .from("profiles")
    .select("vip_level")
    .eq("user_id", user.id)
    .single();

  const vipLevel =
    typeof profile?.vip_level === "number" && profile.vip_level > 0
      ? `VIP-${profile.vip_level}`
      : null;

  // This month deposit/withdraw totals
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthTx } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  const deposits =
    (monthTx ?? [])
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + Number(t.amount ?? 0), 0) || 0;

  const withdraws =
    (monthTx ?? [])
      .filter((t) => t.type === "withdraw")
      .reduce((sum, t) => sum + Number(t.amount ?? 0), 0) || 0;

  const prices = await fetchPrices();
  const usdt = prices?.tether;
  const trx = prices?.tron;

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtMoney = (n?: number) => {
    if (typeof n !== "number") return "";
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };

  const fmtPct = (n?: number) => {
    if (typeof n !== "number") return "";
    const sign = n >= 0 ? "+" : "";
    return `${sign}${n.toFixed(2)}%`;
  };

  return (
    <div className="pl-3">
      <h1 className="text-3xl font-semibold">Overview</h1>
      <p className="text-white/60 mt-2">Welcome to Tronix platform.</p>

      {/* VIP promo modal/card */}
      <VipPromoCard vipLevel={vipLevel} />

      {/* Top stats */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white/60 text-sm">Balance</div>
          <div className="mt-3 text-3xl font-semibold">
            {fmt(Number(wallet?.balance ?? 0))}{" "}
            <span className="text-white/60 text-lg">USDT</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white/60 text-sm">Deposits (this month)</div>
          <div className="mt-3 text-3xl font-semibold">
            {fmt(deposits)} <span className="text-white/60 text-lg">USDT</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-white/60 text-sm">Withdraws (this month)</div>
          <div className="mt-3 text-3xl font-semibold">
            {fmt(withdraws)} <span className="text-white/60 text-lg">USDT</span>
          </div>
        </div>
      </div>

      {/* Market snapshot */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: single panel */}
        <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Market</div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">USDT</div>
                <div className="text-xs text-white/40">live</div>
              </div>
            </div>

            <div className="mt-2 text-3xl font-semibold">
              ${fmtMoney(usdt?.usd)}
              <span className="ml-2 text-sm text-white/40">
                {fmtPct(usdt?.usd_24h_change)}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">TRX</div>
                <div className="text-xs text-white/40">tron</div>
              </div>
            </div>

            <div className="mt-2 text-2xl font-semibold">
              ${fmtMoney(trx?.usd)}
              <span
                className={[
                  "ml-2 text-sm",
                  (trx?.usd_24h_change ?? 0) >= 0 ? "text-emerald-300" : "text-cyan-300",
                ].join(" ")}
              >
                {fmtPct(trx?.usd_24h_change)}
              </span>
            </div>
          </div>

          {!prices && (
            <div className="mt-5 text-xs text-white/40">Price data unavailable.</div>
          )}
        </div>

        {/* Right column: Popular list */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">Popular</div>
            <div className="text-xs text-white/40">updates ~60s</div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popular.map((c) => {
              const p = prices?.[c.id];
              const pct = fmtPct(p?.usd_24h_change);

              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="text-sm font-semibold">{c.label}</div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">${fmtMoney(p?.usd)}</div>
                    {pct && (
                      <div
                        className={[
                          "text-xs",
                          (p?.usd_24h_change ?? 0) >= 0 ? "text-emerald-300" : "text-cyan-300",
                        ].join(" ")}
                      >
                        {pct}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!prices && (
            <div className="mt-4 text-sm text-white/60">Popular list unavailable right now.</div>
          )}
        </div>
      </div>

    <PromoStoryCard />
    </div>
  );
}
