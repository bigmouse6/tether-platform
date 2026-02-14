"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Msg = {
  id: number;
  created_at: string;
  user_email: string | null;
  message: string;
  status: string | null;
  admin_reply?: string | null;
  admin_replied_at?: string | null;
};

export default function AdminSupportInboxClient({ initialMessages }: { initialMessages: Msg[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [replyById, setReplyById] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return messages;
    return messages.filter((m) => (m.user_email ?? "").toLowerCase().includes(s));
  }, [q, messages]);

  async function refresh() {
    const { data, error } = await supabase
      .from("support_messages")
      .select("id, created_at, user_email, message, status, admin_reply, admin_replied_at")
      .order("id", { ascending: false })
      .limit(200);

    if (!error) setMessages((data as Msg[]) ?? []);
  }

  async function sendReply(id: number) {
    const text = (replyById[id] ?? "").trim();
    if (!text) return;

    setSavingId(id);
    try {
      const { error } = await supabase
        .from("support_messages")
        .update({
          admin_reply: text,
          admin_replied_at: new Date().toISOString(),
          status: "answered",
        })
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      setReplyById((p) => ({ ...p, [id]: "" }));
      await refresh();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Support Inbox</h1>
          <p className="text-white/60 mt-2">Messages sent by users.</p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by email…"
          className="w-full sm:w-80 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/50">
              {new Date(m.created_at).toLocaleString()} · {m.status ?? "open"}
            </div>

            <div className="mt-2 text-sm text-white/70">{m.user_email ?? "unknown"}</div>
            <div className="mt-3 text-sm text-white">{m.message}</div>

            {m.admin_reply ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/50">
                  Admin reply {m.admin_replied_at ? `· ${new Date(m.admin_replied_at).toLocaleString()}` : ""}
                </div>
                <div className="mt-2 text-sm text-white">{m.admin_reply}</div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <textarea
                  value={replyById[m.id] ?? ""}
                  onChange={(e) => setReplyById((p) => ({ ...p, [m.id]: e.target.value }))}
                  rows={3}
                  placeholder="Write a reply…"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40"
                />
                <button
                  onClick={() => sendReply(m.id)}
                  disabled={savingId === m.id}
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {savingId === m.id ? "Sending…" : "Send reply"}
                </button>
              </div>
            )}
          </div>
        ))}

        {!filtered.length && <div className="text-sm text-white/50">No messages found.</div>}
      </div>
    </div>
  );
}
