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

  {/* Exchange Notice */}
<div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
  <p className="font-medium text-amber-400 mb-1">
    Exchange Compatibility Notice
  </p>

  <p className="text-muted-foreground">
    Due to recent regulatory updates, some exchanges such as Binance
    may apply stricter transfer and address verification rules for
    new users, which can cause delays or failed transactions.
    <br /><br />
    For a smoother deposit experience, we recommend using
    Bybit, OKX, Bitget, or other widely supported exchanges
    available in your region.
  </p>
</div>


      <DepositForm address={address} />
    </div>
  );
}

