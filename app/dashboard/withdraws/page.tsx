import { createClient } from "@/lib/supabase/server";
import WithdrawForm from "./withdraw-form";
export const dynamic = "force-dynamic";


function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function WithdrawsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div className="text-white/70">Not authenticated.</div>;

  const [{ data: wallet }, { data: profile }] = await Promise.all([
    supabase.from("wallets").select("balance").eq("user_id", user.id).single(),
    supabase.from("profiles").select("vip_level").eq("user_id", user.id).single(),
  ]);

  const balance = Number(wallet?.balance ?? 0);
  const vipLevel = Number(profile?.vip_level ?? 0);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Withdraws</h1>
      <p className="mt-2 text-white/60">
        Balance: <span className="text-white">{fmt(balance)} USDT</span> · VIP:{" "}
        <span className="text-white">{vipLevel > 0 ? `VIP-${vipLevel}` : "None"}</span>
      </p>

      <WithdrawForm />
    </div>
  );
}
