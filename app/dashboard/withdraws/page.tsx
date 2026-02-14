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

      {/* Security Notice */}
<div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
  <p className="font-medium text-blue-400 mb-1">
    Account Security Information
  </p>

  <p className="text-muted-foreground">
    Withdrawals are protected by a Key Password system.
    Without a valid Key Password, withdrawals cannot be processed.
    <br /><br />
    If access is lost, users may transfer funds internally to another
    platform account. Receiving accounts must have VIP Level 1 or higher.
    <br /><br />
    Please keep your Key Password safe at all times.
  </p>
</div>


      <WithdrawForm />
    </div>
  );
}
