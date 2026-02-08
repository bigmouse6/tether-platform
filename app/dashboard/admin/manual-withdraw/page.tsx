import ManualAdjustForm from "../components/manual-adjust-form";

export default function ManualWithdrawPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Manual Withdraw</h1>
      <p className="text-white/60 mt-2">
        Subtract USDT from a user by email. This will update balance and create a history record.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <ManualAdjustForm mode="withdraw" />
      </div>
    </div>
  );
}
