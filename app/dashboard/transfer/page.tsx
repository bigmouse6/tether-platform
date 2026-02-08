import { createClient } from "@/lib/supabase/server";
import TransferForm from "./transfer-form";


function fmt(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function TransferPage() {
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  if (!user) return <div className="text-white/70">Not authenticated.</div>;

  const [{ data: wallet }, { data: profile }] = await Promise.all([
    supabase.from("wallets").select("balance").eq("user_id", user.id).single(),
    supabase.from("profiles").select("vip_level").eq("user_id", user.id).single(),
  ]);

  const balance = Number(wallet?.balance ?? 0);
  const vipLevel = Number(profile?.vip_level ?? 0);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Internal Transfer</h1>
      <p className="text-white/60 mt-2">
        Send USDT to another account. Receiver must be <span className="text-white">VIP-1+</span>.
      </p>

      <div className="mt-4 text-sm text-white/70">
        Your VIP: <span className="text-white">{vipLevel > 0 ? `VIP-${vipLevel}` : "None"}</span> · Balance:{" "}
        <span className="text-white">{fmt(balance)} USDT</span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <TransferForm />
      </div>
    </div>
  );
}
