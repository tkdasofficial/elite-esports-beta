import { useState } from "react";
import { Search, Shield, ShieldAlert, X, Clock, Unlock, Lock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminUser } from "@/lib/app-state";

export function DetailField({
  label,
  value,
  isMono,
  highlight,
}: {
  label: string;
  value: string;
  isMono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <span className="text-[8px] tracking-wider text-muted-foreground font-black block">
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-bold text-foreground block truncate",
          isMono && "font-mono",
          highlight && "text-brand",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function UsersPanel({
  users,
  payUser,
  updateUserStatus,
  showSuccess,
  showError,
}: {
  users: AdminUser[];
  payUser: (u: string, a: number, r: string) => boolean;
  updateUserStatus: (
    uid: string,
    status: "active" | "suspended" | "banned" | "terminated",
    reason?: string,
    suspendedUntil?: string,
  ) => void;
  showSuccess: (m: string) => void;
  showError: (m: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [payAmount, setPayAmount] = useState<number | "">("");
  const [payReason, setPayReason] = useState("");
  const [activeUserToPay, setActiveUserToPay] = useState<AdminUser | null>(null);

  // Management modal states
  const [activeUserToManage, setActiveUserToManage] = useState<AdminUser | null>(null);
  const [managementMode, setManagementMode] = useState<"view" | "suspend" | "ban" | "terminate">(
    "view",
  );
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDays, setSuspendDays] = useState("7");
  const [banReason, setBanReason] = useState("");
  const [terminateInput, setTerminateInput] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uid.includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUserToPay || payAmount === "") return;

    const amt = Number(payAmount);
    const desc = payReason.trim() || "Consolation Bonus / Admin adjustment";

    const ok = payUser(activeUserToPay.uid, amt, desc);
    if (ok) {
      showSuccess(
        `Successfully updated ${activeUserToPay.ign}'s balance by ₹${amt >= 0 ? "+" : ""}${amt}!`,
      );
      setPayAmount("");
      setPayReason("");
      setActiveUserToPay(null);
    } else {
      showError("Failed to adjust wallet balance.");
    }
  };

  const handleSuspendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUserToManage) return;

    const days = parseInt(suspendDays) || 7;
    const untilDate = new Date();
    untilDate.setDate(untilDate.getDate() + days);
    const dateStr = untilDate.toISOString().split("T")[0];
    const reason = suspendReason.trim() || "Violation of rules / terms";

    updateUserStatus(activeUserToManage.uid, "suspended", reason, dateStr);
    showSuccess(`Successfully suspended ${activeUserToManage.ign} for ${days} days.`);

    setActiveUserToManage(null);
    setSuspendReason("");
    setSuspendDays("7");
    setManagementMode("view");
  };

  const handleUnsuspend = (uid: string, ign: string) => {
    updateUserStatus(uid, "active");
    showSuccess(`Lifted suspension for player ${ign}.`);
    setActiveUserToManage(null);
    setManagementMode("view");
  };

  const handleBanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUserToManage) return;

    const reason = banReason.trim() || "Severe violation of community standards";
    updateUserStatus(activeUserToManage.uid, "banned", reason);
    showSuccess(`Successfully banned ${activeUserToManage.ign} from the lobby permanently.`);

    setActiveUserToManage(null);
    setBanReason("");
    setManagementMode("view");
  };

  const handleUnban = (uid: string, ign: string) => {
    updateUserStatus(uid, "active");
    showSuccess(`Unbanned player ${ign} successfully.`);
    setActiveUserToManage(null);
    setManagementMode("view");
  };

  const handleTerminateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUserToManage) return;

    if (terminateInput !== "TERMINATE") {
      showError("Please type 'TERMINATE' to confirm account closure.");
      return;
    }

    updateUserStatus(activeUserToManage.uid, "terminated", "Hard closure of user account");
    showSuccess(`Successfully terminated roster profile ${activeUserToManage.ign} permanently.`);

    setActiveUserToManage(null);
    setTerminateInput("");
    setManagementMode("view");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by IGN, email, or UID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
        />
      </div>

      {/* Users grid */}
      <div className="space-y-3">
        {filteredUsers.map((u) => {
          const isActive = u.status === "active" || !u.status;
          const isSuspended = u.status === "suspended";
          const isBanned = u.status === "banned";
          const isTerminated = u.status === "terminated";

          return (
            <div
              key={u.uid}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-md transition-all",
                isSuspended && "border-amber-500/20 bg-amber-500/[0.01]",
                isBanned && "border-red-500/20 bg-red-500/[0.01]",
                isTerminated && "border-zinc-500/10 bg-zinc-500/[0.01] opacity-75",
              )}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-sm font-black",
                    isActive && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                    isSuspended && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                    isBanned && "bg-red-500/10 text-red-500 border border-red-500/20",
                    isTerminated && "bg-zinc-500/10 text-zinc-400 border border-zinc-500/25",
                  )}
                >
                  {u.ign.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-xs font-black text-foreground truncate">
                      {u.ign || "No IGN Profile"}
                    </h4>

                    {/* Status badges */}
                    {isSuspended && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[8px] font-black text-amber-500 tracking-widest leading-none">
                        Suspended
                      </span>
                    )}
                    {isBanned && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.5 text-[8px] font-black text-red-500 tracking-widest leading-none">
                        Banned
                      </span>
                    )}
                    {isTerminated && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-500/15 border border-zinc-500/25 px-2 py-0.5 text-[8px] font-black text-zinc-400 tracking-widest leading-none">
                        Terminated
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[8px] font-black text-emerald-500 tracking-widest leading-none">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="font-mono">UID: {u.uid}</span>
                    <span>•</span>
                    <span className="truncate">{u.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-border/40 pt-2.5 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div
                    className={cn(
                      "font-display text-xs font-black leading-none",
                      isTerminated ? "text-zinc-400" : "text-brand",
                    )}
                  >
                    ₹{u.wallet.toFixed(0)}
                  </div>
                  <span className="text-[8px] font-bold tracking-wider text-muted-foreground block mt-0.5">
                    Wallet Bal
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!isTerminated && (
                    <button
                      type="button"
                      onClick={() => setActiveUserToPay(u)}
                      className="rounded-lg bg-surface-2 border border-border px-2.5 py-1 font-display text-[9px] font-black tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pay/Adj
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveUserToManage(u);
                      setManagementMode("view");
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1 font-display text-[9px] font-black tracking-wider transition-colors flex items-center gap-1",
                      isTerminated
                        ? "bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 hover:bg-zinc-500/15"
                        : "bg-brand/10 border border-brand/20 text-brand hover:bg-brand/15",
                    )}
                  >
                    <Shield className="h-3 w-3" />
                    Manage & Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredUsers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground bg-card">
            No registered users match your search.
          </div>
        )}
      </div>

      {/* Pay / Adjust Overlay Modal */}
      {activeUserToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handlePaySubmit}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="text-center space-y-1">
              <h3 className="font-display text-base font-black tracking-wide text-foreground">
                Adjust Roster Balance
              </h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Refining wallet ledger state for{" "}
                <span className="text-brand font-bold">{activeUserToPay.ign}</span> (UID:{" "}
                {activeUserToPay.uid})
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                  Amount Adjustment (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 100 for payout, -50 for entry deduct"
                  value={payAmount}
                  onChange={(e) =>
                    setPayAmount(e.target.value !== "" ? Number(e.target.value) : "")
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                  Reason / Description Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. First Prize — Solo Hunter"
                  value={payReason}
                  onChange={(e) => setPayReason(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveUserToPay(null)}
                className="py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-bold tracking-wider text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider shadow-lg shadow-brand/10 brand-glow"
              >
                Apply Ledger Adjust
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Details & Account Control Modal */}
      {activeUserToManage &&
        (() => {
          const u = activeUserToManage;
          const isActive = u.status === "active" || !u.status;
          const isSuspended = u.status === "suspended";
          const isBanned = u.status === "banned";
          const isTerminated = u.status === "terminated";

          return (
            <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
              <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden my-auto">
                {/* Modal Header */}
                <div className="relative border-b border-border/80 bg-surface-2 p-5 flex items-center gap-3.5 shrink-0">
                  <div
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-2xl font-display text-base font-black",
                      isActive && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                      isSuspended && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                      isBanned && "bg-red-500/10 text-red-500 border border-red-500/20",
                      isTerminated && "bg-zinc-500/15 text-zinc-400 border border-zinc-500/25",
                    )}
                  >
                    {u.ign.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-base font-black text-foreground tracking-wide leading-none">
                        {u.ign}
                      </h3>
                      {isSuspended && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-[8px] font-black text-amber-500 tracking-widest leading-none">
                          Suspended
                        </span>
                      )}
                      {isBanned && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/15 border border-red-500/25 px-2 py-0.5 text-[8px] font-black text-red-500 tracking-widest leading-none">
                          Banned
                        </span>
                      )}
                      {isTerminated && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-500/20 border border-zinc-500/25 px-2 py-0.5 text-[8px] font-black text-zinc-400 tracking-widest leading-none">
                          Terminated
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-[8px] font-black text-emerald-500 tracking-widest leading-none">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">
                      UID: {u.uid}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveUserToManage(null);
                      setManagementMode("view");
                    }}
                    className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-lg bg-surface hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-5 space-y-4 overflow-y-auto flex-1">
                  {/* Warning banners for abnormal statuses */}
                  {isSuspended && (
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 flex gap-2.5 items-start text-xs text-amber-400">
                      <Clock className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                      <div>
                        <span className="font-bold tracking-wider block text-[10px] mb-0.5 text-amber-500">
                          Player is Suspended
                        </span>
                        <p className="leading-relaxed">
                          Suspended until{" "}
                          <strong className="text-foreground">{u.suspendedUntil || "N/A"}</strong>.
                        </p>
                        {u.statusReason && (
                          <p className="mt-1 text-[11px] text-amber-400/80 italic">
                            "{u.statusReason}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {isBanned && (
                    <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3 flex gap-2.5 items-start text-xs text-red-400">
                      <ShieldAlert className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      <div>
                        <span className="font-bold tracking-wider block text-[10px] mb-0.5 text-red-500">
                          Player is Permanently Banned
                        </span>
                        <p className="leading-relaxed">Access blocked to all match rooms.</p>
                        {u.statusReason && (
                          <p className="mt-1 text-[11px] text-red-400/80 italic">
                            Reason: "{u.statusReason}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {isTerminated && (
                    <div className="rounded-xl border border-zinc-500/25 bg-zinc-500/5 p-3 flex gap-2.5 items-start text-xs text-zinc-400">
                      <ShieldAlert className="h-4 w-4 shrink-0 text-zinc-500 mt-0.5" />
                      <div>
                        <span className="font-bold tracking-wider block text-[10px] mb-0.5 text-zinc-400">
                          Roster Account Terminated
                        </span>
                        <p className="leading-relaxed">
                          This profile is closed permanently. No further actions can be executed.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Main Management Interface */}
                  {managementMode === "view" ? (
                    <div className="space-y-4">
                      {/* Full Details Grid */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black tracking-widest text-muted-foreground px-0.5">
                          Full Player Profile Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl border border-border bg-surface-2 p-3.5">
                          <DetailField label="IGN Alias" value={u.ign} />
                          <DetailField label="Roster UID" value={u.uid} isMono />
                          <DetailField label="E-mail Address" value={u.email} />
                          <DetailField label="Phone Contact" value={u.phone || "+91 99999 99999"} />
                          <DetailField label="Date of Birth" value={u.dob || "1998-05-12"} />
                          <DetailField
                            label="Residential Location"
                            value={u.address || "Odisha, India"}
                          />
                          <DetailField label="Ledger Balance" value={`₹${u.wallet}`} highlight />
                          <DetailField label="Member Since" value={u.joinedAt || "2026-01-10"} />
                          <DetailField label="Games Played" value={String(u.gamesPlayed || 42)} />
                          <DetailField
                            label="Last Login State"
                            value={u.lastLogin || "Today • 08:30 AM"}
                          />
                        </div>
                      </div>

                      {/* Quick actions row */}
                      {!isTerminated && (
                        <div className="space-y-2 pt-2 border-t border-border/50">
                          <h4 className="text-[10px] font-black tracking-widest text-muted-foreground px-0.5">
                            Change Status Options
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {isSuspended ? (
                              <button
                                type="button"
                                onClick={() => handleUnsuspend(u.uid, u.ign)}
                                className="py-2 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-xs font-bold text-emerald-400 tracking-wider flex flex-col items-center justify-center gap-1.5"
                              >
                                <Unlock className="h-4 w-4 text-emerald-500" />
                                Unsuspend
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setManagementMode("suspend")}
                                className="py-2 px-3 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors text-xs font-bold text-amber-400 tracking-wider flex flex-col items-center justify-center gap-1.5"
                              >
                                <Clock className="h-4 w-4 text-amber-500" />
                                Suspend
                              </button>
                            )}

                            {isBanned ? (
                              <button
                                type="button"
                                onClick={() => handleUnban(u.uid, u.ign)}
                                className="py-2 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-xs font-bold text-emerald-400 tracking-wider flex flex-col items-center justify-center gap-1.5"
                              >
                                <Unlock className="h-4 w-4 text-emerald-500" />
                                Unban
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setManagementMode("ban")}
                                className="py-2 px-3 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors text-xs font-bold text-red-400 tracking-wider flex flex-col items-center justify-center gap-1.5"
                              >
                                <Lock className="h-4 w-4 text-red-500" />
                                Ban Player
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setManagementMode("terminate")}
                              className="py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 transition-colors text-xs font-bold text-rose-400 tracking-wider flex flex-col items-center justify-center gap-1.5"
                            >
                              <Trash2 className="h-4 w-4 text-rose-500" />
                              Terminate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Inline Suspend Form */}
                  {managementMode === "suspend" && (
                    <form
                      onSubmit={handleSuspendSubmit}
                      className="space-y-4 animate-in slide-in-from-bottom-2 duration-200"
                    >
                      <div className="flex items-center gap-2 text-amber-500 font-display text-sm font-black tracking-wider">
                        <Clock className="h-4 w-4" /> Suspend Player {u.ign}
                      </div>

                      <div className="space-y-3 bg-surface-2 border border-border/80 rounded-xl p-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                            Suspension Duration (Days)
                          </label>
                          <select
                            value={suspendDays}
                            onChange={(e) => setSuspendDays(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-bold"
                          >
                            <option value="1">1 Day (24 Hours)</option>
                            <option value="3">3 Days (72 Hours)</option>
                            <option value="7">7 Days (1 Week)</option>
                            <option value="14">14 Days (2 Weeks)</option>
                            <option value="30">30 Days (1 Month)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                            Case Log / Suspension Reason
                          </label>
                          <textarea
                            required
                            placeholder="e.g. Unsportsmanlike conduct in competitive match CS45."
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setManagementMode("view")}
                          className="py-2.5 rounded-xl bg-surface hover:bg-surface-3 transition-colors text-xs font-bold tracking-wider text-foreground"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors font-display text-xs font-black tracking-wider text-black shadow-lg shadow-amber-500/10"
                        >
                          Apply Suspension
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Inline Ban Form */}
                  {managementMode === "ban" && (
                    <form
                      onSubmit={handleBanSubmit}
                      className="space-y-4 animate-in slide-in-from-bottom-2 duration-200"
                    >
                      <div className="flex items-center gap-2 text-red-500 font-display text-sm font-black tracking-wider">
                        <Lock className="h-4 w-4" /> Permanently Ban Player {u.ign}
                      </div>

                      <div className="space-y-3 bg-surface-2 border border-border/80 rounded-xl p-3.5">
                        <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-2.5 text-[11px] text-red-400 leading-relaxed">
                          <strong>CRITICAL DIRECTIVE:</strong> Banning is permanent. The player will
                          be blocklisted from accessing active tournaments and lobby match rooms.
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                            Reason for Permanent Ban
                          </label>
                          <textarea
                            required
                            placeholder="e.g. Multiple accounts bypass or hacking script detected on device."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setManagementMode("view")}
                          className="py-2.5 rounded-xl bg-surface hover:bg-surface-3 transition-colors text-xs font-bold tracking-wider text-foreground"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition-colors font-display text-xs font-black tracking-wider text-white shadow-lg shadow-red-500/10"
                        >
                          Confirm Permanent Ban
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Inline Terminate Form */}
                  {managementMode === "terminate" && (
                    <form
                      onSubmit={handleTerminateSubmit}
                      className="space-y-4 animate-in slide-in-from-bottom-2 duration-200"
                    >
                      <div className="flex items-center gap-2 text-rose-500 font-display text-sm font-black tracking-wider">
                        <Trash2 className="h-4 w-4" /> Terminate Player Profile {u.ign}
                      </div>

                      <div className="space-y-3 bg-surface-2 border border-border/80 rounded-xl p-3.5">
                        <div className="rounded-xl bg-rose-500/5 border border-rose-500/25 p-2.5 text-[11px] text-rose-400 leading-relaxed">
                          <strong>DANGER AREA:</strong> Terminating hard-closes the user account,
                          locks ledger records, and removes their identity from current tournament
                          lobbies.
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                            To confirm, please type{" "}
                            <strong className="text-rose-400 font-mono">TERMINATE</strong> below:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="TERMINATE"
                            value={terminateInput}
                            onChange={(e) => setTerminateInput(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-rose-500 font-mono font-bold text-center tracking-widest"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setManagementMode("view");
                            setTerminateInput("");
                          }}
                          className="py-2.5 rounded-xl bg-surface hover:bg-surface-3 transition-colors text-xs font-bold tracking-wider text-foreground"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={terminateInput !== "TERMINATE"}
                          className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-display text-xs font-black tracking-wider text-white shadow-lg shadow-rose-600/10"
                        >
                          Hard Terminate Account
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
