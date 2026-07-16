import { useState, useEffect } from "react";
import {
  Users,
  KeyRound,
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  Search,
  CheckCircle,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Ban,
  XCircle,
  Play,
} from "lucide-react";
import { useApp, EsportsTeam, AdminUser } from "@/lib/app-state";

export function EsportsTeamsPanel({
  showSuccess,
  showError,
}: {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}) {
  const { esportsTeams, addEsportsTeam, updateEsportsTeam, deleteEsportsTeam, usersList } =
    useApp();

  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  // Form states
  const [name, setName] = useState("");
  const [leaderUid, setLeaderUid] = useState("");
  const [leaderIgn, setLeaderIgn] = useState("");

  // Roster states - UIDs and IGNs
  const [p1Uid, setP1Uid] = useState("");
  const [p1Ign, setP1Ign] = useState("");

  const [p2Uid, setP2Uid] = useState("");
  const [p2Ign, setP2Ign] = useState("");

  const [p3Uid, setP3Uid] = useState("");
  const [p3Ign, setP3Ign] = useState("");

  const [p4Uid, setP4Uid] = useState("");
  const [p4Ign, setP4Ign] = useState("");

  const [backupUid, setBackupUid] = useState("");
  const [backupIgn, setBackupIgn] = useState("");

  const [passKey, setPassKey] = useState("");

  // Search/Auto-fill listeners
  useEffect(() => {
    if (leaderUid) {
      const user = usersList.find((u) => u.uid === leaderUid.trim());
      if (user) {
        setLeaderIgn(user.ign);
      }
    }
  }, [leaderUid, usersList]);

  useEffect(() => {
    if (p1Uid) {
      const user = usersList.find((u) => u.uid === p1Uid.trim());
      if (user) setP1Ign(user.ign);
    }
  }, [p1Uid, usersList]);

  useEffect(() => {
    if (p2Uid) {
      const user = usersList.find((u) => u.uid === p2Uid.trim());
      if (user) setP2Ign(user.ign);
    }
  }, [p2Uid, usersList]);

  useEffect(() => {
    if (p3Uid) {
      const user = usersList.find((u) => u.uid === p3Uid.trim());
      if (user) setP3Ign(user.ign);
    }
  }, [p3Uid, usersList]);

  useEffect(() => {
    if (p4Uid) {
      const user = usersList.find((u) => u.uid === p4Uid.trim());
      if (user) setP4Ign(user.ign);
    }
  }, [p4Uid, usersList]);

  useEffect(() => {
    if (backupUid) {
      const user = usersList.find((u) => u.uid === backupUid.trim());
      if (user) setBackupIgn(user.ign);
    }
  }, [backupUid, usersList]);

  const resetForm = () => {
    setName("");
    setLeaderUid("");
    setLeaderIgn("");
    setP1Uid("");
    setP1Ign("");
    setP2Uid("");
    setP2Ign("");
    setP3Uid("");
    setP3Ign("");
    setP4Uid("");
    setP4Ign("");
    setBackupUid("");
    setBackupIgn("");
    setPassKey("");
  };

  const generatePasskey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const formatted = `TEAM-${code.slice(0, 4)}-${code.slice(4)}`;
    setPassKey(formatted);
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedText(txt);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleOpenCreate = () => {
    resetForm();
    generatePasskey();
    setView("create");
  };

  const handleOpenEdit = (t: EsportsTeam) => {
    setEditingId(t.id);
    setName(t.name);
    setPassKey(t.passKey);

    // Parse team leader - can be structured as "IGN (UID: xxxxx)" or just "IGN"
    const parsedLeader = parseTeamMemberString(t.leader);
    setLeaderIgn(parsedLeader.ign);
    setLeaderUid(parsedLeader.uid || "");

    // Parse players
    const p1 = parseTeamMemberString(t.players[0] || "");
    setP1Ign(p1.ign);
    setP1Uid(p1.uid || "");

    const p2 = parseTeamMemberString(t.players[1] || "");
    setP2Ign(p2.ign);
    setP2Uid(p2.uid || "");

    const p3 = parseTeamMemberString(t.players[2] || "");
    setP3Ign(p3.ign);
    setP3Uid(p3.uid || "");

    const p4 = parseTeamMemberString(t.players[3] || "");
    setP4Ign(p4.ign);
    setP4Uid(p4.uid || "");

    const backup = parseTeamMemberString(t.backup || "");
    setBackupIgn(backup.ign);
    setBackupUid(backup.uid || "");

    setView("edit");
  };

  const parseTeamMemberString = (str: string): { ign: string; uid?: string } => {
    if (!str) return { ign: "" };
    // Pattern match: "IGN (UID: xxxx)" or "IGN"
    const match = str.match(/^(.*?)\s*\(UID:\s*(\d+)\)$/i);
    if (match) {
      return { ign: match[1].trim(), uid: match[2].trim() };
    }
    return { ign: str.trim() };
  };

  const formatTeamMemberString = (ign: string, uid?: string): string => {
    if (!ign) return "";
    return uid ? `${ign.trim()} (UID: ${uid.trim()})` : ign.trim();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Please specify a Team Name.");
      return;
    }
    if (!leaderIgn.trim()) {
      showError("Please specify a Team Leader.");
      return;
    }

    const compiledLeader = formatTeamMemberString(leaderIgn, leaderUid);
    const compiledP1 = formatTeamMemberString(p1Ign, p1Uid);
    const compiledP2 = formatTeamMemberString(p2Ign, p2Uid);
    const compiledP3 = formatTeamMemberString(p3Ign, p3Uid);
    const compiledP4 = formatTeamMemberString(p4Ign, p4Uid);
    const compiledBackup = formatTeamMemberString(backupIgn, backupUid);

    const activePlayers = [compiledP1, compiledP2, compiledP3, compiledP4].filter(Boolean);

    const payload: EsportsTeam = {
      id: view === "edit" ? editingId : "et_" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      leader: compiledLeader,
      players: activePlayers,
      backup: compiledBackup || undefined,
      passKey: passKey.trim() || "TEAM-GEN-9900",
    };

    if (view === "create") {
      addEsportsTeam(payload);
      showSuccess(`Esports Team "${payload.name}" registered successfully.`);
    } else {
      updateEsportsTeam(editingId, payload);
      showSuccess(`Esports Team "${payload.name}" configuration updated.`);
    }
    setView("list");
  };

  // Helper component to show lookups status
  const VerificationStatus = ({ uid, ign }: { uid: string; ign: string }) => {
    if (!uid) return null;
    const isVerified = usersList.some((u) => u.uid === uid.trim());
    return (
      <div className="flex items-center gap-1 mt-1 text-[9px] font-bold tracking-wider">
        {isVerified ? (
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 shrink-0" /> Verified Member (
            {ign || "Lookup successful"})
          </span>
        ) : (
          <span className="text-amber-400 flex items-center gap-1">
            <HelpCircle className="h-3 w-3 shrink-0" /> Custom / Unregistered UID
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-black text-muted-foreground tracking-wider">
          {view === "list" && `Registered Teams (${esportsTeams.length})`}
          {view === "create" && "Form: Register Esports Team"}
          {view === "edit" && "Form: Edit Esports Team"}
        </h2>
        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 font-display text-[10px] font-black tracking-wider text-brand-foreground shadow"
          >
            <Plus className="h-3.5 w-3.5" /> Add Team
          </button>
        ) : (
          <button
            onClick={() => setView("list")}
            className="rounded-xl bg-surface-2 px-3 py-1.5 text-[10px] font-black tracking-wider text-foreground hover:bg-surface-3 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {view === "list" ? (
        <div className="space-y-3">
          {esportsTeams.map((t) => {
            const parsedLeader = parseTeamMemberString(t.leader);
            const isExpanded = !!expandedTeams[t.id];
            const currentStatus = t.status || "active";

            return (
              <div
                key={t.id}
                className={`rounded-2xl border bg-card p-4 shadow-sm space-y-4 transition-all duration-200 ${
                  currentStatus === "banned"
                    ? "border-destructive/40 bg-destructive/5"
                    : currentStatus === "suspended"
                      ? "border-amber-500/40 bg-amber-500/5"
                      : currentStatus === "terminated"
                        ? "border-neutral-700 bg-neutral-900/30 opacity-75"
                        : "border-border hover:border-brand/30"
                }`}
              >
                {/* Top Section: Name and Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="font-display text-base font-black text-foreground tracking-wide">
                        {t.name}
                      </h3>
                      {currentStatus === "active" && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                      {currentStatus === "suspended" && (
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-amber-400 border border-amber-500/20">
                          Suspended
                        </span>
                      )}
                      {currentStatus === "banned" && (
                        <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-red-400 border border-red-500/20">
                          Banned
                        </span>
                      )}
                      {currentStatus === "terminated" && (
                        <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-neutral-400 border border-neutral-700">
                          Terminated
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <div className="text-[11px] text-muted-foreground font-semibold">
                        IGL / Leader:{" "}
                        <span className="text-brand font-black ml-1">{parsedLeader.ign}</span>
                        {parsedLeader.uid && (
                          <span className="ml-1.5 text-[9px] font-mono bg-surface-3 px-1.5 py-0.5 rounded text-foreground/80 border border-border">
                            UID: {parsedLeader.uid}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                        Team Code:{" "}
                        <span className="font-mono font-bold text-foreground bg-surface px-1.5 py-0.5 rounded border border-border/50">
                          {t.passKey}
                        </span>
                        <button
                          onClick={() => handleCopy(t.passKey)}
                          className="text-brand hover:text-brand/80 active:scale-95 transition-transform"
                          title="Copy Team Code"
                          type="button"
                        >
                          {copiedText === t.passKey ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Group */}
                  <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="flex items-center gap-1 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border px-3 py-1.5 text-[10px] font-black tracking-wider text-foreground/90 transition-all active:scale-[0.97]"
                      title="Edit Team"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        const newStatus = currentStatus === "suspended" ? "active" : "suspended";
                        updateEsportsTeam(t.id, { status: newStatus });
                        showSuccess(`Team "${t.name}" status updated to ${newStatus}.`);
                      }}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-black tracking-wider border transition-all active:scale-[0.97] ${
                        currentStatus === "suspended"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                          : "bg-surface-2 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 border-border text-foreground/80"
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3" /> Suspend
                    </button>

                    <button
                      onClick={() => {
                        const newStatus = currentStatus === "banned" ? "active" : "banned";
                        updateEsportsTeam(t.id, { status: newStatus });
                        showSuccess(`Team "${t.name}" status updated to ${newStatus}.`);
                      }}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-black tracking-wider border transition-all active:scale-[0.97] ${
                        currentStatus === "banned"
                          ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                          : "bg-surface-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border-border text-foreground/80"
                      }`}
                    >
                      <Ban className="h-3 w-3" /> Ban
                    </button>

                    <button
                      onClick={() => {
                        const newStatus = currentStatus === "terminated" ? "active" : "terminated";
                        if (newStatus === "terminated") {
                          if (
                            confirm(
                              `Are you sure you want to terminate "${t.name}"? They will not be able to participate in matches.`,
                            )
                          ) {
                            updateEsportsTeam(t.id, { status: "terminated" });
                            showSuccess(`Team "${t.name}" has been terminated.`);
                          }
                        } else {
                          updateEsportsTeam(t.id, { status: "active" });
                          showSuccess(`Team "${t.name}" reactivated.`);
                        }
                      }}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-black tracking-wider border transition-all active:scale-[0.97] ${
                        currentStatus === "terminated"
                          ? "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700"
                          : "bg-surface-2 hover:bg-destructive/10 hover:text-red-500 hover:border-destructive/30 border-border text-foreground/80"
                      }`}
                    >
                      <XCircle className="h-3 w-3" /> Terminate
                    </button>
                  </div>
                </div>

                {/* Manage details button & expandable area */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleExpand(t.id)}
                      className="flex items-center gap-1 text-[11px] font-black tracking-wider text-brand hover:text-brand/80 transition-colors"
                      type="button"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" /> Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" /> Manage / Show All Details
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Completely remove team "${t.name}" from the database?`)) {
                          deleteEsportsTeam(t.id);
                          showSuccess("Team deleted successfully.");
                        }
                      }}
                      className="text-[10px] font-bold text-destructive hover:underline flex items-center gap-1"
                      title="Delete completely"
                      type="button"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="bg-surface/50 p-3 rounded-xl border border-border/40 space-y-3 animate-in slide-in-from-top-2 duration-200">
                      <div>
                        <span className="block text-[9px] text-muted-foreground font-black tracking-wider mb-2">
                          Assigned Player Roster
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {t.players.map((p, idx) => {
                            const parsedPlayer = parseTeamMemberString(p);
                            return (
                              <div
                                key={idx}
                                className="bg-background border border-border/50 text-[10px] font-semibold text-foreground px-2.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm"
                              >
                                <span className="text-foreground font-bold">
                                  {parsedPlayer.ign}
                                </span>
                                {parsedPlayer.uid && (
                                  <span className="text-[8px] text-brand border-l border-border/40 pl-2 font-mono">
                                    UID: {parsedPlayer.uid}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                          {t.players.length === 0 && (
                            <span className="text-xs text-muted-foreground italic">
                              No players added yet.
                            </span>
                          )}
                        </div>
                      </div>

                      {t.backup && (
                        <div className="border-t border-border/30 pt-2.5">
                          <span className="block text-[9px] text-muted-foreground font-black tracking-wider mb-2">
                            Substitute / Backup Player
                          </span>
                          <div className="inline-flex bg-brand/10 border border-brand/20 text-[10px] font-bold text-brand px-2.5 py-1.5 rounded-lg items-center gap-2">
                            <span>{parseTeamMemberString(t.backup).ign}</span>
                            {parseTeamMemberString(t.backup).uid && (
                              <span className="text-[8px] opacity-75 border-l border-brand/20 pl-2 font-mono">
                                UID: {parseTeamMemberString(t.backup).uid}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {esportsTeams.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground bg-card">
              No Esports teams have been registered. Add one above!
            </div>
          )}
        </div>
      ) : (
        /* Team Create or Edit Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <form
            onSubmit={handleSave}
            className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Team Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Total Gaming Esports"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>

            {/* Team Leader Section with UID Lookup */}
            <div className="border-t border-border/60 pt-3 space-y-2.5">
              <h3 className="text-[10px] font-black tracking-widest text-brand">
                Team Leader / Owner Registration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground">Leader UID</span>
                  <input
                    type="text"
                    placeholder="Enter User UID to lookup"
                    value={leaderUid}
                    onChange={(e) => setLeaderUid(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                  />
                  <VerificationStatus uid={leaderUid} ign={leaderIgn} />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground">Leader IGN *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PhantomAceHD (or auto-filled)"
                    value={leaderIgn}
                    onChange={(e) => setLeaderIgn(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>

            {/* Roster Assignment Slots */}
            <div className="border-t border-border/60 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black tracking-widest text-muted-foreground">
                  Assigned Player Roster (Add via UID to auto-fill)
                </h3>
                <span className="text-[8px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-black tracking-wider">
                  Verified Sync
                </span>
              </div>

              {/* Player 1 Slot */}
              <div className="bg-surface/50 p-2 rounded-xl border border-border/40 space-y-2">
                <span className="text-[9px] font-black text-muted-foreground">Roster Slot #1</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Player 1 UID"
                    value={p1Uid}
                    onChange={(e) => setP1Uid(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                  />
                  <input
                    type="text"
                    placeholder="Player 1 IGN"
                    value={p1Ign}
                    onChange={(e) => setP1Ign(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>
                <VerificationStatus uid={p1Uid} ign={p1Ign} />
              </div>

              {/* Player 2 Slot */}
              <div className="bg-surface/50 p-2 rounded-xl border border-border/40 space-y-2">
                <span className="text-[9px] font-black text-muted-foreground">Roster Slot #2</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Player 2 UID"
                    value={p2Uid}
                    onChange={(e) => setP2Uid(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                  />
                  <input
                    type="text"
                    placeholder="Player 2 IGN"
                    value={p2Ign}
                    onChange={(e) => setP2Ign(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>
                <VerificationStatus uid={p2Uid} ign={p2Ign} />
              </div>

              {/* Player 3 Slot */}
              <div className="bg-surface/50 p-2 rounded-xl border border-border/40 space-y-2">
                <span className="text-[9px] font-black text-muted-foreground">Roster Slot #3</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Player 3 UID"
                    value={p3Uid}
                    onChange={(e) => setP3Uid(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                  />
                  <input
                    type="text"
                    placeholder="Player 3 IGN"
                    value={p3Ign}
                    onChange={(e) => setP3Ign(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>
                <VerificationStatus uid={p3Uid} ign={p3Ign} />
              </div>

              {/* Player 4 Slot */}
              <div className="bg-surface/50 p-2 rounded-xl border border-border/40 space-y-2">
                <span className="text-[9px] font-black text-muted-foreground">Roster Slot #4</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Player 4 UID"
                    value={p4Uid}
                    onChange={(e) => setP4Uid(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                  />
                  <input
                    type="text"
                    placeholder="Player 4 IGN"
                    value={p4Ign}
                    onChange={(e) => setP4Ign(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>
                <VerificationStatus uid={p4Uid} ign={p4Ign} />
              </div>

              {/* Substitute Player Slot */}
              <div className="bg-surface/50 p-2 rounded-xl border border-border/40 space-y-2">
                <span className="text-[9px] font-black text-brand">
                  Roster Slot #5 (Substitute / Backup)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Backup UID"
                    value={backupUid}
                    onChange={(e) => setBackupUid(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                  />
                  <input
                    type="text"
                    placeholder="Backup IGN"
                    value={backupIgn}
                    onChange={(e) => setBackupIgn(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>
                <VerificationStatus uid={backupUid} ign={backupIgn} />
              </div>
            </div>

            {/* Passkey block */}
            <div className="border-t border-border/60 pt-3 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                  Assign Security Passkey (12-char)
                </label>
                <button
                  type="button"
                  onClick={generatePasskey}
                  className="text-[9px] tracking-wider font-black text-brand hover:underline"
                >
                  Auto-Generate
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. TEAM-XXXX-XXXX"
                value={passKey}
                onChange={(e) => setPassKey(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground font-mono tracking-widest focus:outline-none focus:border-brand"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand py-3.5 font-display text-xs font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98]"
            >
              {view === "create" ? "Confirm & Register Team" : "Update Team Details"}
            </button>
          </form>

          {/* Side Helper Panel: Registered Users reference */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3 h-fit">
            <div className="flex items-center gap-1.5 border-b border-border/80 pb-2.5">
              <Info className="h-4 w-4 text-brand" />
              <div>
                <h3 className="font-display text-[10px] font-black text-foreground leading-none">
                  Verified Users Database
                </h3>
                <span className="text-[8px] text-muted-foreground font-semibold">
                  Reference Panel for UIDs
                </span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Copy a player's UID from below and paste it in any of the roster UID input slots to
              test the verified member auto-fill service:
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {usersList.map((user) => (
                <div
                  key={user.uid}
                  className="p-2 rounded-xl bg-surface border border-border/60 hover:border-brand/30 transition-colors space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-foreground truncate max-w-[100px]">
                      {user.ign}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(user.uid)}
                      className="text-[8px] bg-surface-3 text-muted-foreground hover:text-brand border border-border/85 px-1.5 py-0.5 rounded font-black tracking-wider transition-colors"
                    >
                      {copiedText === user.uid ? "Copied" : "Copy UID"}
                    </button>
                  </div>
                  <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                    <span>
                      UID: <strong className="text-foreground font-mono">{user.uid}</strong>
                    </span>
                    <span className="text-emerald-400 font-bold tracking-wider">
                      {user.status || "active"}
                    </span>
                  </div>
                </div>
              ))}
              {usersList.length === 0 && (
                <div className="text-center text-xs text-muted-foreground italic py-4">
                  No registered users in index.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
