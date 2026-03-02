"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { getSessionId } from "@/utils/session";

export default function SupportForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState("");

  useEffect(() => {
    const sessionId = getSessionId();
    setCurrentSession(sessionId);
    document.cookie = `support_session_id=${sessionId}; path=/; max-age=86400`;
  }, []);

  const handleClearSession = () => {
    localStorage.removeItem("support_session_id");
    document.cookie = "support_session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setCurrentSession(getSessionId());
    window.location.reload();
  };

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const text = message.trim();
    if (!text) return;

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        setMsg("Not authenticated.");
        setLoading(false);
        return;
      }

      const sessionId = getSessionId();

      const { error } = await supabase.from("support_messages").insert({
        user_id: userId,
        user_email: userEmail,
        message: text,
        status: "open",
        session_id: sessionId,
      });

      if (error) {
        setMsg(error.message);
      } else {
        setMessage("");
        setMsg("Sent!");
        router.refresh();
      }
    } catch {
      setMsg("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Session göstəricisi tamamilə silindi - funksiya işləyir, amma görünmür */}
      
      <form onSubmit={onSend} className="space-y-3">
        <div className="text-sm text-white/70">Write your message</div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Type here..."
          disabled={loading}
        />
        
        {msg && (
          <div className={`text-xs ${msg === "Sent!" ? "text-green-400" : "text-white/70"}`}>
            {msg}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}