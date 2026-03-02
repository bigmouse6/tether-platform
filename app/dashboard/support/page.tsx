import { createClient } from "@/lib/supabase/server";
import SupportForm from "./support-form";

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id;
  const userEmail = user?.email ?? "";

  
  await supabase.rpc('set_session_id', { session_id: 'temp' }); 

  
  const { data: messages } = await supabase
    .from("support_messages")
    .select("id, created_at, message, status, admin_reply, admin_replied_at, session_id")
    .order("id", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Support</h1>
      <p className="text-white/60 mt-2">Send a message to support. Admin will see it.</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <SupportForm userEmail={userEmail} />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/70 mb-3">Your messages</div>

        <div className="space-y-3">
          {(messages ?? []).map((m) => (
            <div key={m.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/50">
                {new Date(m.created_at).toLocaleString()} · {m.status ?? "open"}
                {/* Test üçün session ID göstər */}
                <span className="ml-2 text-cyan-400">
                  [Session: {m.session_id?.substring(0,8)}...]
                </span>
              </div>

              <div className="mt-2 text-sm text-white">{m.message}</div>

              {m.admin_reply && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/50">
                    Admin reply {m.admin_replied_at ? `· ${new Date(m.admin_replied_at).toLocaleString()}` : ""}
                  </div>
                  <div className="mt-2 text-sm text-white">{m.admin_reply}</div>
                </div>
              )}
            </div>
          ))}

          {!messages?.length && (
            <div className="text-sm text-white/50">No messages yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}