import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Plus, X, Check, CreditCard } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
});

function WalletPage() {
  const { wallet, setWallet, transactions, addTransaction } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [addAmount, setAddAmount] = useState("100");
  const [withdrawAmount, setWithdrawAmount] = useState("100");
  const [withdrawUpi, setWithdrawUpi] = useState("gamer@okaxis");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const formatCurrentTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const timeStr = new Date().toLocaleTimeString("en-US", options);
    return "Today • " + timeStr;
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    const newBalance = wallet + amt;
    setWallet(newBalance);

    const transactionTime = formatCurrentTime();
    const sourceLabel = paymentMethod === "upi" ? "UPI • ****4521" : "Card • ****9812";

    addTransaction({
      t: "Wallet Top-up",
      d: sourceLabel,
      a: amt,
      kind: "in" as const,
      when: transactionTime,
    });

    setSuccessMsg(`Successfully added ₹${amt.toFixed(2)} to your wallet!`);
    setShowAddModal(false);
    setErrorMsg("");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    if (amt > wallet) {
      setErrorMsg(`Insufficient funds. Your wallet balance is ₹${wallet.toFixed(2)}.`);
      return;
    }

    if (!withdrawUpi.trim()) {
      setErrorMsg("Please enter a valid UPI ID.");
      return;
    }

    const newBalance = wallet - amt;
    setWallet(newBalance);

    const transactionTime = formatCurrentTime();

    addTransaction({
      t: "Withdrawal",
      d: `Bank Transfer • UPI: ${withdrawUpi}`,
      a: -amt,
      kind: "out" as const,
      when: transactionTime,
    });

    setSuccessMsg(`Successfully initiated withdrawal of ₹${amt.toFixed(2)}.`);
    setShowWithdrawModal(false);
    setErrorMsg("");
  };

  return (
    <AppShell>
      {/* Toast Alert */}
      {successMsg && (
        <div className="mx-4 mt-2 flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-emerald-400 text-xs font-bold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-400 hover:opacity-80">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-2 mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand/70 to-black p-5 text-brand-foreground shadow-lg">
        <div className="text-[10px] tracking-widest opacity-90 font-black">Available Balance</div>
        <div className="mt-1 font-display text-4xl font-black tabular-nums">
          ₹{wallet.toFixed(2)}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setShowAddModal(true);
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-black/30 py-3 text-xs font-black tracking-wider backdrop-blur hover:bg-black/40 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Money
          </button>
          <button
            onClick={() => {
              setShowWithdrawModal(true);
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/95 py-3 text-xs font-black tracking-wider text-brand hover:opacity-90 transition-opacity"
          >
            <ArrowUpFromLine className="h-4 w-4" /> Withdraw
          </button>
        </div>
      </div>

      <div className="mt-6 px-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold tracking-wider">Transactions</h2>
        <span className="text-[10px] font-semibold text-muted-foreground tracking-widest tabular-nums">
          {transactions.length} Records
        </span>
      </div>

      {transactions.length > 0 ? (
        <ul className="mx-4 mt-2 mb-20 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {transactions.map((tx, i) => (
            <li key={i} className="flex items-center gap-3 p-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tx.kind === "in" ? "bg-success/15 text-success" : "bg-brand/15 text-brand"}`}
              >
                {tx.kind === "in" ? (
                  <ArrowDownToLine className="h-4 w-4" />
                ) : (
                  <ArrowUpFromLine className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-bold text-foreground">
                  {tx.t}
                </div>
                <div className="truncate text-[10px] text-muted-foreground font-medium">
                  {tx.d} • {tx.when}
                </div>
              </div>
              <div
                className={`font-display text-sm font-black tabular-nums shrink-0 ${tx.kind === "in" ? "text-success" : "text-foreground"}`}
              >
                {tx.kind === "in" ? "+" : ""}₹{Math.abs(tx.a).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-4 mt-2 p-8 border border-dashed border-border rounded-2xl text-center text-xs text-muted-foreground">
          No transactions yet.
        </div>
      )}

      {/* Add Money Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-black tracking-wider">Top-up Wallet</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddMoney} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-wider text-muted-foreground">
                  Enter Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 font-display text-lg font-black text-foreground outline-none focus:border-brand"
                  placeholder="e.g. 100"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {["50", "100", "200", "500"].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setAddAmount(preset)}
                    className={cn(
                      "py-1.5 text-xs font-bold rounded-lg border transition-all font-mono",
                      addAmount === preset
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border bg-surface-2 text-muted-foreground hover:bg-surface-3",
                    )}
                  >
                    +₹{preset}
                  </button>
                ))}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-wider text-muted-foreground">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-black tracking-wider",
                      paymentMethod === "upi"
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border bg-surface-2 text-muted-foreground",
                    )}
                  >
                    ⚡ UPI/Instant
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-black tracking-wider",
                      paymentMethod === "card"
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border bg-surface-2 text-muted-foreground",
                    )}
                  >
                    <CreditCard className="h-4 w-4" /> Card
                  </button>
                </div>
              </div>

              {errorMsg && <p className="text-[11px] font-bold text-destructive">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider brand-glow"
              >
                Proceed to Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-black tracking-wider">Withdraw Funds</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="bg-surface-2 rounded-xl p-3 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Maximum Withdraw:</span>
                <strong className="text-foreground font-mono">₹{wallet.toFixed(2)}</strong>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-wider text-muted-foreground">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 font-display text-lg font-black text-foreground outline-none focus:border-brand"
                  placeholder="e.g. 100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-wider text-muted-foreground">
                  UPI ID or VPA
                </label>
                <input
                  type="text"
                  required
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-xs font-bold text-foreground outline-none focus:border-brand"
                  placeholder="e.g. player@okaxis"
                />
              </div>

              {errorMsg && <p className="text-[11px] font-bold text-destructive">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider brand-glow"
              >
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
