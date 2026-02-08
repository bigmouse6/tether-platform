"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
  isAdmin: boolean;
  userEmail: string;
  vipLevel: number;
};

export default function DashboardShell({
  children,
  isAdmin,
  userEmail,
  vipLevel,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="text-sm text-white/80">
          Tronix
          <div className="text-xs text-white/50">Dashboard</div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar isAdmin={isAdmin} userEmail={userEmail} vipLevel={vipLevel} />
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-[#0b0f14] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="text-sm text-white/80">
                  Menu
                  <div className="text-xs text-white/50">{userEmail || ""}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Sidebar inside drawer */}
              <div onClick={() => setOpen(false)}>
                <Sidebar
                  isAdmin={isAdmin}
                  userEmail={userEmail}
                  vipLevel={vipLevel}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
