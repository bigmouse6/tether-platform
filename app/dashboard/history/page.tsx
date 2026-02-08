import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("transactions")
    .select("id, created_at, type, direction, amount, asset, note, performed_by_email")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">History</h1>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error.message}</p>
      )}

      <div className="mt-4 space-y-2">
        
        {(data ?? []).map((tx) => {
  const isManual = !!tx.performed_by_email;

  const actionLabel =
    tx.type === "deposit"
      ? isManual
        ? "USDT Deposit"
        : "Deposit"
      : tx.type === "withdraw"
        ? isManual
          ? "USDT Withdraw"
          : "Withdraw"
        : tx.type;

  return (
    <div
      key={tx.id}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
    >
      <div>
        <div className="text-sm font-semibold">
          {actionLabel}
        </div>

        <div className="text-xs opacity-60">
          {new Date(tx.created_at).toLocaleString()}
          {tx.note ? ` • ${tx.note}` : ""}
        </div>
      </div>

      <div
        className={[
          "text-sm font-semibold",
          tx.type === "deposit" ? "text-emerald-300" : "",
          tx.type === "withdraw" ? "text-cyan-300" : "",
       ].join(" ")}
>
  {tx.direction === "in" ? "+" : "-"}
  {Number(tx.amount).toLocaleString()} {tx.asset}
</div>


    </div>
  );
})}


          
        {!error && (data?.length ?? 0) === 0 && (
          <p className="text-sm opacity-70">No history yet.</p>
        )}
      </div>
    </div>
  );
}
