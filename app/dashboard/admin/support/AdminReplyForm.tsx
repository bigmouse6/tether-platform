"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function AdminReplyForm({ messageId }: { messageId: number }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onReply() {
    const reply = text.trim();
    if (!reply) return;

    setLoading(true);
    setMsg(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("support_messages")
      .update({
        admin_reply: reply,
        admin_replied_at: new Date().toISOString(),
        status: "answered",
      })
      .eq("id", messageId);

    if (error) setMsg(error.message);
    else {
      setText("");
      setMsg("Replied ✅");
    }

    setLoading(false);
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30"
        placeholder="Write an admin reply..."
      />
      {msg && <div className="text-xs text-white/70">{msg}</div>}
      <button
        disabled={loading}
        onClick={onReply}
        className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send reply"}
      </button>
    </div>
  );
}
