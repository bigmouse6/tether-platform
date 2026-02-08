import { createClient } from "@/lib/supabase/server";

export default async function AdminSupportInbox() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("support_messages")
    .select("id, created_at, user_email, message, status")
    .order("id", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">Support Inbox</h1>
      <p className="text-white/60 mt-2">Messages sent by users.</p>

      <div className="mt-6 space-y-3">
        {(messages ?? []).map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/50">
              {new Date(m.created_at).toLocaleString()} · {m.status}
            </div>
            <div className="mt-1 text-sm text-white/70">{m.user_email ?? "unknown"}</div>
            <div className="mt-3 text-sm text-white">{m.message}</div>
          </div>
        ))}
        {!messages?.length && (
          <div className="text-sm text-white/50">No messages.</div>
        )}
      </div>
    </div>
  );
}
