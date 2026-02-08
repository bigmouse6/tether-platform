export default function CookiesPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold tracking-tight">Cookie Preferences</h1>
        <p className="mt-2 text-white/60">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/70">
          <p>
            We use essential cookies to keep you signed in and protect sessions. We do not use advertising cookies.
          </p>

          <h2 className="text-lg font-semibold text-white">Essential cookies</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Authentication/session cookies</li>
            <li>Security-related cookies</li>
          </ul>

          <h2 className="text-lg font-semibold text-white">Managing cookies</h2>
          <p>
            You can control cookies in your browser s. Disabling cookies may prevent login.
          </p>
        </div>
      </div>
    </main>
  );
}
