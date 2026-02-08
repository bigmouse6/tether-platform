export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-semibold tracking-tight">Terms & Conditions</h1>
        <p className="mt-2 text-white/60">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/70">
          <p>
            By using this platform, you agree to follow these terms. If you do not agree, do not use the service.
          </p>

          <h2 className="text-lg font-semibold text-white">Use of the platform</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Do not attempt to access accounts that are not yours</li>
            <li>Do not abuse, exploit, or disrupt the service</li>
            <li>You are responsible for keeping your credentials secure</li>
          </ul>

          <h2 className="text-lg font-semibold text-white">Disclaimer</h2>
          <p>
            The platform is provided “as is” without warranties. Availability and features may change at any time.
          </p>

          <h2 className="text-lg font-semibold text-white">Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, we are not liable for losses resulting from unauthorized access due to user negligence.
          </p>
        </div>
      </div>
    </main>
  );
}
