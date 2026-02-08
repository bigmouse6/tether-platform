import { createClient } from "@/lib/supabase/server";

export default async function AdminTransactionsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("transactions")
    .select("id, created_at, user_id, type, amount, asset, performed_by_email, direction, note")
    .order("id", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <p className="text-white/60 mt-2">Latest activity (admin view).</p>

      <div className="mt-6 space-y-3">
        {(data ?? []).map((t) => (
          <div key={t.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/50">
              {new Date(t.created_at).toLocaleString()} · {t.type} · {t.direction}
            </div>
            <div className="mt-2 text-sm text-white">
              {t.amount} {t.asset}
            </div>
            <div className="text-xs text-white/50 mt-1">
              user_id: {t.user_id}
              {t.performed_by_email ? ` · by ${t.performed_by_email}` : ""}
            </div>
            {t.note ? <div className="text-sm text-white/70 mt-2">{t.note}</div> : null}
          </div>
        ))}
        {!data?.length && <div className="text-sm text-white/50">No transactions.</div>}
      </div>
    </div>
  );
}
