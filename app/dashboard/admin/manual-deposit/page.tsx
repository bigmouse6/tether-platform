import ManualAdjustForm from "../components/manual-adjust-form";

export default function ManualDepositPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Manual Deposit</h1>
      <p className="text-white/60 mt-2">
        Add USDT to a user by email. This will update balance and create a history record.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <ManualAdjustForm mode="deposit" />
      </div>
    </div>
  );
}
