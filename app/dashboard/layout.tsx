import Sidebar from "./_components/Sidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  const userEmail = user?.email ?? "";
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();

  let vipLevel = 0;
  let isAdmin = false;

  if (user?.id) {
    // vip_level DB-dən qalsın (VIP üçün lazımdır)
    const { data: profile } = await supabase
      .from("profiles")
      .select("vip_level")
      .eq("user_id", user.id)
      .single();

    vipLevel = Number(profile?.vip_level ?? 0);

    // ✅ Admin yoxlaması EMAIL ilə
    isAdmin = !!userEmail && userEmail.toLowerCase() === adminEmail;
  }

  return (
    <div className="flex">
      <Sidebar isAdmin={isAdmin} userEmail={userEmail} vipLevel={vipLevel} />
      <main className="flex-1">{children}</main>
    </div>
  );
}


