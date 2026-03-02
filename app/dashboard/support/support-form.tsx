"use client";

import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { getSessionId, clearSession } from "@/utils/session"; 

export default function SupportForm({ userEmail }: { userEmail: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<string>("");
  const router = useRouter();

  
  useEffect(() => {
    setCurrentSession(getSessionId());
  }, []);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const text = message.trim();
    if (!text) return;

    try {
      setLoading(true);
      const supabase = createClient();

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        setMsg("Not authenticated.");
        return;
      }

      
      const sessionId = getSessionId();
      console.log('Göndərilən session ID:', sessionId); 
      const { error } = await supabase.from("support_messages").insert({
        user_id: userId,
        user_email: userEmail,
        message: text,
        status: "open",
        session_id: sessionId
      });

      if (error) {
        console.error('Xəta:', error); 
        setMsg(error.message);
        return;
      }

      setMessage("");
      setMsg("Sent!");
      router.refresh();
    } catch (error) {
      console.error('Kod xətası:', error); 
      setMsg("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  
  function handleClearSession() {
    clearSession();
    setCurrentSession(getSessionId());
    window.location.reload();
  }

  return (
    <div>
      {/* Test üçün session göstəricisi */}
      <div className="mb-2 text-xs text-cyan-400">
        Session: {currentSession?.substring(0, 8)}...
        <button 
          onClick={handleClearSession}
          className="ml-2 text-red-400 hover:text-red-300"
          type="button"
        >
          [clear]
        </button>
      </div>

      <form onSubmit={onSend} className="space-y-3">
        <div className="text-sm text-white/70">Write your message</div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Type here..."
        />
        {msg && <div className="text-xs text-white/70">{msg}</div>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}