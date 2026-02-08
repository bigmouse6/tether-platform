"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Download,
  Upload,
  ArrowLeftRight,
  Crown,
  LifeBuoy,
  ShieldCheck,
  LogOut,
  Inbox,
  History,
} from "lucide-react";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Sidebar({
  isAdmin,
  userEmail,
  vipLevel,
}: {
  isAdmin: boolean;
  userEmail: string;
  vipLevel: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);

  const emailShort =
    userEmail && userEmail.includes("@")
      ? `${userEmail.split("@")[0].slice(0, 6)}…@${userEmail.split("@")[1]}`
      : userEmail || "user";

  const vipText = vipLevel && vipLevel > 0 ? `VIP-${vipLevel}` : "None";

  const wallet: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: <LayoutGrid size={18} /> },
    { label: "Deposit", href: "/dashboard/deposit", icon: <Download size={18} /> },
    { label: "Withdraws", href: "/dashboard/withdraws", icon: <Upload size={18} /> },
    { label: "Internal Transfer", href: "/dashboard/transfer", icon: <ArrowLeftRight size={18} /> },
  ];

  const account: NavItem[] = [
  { label: "VIP", href: "/dashboard/vip", icon: <Crown size={18} /> },
  { label: "Support", href: "/dashboard/support", icon: <LifeBuoy size={18} /> },
  { label: "History", href: "/dashboard/history", icon: <History size={18} /> },
];


  const admin: NavItem[] = [
    { label: "Admin Overview", href: "/dashboard/admin", icon: <ShieldCheck size={18} /> },
    { label: "Manual Deposit", href: "/dashboard/admin/manual-deposit", icon: <Download size={18} /> },
    { label: "Manual Withdraw", href: "/dashboard/admin/manual-withdraw", icon: <Upload size={18} /> },
    { label: "Support Inbox", href: "/dashboard/admin/support", icon: <Inbox size={18} /> },
  ];

  function Section({ title, items }: { title: string; items: NavItem[] }) {
    return (
      <div className="space-y-2">
        <div className="px-3 text-[11px] tracking-wider text-white/40">
          {title}
        </div>
        <div className="space-y-1">
          {items.map((i) => {
            const active =
              pathname === i.href || (i.href !== "/dashboard" && pathname.startsWith(i.href));
            return (
              <Link
                key={i.href}
                href={i.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-cyan-500/10 border border-cyan-400/20"
                    : "hover:bg-white/5 border border-transparent",
                ].join(" ")}
              >
                <span className={active ? "text-cyan-200" : "text-white/80"}>
                  {i.icon}
                </span>
                <span className={active ? "text-white" : "text-white/80"}>
                  {i.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  async function logout() {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="w-72 p-5 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col">
      <div className="mb-6">
        <div className="text-lg font-semibold">Tronix</div>
        

        <div className="mt-2 text-xs text-white/60">
          VIP: <span className="text-white">{vipText}</span>
        </div>
      </div>

      <div className="flex-1 space-y-5">
        <Section title="WALLET" items={wallet} />
        <Section title="ACCOUNT" items={account} />
        {isAdmin && <Section title="ADMIN" items={admin} />}
      </div>

       <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
  <div className="flex items-center gap-3">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full bg-emerald-400/15 blur-lg" />
      <div className="absolute inset-0 rounded-full border border-emerald-300/25" />

      {/* orbit */}
      <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
        <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
      </div>

      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-200">
        $
      </span>
    </div>

    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white/90">USDT Live</div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-200">
          stable
        </span>
      </div>
    </div>
  </div>
</div>



      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/60">{emailShort}</div>

          <button
            onClick={logout}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 disabled:opacity-50"
          >
            <LogOut size={16} />
            {loading ? "..." : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}

     