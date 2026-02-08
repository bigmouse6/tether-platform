import DepositForm from "./deposit-form";

export default function DepositPage() {
  const address = process.env.NEXT_PUBLIC_TRC20_DEPOSIT_ADDRESS ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Deposit</h1>
        <p className="mt-2 text-sm text-white/60">
          Enter amount and send USDT (TRC20) to the address below.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">
  <div className="mt-0.5 text-yellow-400">⚠️</div>
  <div>
    <p className="font-medium">
      Send only USDT (TRC20) to this address.
    </p>
    <p className="text-yellow-200/80">
      Sending any other assets or using a different network will result in permanent loss.
    </p>
  </div>
</div>


      <DepositForm address={address} />
    </div>
  );
}

