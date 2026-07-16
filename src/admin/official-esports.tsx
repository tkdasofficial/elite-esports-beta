import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Shield,
  Users,
  Trophy,
  KeyRound,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Lock,
  Unlock,
  Hash,
  Copy,
  Check,
  Calculator,
  PlusCircle,
  Eye,
  LayoutDashboard,
  BookOpen,
  Image as ImageIcon,
  Minus,
  Share2,
  Crown,
  Award,
  HelpCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp, EsportsTeam, EsportsMatch } from "@/lib/app-state";

import { EsportsDashboardPanel } from "./console/dashboard";
import { EsportsTeamsPanel } from "./console/teams";
import { EsportsMatchesPanel } from "./console/matches";
import { EsportsRulesPanel } from "./console/rules-template";
import { EsportsBannersPanel } from "./console/banners";

type AdminSubTab = "dashboard" | "teams" | "matches" | "rules" | "banners" | "point-calc";

export function AdminEsportsPanel() {
  const navigate = useNavigate();
  const {
    esportsTeams,
    addEsportsTeam,
    updateEsportsTeam,
    deleteEsportsTeam,
    esportsMatches,
    addEsportsMatch,
    updateEsportsMatch,
    deleteEsportsMatch,
    setSidebarOpen,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>("dashboard");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedText, setCopiedText] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedText(txt);
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <AppShell hideTopBar hideBottomNav>
      <div className="min-h-screen bg-background text-foreground pb-24">
        {/* Admin Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate({ to: "/admin" })}
              className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-foreground font-bold"
            >
              ←
            </button>
            <div>
              <h1 className="font-display text-sm font-black tracking-wider text-foreground">
                eSports Console
              </h1>
              <p className="text-[10px] tracking-widest text-brand font-bold">
                FFIC & FFMIC Operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block rounded-full bg-brand/10 border border-brand/25 px-2 py-0.5 font-display text-[9px] font-bold tracking-widest text-brand">
              Pro Scrims Sync
            </span>
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-foreground hover:bg-surface transition-colors font-semibold"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Global Notifications */}
        {successMsg && (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 animate-in slide-in-from-top-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive animate-in slide-in-from-top-2">
            <Shield className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sub-navigation tabs */}
        <div className="border-b border-border bg-card px-4 py-2 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveSubTab("dashboard")}
              className={`px-4 py-2 rounded-lg font-display text-[11px] font-black tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === "dashboard"
                  ? "bg-brand text-brand-foreground shadow"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </button>
            <button
              onClick={() => setActiveSubTab("teams")}
              className={`px-4 py-2 rounded-lg font-display text-[11px] font-black tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === "teams"
                  ? "bg-brand text-brand-foreground shadow"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Manage Teams
            </button>
            <button
              onClick={() => setActiveSubTab("matches")}
              className={`px-4 py-2 rounded-lg font-display text-[11px] font-black tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === "matches"
                  ? "bg-brand text-brand-foreground shadow"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              }`}
            >
              <Trophy className="h-3.5 w-3.5" /> Manage Matches
            </button>
            <button
              onClick={() => setActiveSubTab("rules")}
              className={`px-4 py-2 rounded-lg font-display text-[11px] font-black tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === "rules"
                  ? "bg-brand text-brand-foreground shadow"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Rules
            </button>
            <button
              onClick={() => setActiveSubTab("banners")}
              className={`px-4 py-2 rounded-lg font-display text-[11px] font-black tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === "banners"
                  ? "bg-brand text-brand-foreground shadow"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" /> Banners
            </button>
            <button
              onClick={() => setActiveSubTab("point-calc")}
              className={`px-4 py-2 rounded-lg font-display text-[11px] font-black tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === "point-calc"
                  ? "bg-brand text-brand-foreground shadow"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              }`}
            >
              <Calculator className="h-3.5 w-3.5" /> Point Calculator
            </button>
          </div>
        </div>

        {/* Main Panel Content */}
        <main className="mt-4 px-4 space-y-4 max-w-4xl mx-auto">
          {activeSubTab === "dashboard" && <EsportsDashboardPanel />}

          {activeSubTab === "teams" && (
            <EsportsTeamsPanel showSuccess={showSuccess} showError={showError} />
          )}

          {activeSubTab === "matches" && (
            <EsportsMatchesPanel showSuccess={showSuccess} showError={showError} />
          )}

          {activeSubTab === "rules" && (
            <EsportsRulesPanel showSuccess={showSuccess} showError={showError} />
          )}

          {activeSubTab === "banners" && (
            <EsportsBannersPanel showSuccess={showSuccess} showError={showError} />
          )}

          {activeSubTab === "point-calc" && <PointCalculatorTab teams={esportsTeams} />}
        </main>
      </div>
    </AppShell>
  );
}

// ===================================================================
// 1. TEAMS MANAGEMENT COMPONENT
// ===================================================================
interface TeamsManagementProps {
  teams: EsportsTeam[];
  onAdd: (t: EsportsTeam) => void;
  onUpdate: (id: string, t: EsportsTeam) => void;
  onDelete: (id: string) => void;
  onCopy: (txt: string) => void;
  copiedText: string;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

function TeamsManagementTab({
  teams,
  onAdd,
  onUpdate,
  onDelete,
  onCopy,
  copiedText,
  showSuccess,
  showError,
}: TeamsManagementProps) {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [leader, setLeader] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");
  const [backup, setBackup] = useState("");
  const [passKey, setPassKey] = useState("");

  const resetForm = () => {
    setName("");
    setLeader("");
    setP1("");
    setP2("");
    setP3("");
    setP4("");
    setBackup("");
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

  const handleOpenCreate = () => {
    resetForm();
    generatePasskey();
    setView("create");
  };

  const handleOpenEdit = (t: EsportsTeam) => {
    setEditingId(t.id);
    setName(t.name);
    setLeader(t.leader);
    setP1(t.players[0] || "");
    setP2(t.players[1] || "");
    setP3(t.players[2] || "");
    setP4(t.players[3] || "");
    setBackup(t.backup || "");
    setPassKey(t.passKey);
    setView("edit");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !leader.trim()) {
      showError("Please specify a Team Name and Team Leader.");
      return;
    }

    const payload: EsportsTeam = {
      id: view === "edit" ? editingId : "et_" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      leader: leader.trim(),
      players: [p1.trim(), p2.trim(), p3.trim(), p4.trim()].filter(Boolean),
      backup: backup.trim(),
      passKey: passKey.trim() || "TEAM-GEN-8899",
    };

    if (view === "create") {
      onAdd(payload);
      showSuccess(`Esports Team "${payload.name}" registered successfully.`);
    } else {
      onUpdate(editingId, payload);
      showSuccess(`Esports Team "${payload.name}" configuration updated.`);
    }
    setView("list");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-black text-muted-foreground tracking-wider">
          {view === "list" && `Registered Teams (${teams.length})`}
          {view === "create" && "Form: Register Esports Team"}
          {view === "edit" && "Form: Update Team Configuration"}
        </h2>
        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 font-display text-[10px] font-black tracking-wider text-brand-foreground shadow"
          >
            <Plus className="h-3 w-3" /> Add Team
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
          {teams.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-sm font-black text-foreground leading-snug">
                    {t.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-bold mt-0.5">
                    Leader / Manager: <span className="text-brand">{t.leader}</span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-foreground/80 hover:bg-surface-3 transition-colors"
                    title="Edit Team"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Unregister and delete team "${t.name}"?`)) {
                        onDelete(t.id);
                        showSuccess("Team deleted successfully.");
                      }
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Delete Team"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Roster display */}
              <div className="bg-surface p-2.5 rounded-xl border border-border/40">
                <span className="block text-[8px] text-muted-foreground font-black tracking-wider mb-1.5">
                  Assigned Player Roster
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.players.map((p, idx) => (
                    <span
                      key={idx}
                      className="bg-background border border-border/50 text-[10px] font-semibold text-foreground px-2 py-0.5 rounded"
                    >
                      {p}
                    </span>
                  ))}
                  {t.backup && (
                    <span className="bg-brand/10 border border-brand/20 text-[10px] font-black text-brand px-2 py-0.5 rounded">
                      Substitute: {t.backup}
                    </span>
                  )}
                </div>
              </div>

              {/* Passkey block */}
              <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-brand" />
                  <span className="font-mono text-xs font-bold text-foreground select-all bg-surface px-2.5 py-1 rounded border border-border/60">
                    {t.passKey}
                  </span>
                </div>
                <button
                  onClick={() => onCopy(t.passKey)}
                  className="inline-flex items-center gap-1 text-[10px] tracking-wider font-black text-brand hover:underline"
                >
                  {copiedText === t.passKey ? (
                    <>
                      <Check className="h-3 w-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Key
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
          {teams.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground bg-card">
              No Esports teams have been registered. Add one above!
            </div>
          )}
        </div>
      ) : (
        /* Team Create or Edit Form */
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Team Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elite Squad Esports"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Team Manager / Leader IGN *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ShadowStrikeX"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
            />
          </div>

          <div className="border-t border-border/60 pt-3 space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Roster Players (At least 1 required)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Player 1 IGN"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              />
              <input
                type="text"
                placeholder="Player 2 IGN"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              />
              <input
                type="text"
                placeholder="Player 3 IGN"
                value={p3}
                onChange={(e) => setP3(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              />
              <input
                type="text"
                placeholder="Player 4 IGN"
                value={p4}
                onChange={(e) => setP4(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>
            <input
              type="text"
              placeholder="Roster Substitute (Backup Player IGN)"
              value={backup}
              onChange={(e) => setBackup(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand mt-1"
            />
          </div>

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
      )}
    </div>
  );
}

// ===================================================================
// 2. MATCHES MANAGEMENT COMPONENT
// ===================================================================
interface MatchesManagementProps {
  matches: EsportsMatch[];
  teams: EsportsTeam[];
  onAdd: (m: EsportsMatch) => void;
  onUpdate: (id: string, m: EsportsMatch) => void;
  onDelete: (id: string) => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

function MatchesManagementTab({
  matches,
  teams,
  onAdd,
  onUpdate,
  onDelete,
  showSuccess,
  showError,
}: {
  matches: EsportsMatch[];
  teams: EsportsTeam[];
  onAdd: (m: EsportsMatch) => void;
  onUpdate: (id: string, m: EsportsMatch) => void;
  onDelete: (id: string) => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}) {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [matchId, setMatchId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [map, setMap] = useState("BERMUDA");
  const [prize, setPrize] = useState(0);
  const [customRoomId, setCustomRoomId] = useState("");
  const [customRoomPassword, setCustomRoomPassword] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const resetForm = () => {
    setTitle("");
    setMatchId("");
    setDateTime(
      "Today • " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    );
    setMap("BERMUDA");
    setPrize(0);
    setCustomRoomId("");
    setCustomRoomPassword("");
    setSelectedTeams([]);
  };

  const handleOpenCreate = () => {
    resetForm();
    setMatchId("#OFF-" + Math.floor(1000 + Math.random() * 9000));
    setView("create");
  };

  const handleOpenEdit = (m: EsportsMatch) => {
    setEditingId(m.id);
    setTitle(m.title);
    setMatchId(m.matchId);
    setDateTime(m.dateTime);
    setMap(m.map);
    setPrize(m.prize);
    setCustomRoomId(m.customRoomId || "");
    setCustomRoomPassword(m.customRoomPassword || "");
    setSelectedTeams(m.teams);
    setView("edit");
  };

  const toggleTeamSelection = (tName: string) => {
    setSelectedTeams((prev) =>
      prev.includes(tName) ? prev.filter((n) => n !== tName) : [...prev, tName],
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showError("Please enter a Match Title.");
      return;
    }

    const payload: EsportsMatch = {
      id: view === "edit" ? editingId : "em_" + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      matchId: matchId.trim() || "#OFF-9999",
      dateTime: dateTime.trim() || "Live",
      map,
      prize: Number(prize),
      slotsBooked: `${selectedTeams.length} / ${teams.length || 12} Teams`,
      teams: selectedTeams,
      customRoomId: customRoomId.trim() || undefined,
      customRoomPassword: customRoomPassword.trim() || undefined,
    };

    if (view === "create") {
      onAdd(payload);
      showSuccess(`Esports match scheduled successfully.`);
    } else {
      onUpdate(editingId, payload);
      showSuccess(`Match settings and credentials updated.`);
    }
    setView("list");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-black text-muted-foreground tracking-wider">
          {view === "list" && `Official Scheduled Matches (${matches.length})`}
          {view === "create" && "Form: New Esports Match"}
          {view === "edit" && "Form: Edit Esports Match"}
        </h2>
        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 font-display text-[10px] font-black tracking-wider text-brand-foreground shadow"
          >
            <Plus className="h-3 w-3" /> New Match
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
          {matches.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
            >
              <div className="bg-surface px-4 py-2 flex justify-between items-center border-b border-border/80">
                <span className="text-[10px] font-bold text-brand flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {m.dateTime}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">{m.matchId}</span>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-display text-sm font-black text-foreground leading-snug">
                      {m.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-bold mt-0.5">
                      MAP: <span className="text-foreground">{m.map}</span> • Prize Pool:{" "}
                      <span className="text-brand">₹{m.prize}</span>
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-foreground/80 hover:bg-surface-3 transition-colors"
                      title="Edit Match"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel and delete match "${m.title}"?`)) {
                          onDelete(m.id);
                          showSuccess("Match deleted successfully.");
                        }
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Delete Match"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Custom room credentials display */}
                <div className="rounded-xl border border-border bg-surface-2 p-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-[8px] text-muted-foreground font-black">
                      ROOM ID
                    </span>
                    <strong className="font-mono font-bold text-foreground">
                      {m.customRoomId || (
                        <span className="text-muted-foreground/30 font-semibold italic">
                          Not Set
                        </span>
                      )}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[8px] text-muted-foreground font-black">
                      ROOM PASSWORD
                    </span>
                    <strong className="font-mono font-bold text-foreground">
                      {m.customRoomPassword || (
                        <span className="text-muted-foreground/30 font-semibold italic">
                          Not Set
                        </span>
                      )}
                    </strong>
                  </div>
                </div>

                {/* Assigned teams list */}
                <div>
                  <span className="block text-[8px] text-muted-foreground font-black tracking-wider mb-1.5">
                    Assigned Competitors ({m.teams.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {m.teams.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-brand/10 border border-brand/20 text-[9px] font-bold text-brand px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                    {m.teams.length === 0 && (
                      <span className="text-[10px] text-muted-foreground italic font-semibold">
                        No teams assigned yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground bg-card">
              No eSports matches are scheduled. Register teams and add a match above!
            </div>
          )}
        </div>
      ) : (
        /* Match Create or Edit Form */
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Match Title / Series Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FFMIC scrims - Practice Session #2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Match Code (Generated)
              </label>
              <input
                type="text"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Schedule Time String
              </label>
              <input
                type="text"
                placeholder="e.g. 16 Jul • 08:30 PM"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Battleground Map
              </label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              >
                <option value="BERMUDA">BERMUDA</option>
                <option value="PURGATORY">PURGATORY</option>
                <option value="KALAHARI">KALAHARI</option>
                <option value="ALPINE">ALPINE</option>
                <option value="NEXTERRA">NEXTERRA</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Prize Pool (₹)
              </label>
              <input
                type="number"
                value={prize}
                onChange={(e) => setPrize(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Lobby credentials editing */}
          <div className="border-t border-border/60 pt-3 space-y-2">
            <label className="text-[10px] font-black tracking-widest text-brand block">
              Active Lobby Room Credentials (FFIC Protocol)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground">Custom Room ID</span>
                <input
                  type="text"
                  placeholder="e.g. 10449921"
                  value={customRoomId}
                  onChange={(e) => setCustomRoomId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground">Custom Password</span>
                <input
                  type="text"
                  placeholder="e.g. 6677"
                  value={customRoomPassword}
                  onChange={(e) => setCustomRoomPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
                />
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground">
              *Entering credentials will instantly push live notifications to matching authenticated
              squad portals in real-time.
            </p>
          </div>

          {/* Roster Assignment */}
          <div className="border-t border-border/60 pt-3 space-y-1.5">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Select Competitors / Registered Teams
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
              {teams.map((t) => {
                const isSelected = selectedTeams.includes(t.name);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTeamSelection(t.name)}
                    className={`rounded-xl border p-2 text-left text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border bg-surface-2 text-foreground"
                    }`}
                  >
                    <span className="font-semibold truncate">{t.name}</span>
                    {isSelected && <Check className="h-3 w-3 shrink-0 ml-1" />}
                  </button>
                );
              })}
              {teams.length === 0 && (
                <div className="col-span-2 text-center text-xs text-muted-foreground py-2 font-semibold">
                  No registered eSports teams available. Create one first!
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-3.5 font-display text-xs font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98]"
          >
            {view === "create" ? "Confirm & Schedule Match" : "Update Match Details"}
          </button>
        </form>
      )}
    </div>
  );
}

// ===================================================================
// 3. POINT CALCULATOR COMPONENT
// ===================================================================
interface CalculatorRow {
  teamName: string;
  rank: number;
  kills: number;
}

function PointCalculatorTab({ teams }: { teams: EsportsTeam[] }) {
  const [rows, setRows] = useState<CalculatorRow[]>([]);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [customTeamName, setCustomTeamName] = useState("");
  const [isCustomTeam, setIsCustomTeam] = useState(false);
  const [placementRank, setPlacementRank] = useState<number>(1);
  const [killsCount, setKillsCount] = useState<number>(0);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [copiedStandings, setCopiedStandings] = useState(false);

  const getPlacementPoints = (rank: number): number => {
    switch (rank) {
      case 1:
        return 12;
      case 2:
        return 9;
      case 3:
        return 8;
      case 4:
        return 7;
      case 5:
        return 6;
      case 6:
        return 5;
      case 7:
        return 4;
      case 8:
        return 3;
      case 9:
        return 2;
      case 10:
        return 1;
      default:
        return 0;
    }
  };

  const handleAddRow = () => {
    const finalTeamName = isCustomTeam ? customTeamName.trim() : selectedTeamName;
    if (!finalTeamName) return;

    if (rows.some((r) => r.teamName.toLowerCase() === finalTeamName.toLowerCase())) {
      alert("This team's stats have already been calculated below.");
      return;
    }

    setRows((prev) => [
      ...prev,
      {
        teamName: finalTeamName,
        rank: placementRank,
        kills: killsCount,
      },
    ]);

    setSelectedTeamName("");
    setCustomTeamName("");
    setPlacementRank(1);
    setKillsCount(0);
  };

  const handleRemoveRow = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => {
    if (confirm("Reset current point calculations? This action is permanent.")) {
      setRows([]);
    }
  };

  const handleCopyStandings = () => {
    if (rows.length === 0) return;
    const standingsText = sortedLeaderboard
      .map((row, i) => {
        const pPts = getPlacementPoints(row.rank);
        const total = pPts + row.kills;
        let prefix = `Rank #${i + 1}`;
        if (i === 0) prefix = "[1st]";
        else if (i === 1) prefix = "[2nd]";
        else if (i === 2) prefix = "[3rd]";
        return `${prefix} ${row.teamName.toUpperCase()} — Total: ${total} Pts (${pPts} Placement + ${row.kills} Kills)`;
      })
      .join("\n");

    const fullMessage = `Elite eSports Tournament Standings\n\n${standingsText}\n\nCalculated via FFIC Automated Engine.`;
    navigator.clipboard.writeText(fullMessage);
    setCopiedStandings(true);
    setTimeout(() => setCopiedStandings(false), 2000);
  };

  const sortedLeaderboard = [...rows].sort((a, b) => {
    const scoreA = getPlacementPoints(a.rank) + a.kills;
    const scoreB = getPlacementPoints(b.rank) + b.kills;
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    return b.kills - a.kills;
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-lg">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div>
          <h3 className="font-display text-sm font-black text-foreground flex items-center gap-1.5">
            <Calculator className="h-4.5 w-4.5 text-brand" /> FFIC / FFMIC Match Point Calculator
          </h3>
          <p className="text-[10px] text-muted-foreground tracking-widest font-bold mt-0.5">
            Automated leaderboard sorting engine & stand-alone compiler
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="text-[10px] font-bold text-brand hover:underline flex items-center gap-1"
            type="button"
          >
            <HelpCircle className="h-3.5 w-3.5" /> Point Rules
          </button>
          {rows.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] font-black text-destructive hover:underline"
              type="button"
            >
              Reset Standings
            </button>
          )}
        </div>
      </div>

      {/* Point Rules Cheat Sheet Box */}
      {showCheatSheet && (
        <div className="bg-surface/50 border border-brand/20 rounded-xl p-3.5 text-[11px] text-muted-foreground space-y-2 animate-in slide-in-from-top-2 duration-200">
          <p className="font-bold text-foreground tracking-wider text-[10px] text-brand">
            Official Free Fire Esports Point System (FFIC Standard):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              1st (Booyah): <strong className="text-foreground">12 Pts</strong>
            </div>
            <div>
              2nd: <strong className="text-foreground">9 Pts</strong>
            </div>
            <div>
              3rd: <strong className="text-foreground">8 Pts</strong>
            </div>
            <div>
              4th: <strong className="text-foreground">7 Pts</strong>
            </div>
            <div>
              5th: <strong className="text-foreground">6 Pts</strong>
            </div>
            <div>
              6th: <strong className="text-foreground">5 Pts</strong>
            </div>
            <div>
              7th: <strong className="text-foreground">4 Pts</strong>
            </div>
            <div>
              8th: <strong className="text-foreground">3 Pts</strong>
            </div>
            <div>
              9th: <strong className="text-foreground">2 Pts</strong>
            </div>
            <div>
              10th: <strong className="text-foreground">1 Pts</strong>
            </div>
            <div className="col-span-full border-t border-border/40 pt-1.5 text-brand font-bold text-[9px] tracking-wider">
              KILLS MULTIPLIER: 1 Pt per Kill
            </div>
          </div>
        </div>
      )}

      {/* Calculator Form Controls */}
      <div className="bg-surface p-4 rounded-xl border border-border/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-3">
          <span className="text-[10px] font-black tracking-wider text-muted-foreground">
            Squad Entry Parameters
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-brand">
            <input
              type="checkbox"
              checked={isCustomTeam}
              onChange={(e) => {
                setIsCustomTeam(e.target.checked);
                setSelectedTeamName("");
                setCustomTeamName("");
              }}
              className="rounded border-border text-brand focus:ring-brand h-3.5 w-3.5"
            />
            Guest / Custom Team Name
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select or Input Squad */}
          <div className="space-y-1 md:col-span-1">
            <span className="text-[9px] font-bold text-muted-foreground block">
              Choose Registered / Guest Squad
            </span>
            {isCustomTeam ? (
              <input
                type="text"
                placeholder="Type guest team name..."
                value={customTeamName}
                onChange={(e) => setCustomTeamName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-bold"
              />
            ) : (
              <select
                value={selectedTeamName}
                onChange={(e) => setSelectedTeamName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-bold"
              >
                <option value="">-- Choose Team --</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
                <option value="Team GodLike">Team GodLike</option>
                <option value="Soul Esports">Soul Esports</option>
                <option value="TX Esports">TX Esports</option>
                <option value="Revenant Esports">Revenant Esports</option>
                <option value="Blind Esports">Blind Esports</option>
              </select>
            )}
          </div>

          {/* Rank Placement */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-muted-foreground block">Placement Rank</span>
            <select
              value={placementRank}
              onChange={(e) => setPlacementRank(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-bold"
            >
              {[...Array(12)].map((_, idx) => {
                const rankNum = idx + 1;
                return (
                  <option key={rankNum} value={rankNum}>
                    Rank {rankNum} {rankNum === 1 ? "(Booyah!)" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Kills Incrementer */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-muted-foreground block">
              Kill Points (Steppers)
            </span>
            <div className="flex items-center gap-1 bg-background rounded-xl border border-border p-1">
              <button
                type="button"
                onClick={() => setKillsCount((prev) => Math.max(0, prev - 1))}
                className="grid h-7 w-8 place-items-center rounded-lg bg-surface-2 text-foreground/80 hover:bg-surface-3 transition-colors text-xs font-black"
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="number"
                min={0}
                value={killsCount}
                onChange={(e) => setKillsCount(Math.max(0, Number(e.target.value)))}
                className="w-full text-center border-0 bg-transparent py-0 px-1 text-xs font-black text-foreground focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={() => setKillsCount((prev) => prev + 1)}
                className="grid h-7 w-8 place-items-center rounded-lg bg-surface-2 text-foreground/80 hover:bg-surface-3 transition-colors text-xs font-black"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddRow}
          disabled={isCustomTeam ? !customTeamName.trim() : !selectedTeamName}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-xs font-black text-brand-foreground disabled:opacity-40 transition-all hover:opacity-95 active:scale-[0.98] shadow-md shadow-brand/10"
        >
          <PlusCircle className="h-4 w-4" /> Add Row to standings
        </button>
      </div>

      {/* Standings table area */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-display text-xs font-black text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Award className="h-4 w-4 text-brand" /> Live Standings Board (
            {sortedLeaderboard.length} Teams)
          </h4>

          {rows.length > 0 && (
            <button
              onClick={handleCopyStandings}
              className="text-[10px] font-black text-brand hover:underline flex items-center gap-1"
              type="button"
            >
              {copiedStandings ? (
                "Copied to clipboard!"
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" /> Share / Copy Text
                </>
              )}
            </button>
          )}
        </div>

        {sortedLeaderboard.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-xs text-muted-foreground bg-surface/10 space-y-2">
            <HelpCircle className="h-8 w-8 mx-auto text-muted-foreground/40" />
            <p className="font-bold tracking-wider">Standing Board Empty</p>
            <p className="text-[10px] text-muted-foreground/80">
              Calculate points above to compile the live tournament leaderboard.
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-background">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-[9px] text-muted-foreground font-black">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-2">Team Name</th>
                  <th className="py-3 px-2 text-center">Place Pts</th>
                  <th className="py-3 px-2 text-center">Kill Pts</th>
                  <th className="py-3 px-2 text-center text-brand">Total</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {sortedLeaderboard.map((row, idx) => {
                  const pPts = getPlacementPoints(row.rank);
                  const total = pPts + row.kills;
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-surface-2/40 transition-colors ${
                        idx === 0
                          ? "bg-brand/5 border-l-2 border-l-brand"
                          : idx === 1
                            ? "bg-emerald-500/[0.02] border-l-2 border-l-emerald-500/50"
                            : idx === 2
                              ? "bg-amber-500/[0.02] border-l-2 border-l-amber-500/50"
                              : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-display font-black text-xs">
                        {idx === 0 ? (
                          <span className="flex items-center gap-1 text-brand text-sm">
                            <Crown className="h-4 w-4 text-brand animate-bounce" /> #1
                          </span>
                        ) : idx === 1 ? (
                          <span className="text-emerald-400 text-xs font-extrabold">#2</span>
                        ) : idx === 2 ? (
                          <span className="text-amber-400 text-xs font-extrabold">#3</span>
                        ) : (
                          <span className="text-muted-foreground font-bold">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-3 px-2 font-black text-foreground truncate max-w-[140px] tracking-wide">
                        {row.teamName}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-foreground/80">
                        {pPts}{" "}
                        <span className="text-[9px] text-muted-foreground font-medium">
                          (Rank #{row.rank})
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-foreground/80">
                        {row.kills}
                      </td>
                      <td className="py-3 px-2 text-center font-display font-black text-foreground text-xs bg-brand/5 border-x border-border/10">
                        {total}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            const originalIndex = rows.findIndex(
                              (r) => r.teamName.toLowerCase() === row.teamName.toLowerCase(),
                            );
                            if (originalIndex !== -1) handleRemoveRow(originalIndex);
                          }}
                          className="text-destructive hover:underline font-bold text-[10px] tracking-wider"
                          type="button"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
