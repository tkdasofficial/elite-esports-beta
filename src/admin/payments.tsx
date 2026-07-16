import { useState } from "react";
import { Search, CheckCircle2, Trash2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentRequest {
  id: string;
  name: string;
  uid: string;
  phone: string;
  type: "deposit" | "withdrawal";
  amount: number;
  upiId?: string;
  status: "pending" | "approved" | "rejected";
  dateTime: string;
  txnId?: string;
}

export function PaymentsPanel({
  showSuccess,
  showError,
}: {
  showSuccess: (m: string) => void;
  showError: (m: string) => void;
}) {
  // Mock Ledger to maintain stateful responses
  const [payments, setPayments] = useState<PaymentRequest[]>([
    {
      id: "pay_1",
      name: "GhostReaperOP",
      uid: "583920194",
      phone: "+91 98765 43210",
      type: "withdrawal",
      amount: 150,
      upiId: "ghostreaper@paytm",
      status: "pending",
      dateTime: "16 Jul • 11:32 AM",
    },
    {
      id: "pay_2",
      name: "SniperElite",
      uid: "482019482",
      phone: "+91 87654 32109",
      type: "deposit",
      amount: 50,
      txnId: "TXN5839105829104",
      status: "pending",
      dateTime: "16 Jul • 09:15 AM",
    },
    {
      id: "pay_3",
      name: "DynamoFreeFire",
      uid: "294810394",
      phone: "+91 76543 21098",
      type: "deposit",
      amount: 100,
      txnId: "TXN10482049104",
      status: "approved",
      dateTime: "15 Jul • 06:40 PM",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "deposit" | "withdrawal">("all");
  const [selectedTxn, setSelectedTxn] = useState<PaymentRequest | null>(null);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.txnId && p.txnId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.upiId && p.upiId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterType === "all" || p.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = (id: string, newStatus: "approved" | "rejected") => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    showSuccess(`Transaction state marked as "${newStatus}"!`);
    setSelectedTxn(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently purge this ledger entry?")) {
      setPayments(payments.filter((p) => p.id !== id));
      showSuccess("Transaction pruned from records.");
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-black text-foreground">
          Billing & Payments Audit Ledger
        </h2>
        <span className="text-[10px] font-mono text-muted-foreground bg-surface-2 px-2 py-0.5 rounded">
          Active logs: {filtered.length} entries
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, TXN ID, UPI ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "all" | "deposit" | "withdrawal")}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs text-foreground font-bold focus:outline-none focus:border-brand"
        >
          <option value="all">ALL TYPES</option>
          <option value="deposit">DEPOSITS ONLY</option>
          <option value="withdrawal">WITHDRAWALS ONLY</option>
        </select>
      </div>

      {/* Ledger Records */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedTxn(p)}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow hover:border-brand/30 transition-all cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[8px] font-bold",
                    p.type === "deposit"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/10 border border-amber-500/20 text-amber-400",
                  )}
                >
                  {p.type}
                </span>

                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[8px] font-bold",
                    p.status === "approved" &&
                      "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
                    p.status === "pending" && "bg-sky-500/10 border border-sky-500/20 text-sky-400",
                    p.status === "rejected" &&
                      "bg-destructive/10 border border-destructive/20 text-destructive",
                  )}
                >
                  {p.status}
                </span>
              </div>

              <h3 className="font-display text-xs font-black text-foreground mt-1 truncate">
                {p.name}
              </h3>
              <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">
                {p.dateTime} • UID: {p.uid}
              </p>
              {p.txnId && (
                <p className="text-[9px] font-mono text-muted-foreground truncate">
                  TXN: {p.txnId}
                </p>
              )}
              {p.upiId && (
                <p className="text-[9px] font-mono text-muted-foreground truncate">
                  UPI: {p.upiId}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <strong
                className={cn(
                  "font-display text-base font-black",
                  p.type === "deposit" ? "text-emerald-400" : "text-amber-400",
                )}
              >
                {p.type === "deposit" ? "+" : "-"}₹{p.amount}
              </strong>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p.id);
                }}
                className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                title="Delete Log"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground bg-card">
            No transactions found matching specified criteria.
          </div>
        )}
      </div>

      {/* Transaction Details/Resolution Drawer/Popup */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedTxn(null)}
              className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-display text-base font-black text-foreground mb-4">
              Transaction Details & Auditing
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5 bg-surface-2 p-3 rounded-xl border border-border text-xs">
                <div className="flex justify-between border-b border-border/30 pb-1.5">
                  <span className="text-muted-foreground">Account Holder:</span>
                  <span className="font-bold text-foreground">{selectedTxn.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-1.5">
                  <span className="text-muted-foreground">Game UID:</span>
                  <span className="font-bold text-foreground">{selectedTxn.uid}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-1.5">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-bold text-foreground">{selectedTxn.type}</span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-1.5">
                  <span className="text-muted-foreground">Transaction Amount:</span>
                  <span className="font-bold text-foreground">₹{selectedTxn.amount}</span>
                </div>
                {selectedTxn.upiId && (
                  <div className="flex justify-between border-b border-border/30 py-1.5">
                    <span className="text-muted-foreground">UPI ID Target:</span>
                    <span className="font-mono font-bold text-brand">{selectedTxn.upiId}</span>
                  </div>
                )}
                {selectedTxn.txnId && (
                  <div className="flex justify-between border-b border-border/30 py-1.5">
                    <span className="text-muted-foreground">User Uploaded Txn ID:</span>
                    <span className="font-mono font-bold text-foreground truncate max-w-[160px]">
                      {selectedTxn.txnId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-bold text-foreground">{selectedTxn.status}</span>
                </div>
              </div>

              {selectedTxn.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedTxn.id, "rejected")}
                    className="flex-1 py-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold tracking-wider transition-colors"
                  >
                    Reject Txn
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTxn.id, "approved")}
                    className="flex-1 py-2.5 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider shadow-lg shadow-brand/15 flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve Txn
                  </button>
                </div>
              )}

              {selectedTxn.status !== "pending" && (
                <div className="bg-surface-3 rounded-xl p-3 text-center border border-border text-[11px] font-bold text-muted-foreground flex items-center justify-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" /> This transaction is finalized as{" "}
                  <span className="text-foreground">{selectedTxn.status}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
