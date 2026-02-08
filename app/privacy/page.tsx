export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-white/60">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/70">
          <p>
            We respect your privacy. This platform collects only the data needed to provide authentication and account access.
          </p>

          <h2 className="text-lg font-semibold text-white">What we collect</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Account email</li>
            <li>Authentication metadata (e.g., sign-in timestamps)</li>
            <li>Optional profile or security fields you provide</li>
          </ul>

          <h2 className="text-lg font-semibold text-white">What we don’t do</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>We don’t sell your data</li>
            <li>We don’t share your data with third parties for advertising</li>
          </ul>

          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>If you have questions, contact the platform administrator.</p>
        </div>
      </div>
    </main>
  );
}

