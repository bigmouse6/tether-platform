import { createClient } from "@/lib/supabase/server";
import AdminSupportInboxClient from "./AdminSupportInboxClient";



export default async function AdminSupportInbox() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("support_messages")
    .select("id, created_at, user_email, message, status, admin_reply, admin_replied_at")
    .order("id", { ascending: false })
    .limit(200);

  return <AdminSupportInboxClient initialMessages={(messages ?? []) as any} />;
}
