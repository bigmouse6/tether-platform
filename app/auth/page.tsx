"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type Tab = "login" | "signup";

function RightPromo() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
      
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/promo-trc20.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 [box-shadow:inset_0_0_140px_50px_rgba(0,0,0,0.55)]" />

      {/* Content */}
      <div className="relative">
        {/* Əgər istəsən burda 1–2 sətir text saxlaya bilərsən */}
        {/* İstəmirsənsə, tam boş qala bilər */}
      </div>

    </section>
  );
}





export default function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [tab, setTab] = useState<Tab>("login");

  // login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup states
  const [signEmail, setSignEmail] = useState("");
  const [signPassword, setSignPassword] = useState("");
  const [keyPassword, setKeyPassword] = useState("");


  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setLoading(false);
    if (error) return setMsg(error.message);

    router.push("/dashboard");
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

     const { error } = await supabase.auth.signUp({
       email: signEmail,
       password: signPassword,
       options: {
       data: {
       key_password: keyPassword, // DB trigger bunu götürüb hash edəcək
    },
  },
});



    setLoading(false);
    if (error) return setMsg(error.message);

    router.push("/dashboard");
  }

  function TopLeftLogo() {
  return (
    <div className="absolute top-6 left-6 flex items-center gap-2 z-50 select-none">
      <div className="h-9 w-9 rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-400/25 grid place-items-center shadow-[0_0_25px_rgba(34,211,238,0.25)]">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 7h12v2h-5v10h-2V9H6V7Z"
            fill="rgb(103 232 249)"
          />
        </svg>
      </div>
      <div className="text-white/90 font-semibold tracking-tight">Tronix</div>
    </div>
  );
}


  return (
    <main className="min-h-screen w-full px-4 py-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* LEFT: Auth card */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          {/* Brand */}
          {/* Brand */}
<div className="mb-6">
  <div className="flex items-center">
    <div>
      <div className="text-lg font-semibold leading-5 text-white">
        Tronix
      </div>
      <div className="text-sm text-white/60">
        TRC20 payments platform
      </div>
    </div>
  </div>
</div>


          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={[
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                tab === "login"
                  ? "bg-cyan-500/20 text-cyan-100 ring-1 ring-cyan-400/20"
                  : "text-white/70 hover:text-white",
              ].join(" ")}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              className={[
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                tab === "signup"
                  ? "bg-cyan-500/20 text-cyan-100 ring-1 ring-cyan-400/20"
                  : "text-white/70 hover:text-white",
              ].join(" ")}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {tab === "login" ? (
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Email
                </label>
                <input
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/40"
                />
              </div>

              {msg && <div className="text-sm text-red-300">{msg}</div>}

              <button
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={onSignup} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Email
                </label>
                <input
                  value={signEmail}
                  onChange={(e) => setSignEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Password
                </label>
                <input
                  type="password"
                  value={signPassword}
                  onChange={(e) => setSignPassword(e.target.value)}
                  placeholder="min 6 characters"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/40"
                />
              </div>
                 <div className="mt-4">
                   <label className="mb-2 block text-sm text-white/70">Key Password</label>
                   <input
                      type="password"
                      value={keyPassword}
                      onChange={(e) => setKeyPassword(e.target.value)}
                      placeholder="Withdrawal Security Password"
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                />
                <p className="mt-2 text-xs text-white/45">
                  This password is only required for withdrawal operations, not for login.
                </p>
              </div>


              {msg && <div className="text-sm text-red-300">{msg}</div>}

              <button
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Loading..." : "Create account"}
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-between text-sm text-white/60">
            <span className="text-white/40">
              By continuing you agree to platform rules.
            </span>
          </div>
        </section>

        {/* RIGHT: Promo */}
        <RightPromo />
      </div>
      <AuthFooter />
    </main>
  );
}

function AuthFooter() {
  return (
    <footer className="mx-auto mt-8 w-full max-w-7xl px-2 pb-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/50">
            © 2019 Tronix. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/cookies" className="hover:text-white">Cookie Preferences</a>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-white/40">
          This platform is for authentication and account access only. Always keep your credentials safe and do not share your Key Password.
        </p>
      </div>
    </footer>
  );
}
