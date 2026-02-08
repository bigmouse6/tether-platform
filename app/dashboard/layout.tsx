import DashboardShell from "./_components/DashboardShell";
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
    // Keep vip_level in the database (required for VIP logic)
    const { data: profile } = await supabase
      .from("profiles")
      .select("vip_level")
      .eq("user_id", user.id)
      .single();

    vipLevel = Number(profile?.vip_level ?? 0);

    // Admin check by email
    isAdmin = !!userEmail && userEmail.toLowerCase() === adminEmail;
  }

  return (
    <DashboardShell
      isAdmin={isAdmin}
      userEmail={userEmail}
      vipLevel={vipLevel}
    >
      {children}
    </DashboardShell>
  );
}
