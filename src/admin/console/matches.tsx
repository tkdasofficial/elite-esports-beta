import { useState } from "react";
import {
  Calendar,
  Edit,
  Trash2,
  Plus,
  Check,
  Copy,
  Layers,
  Trophy,
  Users,
  Search,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Map,
  X,
  Sparkles,
} from "lucide-react";
import { useApp, EsportsMatch } from "@/lib/app-state";

export function EsportsMatchesPanel({
  showSuccess,
  showError,
}: {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}) {
  const { esportsMatches, esportsTeams, addEsportsMatch, updateEsportsMatch, deleteEsportsMatch } =
    useApp();

  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [matchId, setMatchId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [mapName, setMapName] = useState("BERMUDA");
  const [prize, setPrize] = useState(0);
  const [customRoomId, setCustomRoomId] = useState("");
  const [customRoomPassword, setCustomRoomPassword] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [teamSearch, setTeamSearch] = useState("");

  const resetForm = () => {
    setTitle("");
    setMatchId("");
    setDateTime(
      "Today • " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    );
    setMapName("BERMUDA");
    setPrize(0);
    setCustomRoomId("");
    setCustomRoomPassword("");
    setSelectedTeams([]);
    setTeamSearch("");
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
    setMapName(m.map);
    setPrize(m.prize);
    setCustomRoomId(m.customRoomId || "");
    setCustomRoomPassword(m.customRoomPassword || "");
    setSelectedTeams(m.teams || []);
    setTeamSearch("");
    setView("edit");
  };

  const toggleTeamSelection = (tName: string) => {
    setSelectedTeams((prev) =>
      prev.includes(tName) ? prev.filter((n) => n !== tName) : [...prev, tName],
    );
  };

  const handleSelectAllTeams = () => {
    const allNames = esportsTeams.map((t) => t.name);
    setSelectedTeams(allNames);
    showSuccess("All registered teams selected.");
  };

  const handleClearAllTeams = () => {
    setSelectedTeams([]);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showSuccess("Copied successfully!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = (matchId: string, newStatus: "upcoming" | "ongoing" | "completed") => {
    updateEsportsMatch(matchId, { status: newStatus });
    showSuccess(`Match status set to ${newStatus.toUpperCase()}`);
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
      map: mapName,
      prize: Number(prize),
      slotsBooked: `${selectedTeams.length} / ${esportsTeams.length || 12} Teams`,
      teams: selectedTeams,
      status:
        view === "edit"
          ? esportsMatches.find((m) => m.id === editingId)?.status || "upcoming"
          : "upcoming",
      type: "FFIC Official Scrims",
      customRoomId: customRoomId.trim() || undefined,
      customRoomPassword: customRoomPassword.trim() || undefined,
    };

    if (view === "create") {
      addEsportsMatch(payload);
      showSuccess(`Esports match scheduled successfully.`);
    } else {
      updateEsportsMatch(editingId, payload);
      showSuccess(`Match settings and credentials updated.`);
    }
    setView("list");
  };

  // Maps theme settings
  const getMapTheme = (name: string) => {
    const m = name.toUpperCase();
    if (m === "BERMUDA") {
      return {
        border: "border-emerald-500/20 hover:border-emerald-500/40",
        badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        pill: "bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/90 text-[10px]",
        glow: "shadow-emerald-950/20",
        label: "Bermuda",
      };
    }
    if (m === "PURGATORY") {
      return {
        border: "border-rose-500/20 hover:border-rose-500/40",
        badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        pill: "bg-rose-500/5 border border-rose-500/10 text-rose-400/90 text-[10px]",
        glow: "shadow-rose-950/20",
        label: "Purgatory",
      };
    }
    if (m === "KALAHARI") {
      return {
        border: "border-amber-500/20 hover:border-amber-500/40",
        badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        pill: "bg-amber-500/5 border border-amber-500/10 text-amber-400/90 text-[10px]",
        glow: "shadow-amber-950/20",
        label: "Kalahari",
      };
    }
    if (m === "ALPINE") {
      return {
        border: "border-cyan-500/20 hover:border-cyan-500/40",
        badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
        pill: "bg-cyan-500/5 border border-cyan-500/10 text-cyan-400/90 text-[10px]",
        glow: "shadow-cyan-950/20",
        label: "Alpine",
      };
    }
    return {
      border: "border-violet-500/20 hover:border-violet-500/40",
      badge: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
      pill: "bg-violet-500/5 border border-violet-500/10 text-violet-400/90 text-[10px]",
      glow: "shadow-violet-950/20",
      label: "Nexterra",
    };
  };

  const filteredTeams = esportsTeams.filter((t) =>
    t.name.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Tab Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-black text-foreground tracking-wide flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand" />
            {view === "list" && "Tournament Schedules"}
            {view === "create" && "Form: Schedule Official Match"}
            {view === "edit" && "Form: Edit Scrim Settings"}
          </h2>
          <p className="text-[10px] text-muted-foreground tracking-widest font-bold mt-0.5">
            {view === "list" &&
              `Manage scheduled lobbies & pushing real-time keys (${esportsMatches.length})`}
            {view === "create" && "Register a new official round on automated server"}
            {view === "edit" && "Modify current parameters & live assignments"}
          </p>
        </div>

        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2 font-display text-[11px] font-black tracking-wider text-brand-foreground shadow-lg hover:shadow-brand/20 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" /> New Match
          </button>
        ) : (
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-1.5 rounded-xl bg-surface-2 px-4 py-2 text-[11px] font-black tracking-wider text-foreground hover:bg-surface-3 transition-colors active:scale-[0.98]"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
        )}
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {esportsMatches.map((m) => {
            const theme = getMapTheme(m.map);
            const status = m.status || "upcoming";

            return (
              <div
                key={m.id}
                className={`rounded-2xl border bg-card p-4 shadow-sm flex flex-col justify-between transition-all duration-300 ${theme.border} ${theme.glow}`}
              >
                {/* Card Top: Timing and Title */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                    <span className="text-[10px] font-black tracking-widest text-brand flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {m.dateTime}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] font-bold text-muted-foreground bg-surface px-2 py-0.5 rounded border border-border/40">
                        {m.matchId}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-black text-foreground leading-tight tracking-tight">
                        {m.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full ${theme.badge}`}
                        >
                          {theme.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5 text-brand" /> Prize Pool:{" "}
                          <span className="text-foreground font-black">₹{m.prize}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-surface-2 text-foreground/80 hover:bg-surface-3 border border-border/40 transition-colors"
                        title="Edit Match"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Cancel and delete match "${m.title}"?`)) {
                            deleteEsportsMatch(m.id);
                            showSuccess("Match deleted successfully.");
                          }
                        }}
                        className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors"
                        title="Delete Match"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status Direct Selector Controls */}
                  <div className="bg-surface/50 p-2 rounded-xl border border-border/30 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black tracking-wider text-muted-foreground pl-1">
                      Status Panel:
                    </span>
                    <div className="flex bg-background rounded-lg p-0.5 border border-border/40 shrink-0">
                      {(["upcoming", "ongoing", "completed"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(m.id, st)}
                          type="button"
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider transition-all ${
                            status === st
                              ? st === "ongoing"
                                ? "bg-emerald-500 text-white shadow-sm font-extrabold"
                                : st === "completed"
                                  ? "bg-neutral-700 text-neutral-100 shadow-sm"
                                  : "bg-brand text-brand-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {st === "ongoing" ? "LIVE" : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Room Credentials Military-tech box */}
                  <div className="rounded-xl border border-brand/25 bg-black/40 p-3 space-y-2 relative overflow-hidden brand-glow">
                    <div className="flex justify-between items-center border-b border-brand/10 pb-1.5">
                      <span className="text-[9px] text-brand font-black tracking-widest flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> SECURE LOBBY KEYS
                      </span>
                      {m.customRoomId && m.customRoomPassword && (
                        <button
                          onClick={() =>
                            handleCopyText(
                              `Room ID: ${m.customRoomId} | Pass: ${m.customRoomPassword}`,
                              `${m.id}-all`,
                            )
                          }
                          className="text-[9px] font-black tracking-wider text-brand hover:underline flex items-center gap-1"
                          type="button"
                        >
                          {copiedId === `${m.id}-all` ? (
                            "Copied All!"
                          ) : (
                            <>
                              <Copy className="h-2.5 w-2.5" /> Copy Both
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-0.5">
                        <span className="block text-[8px] text-muted-foreground font-black">
                          ROOM ID
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-foreground text-sm select-all">
                            {m.customRoomId || (
                              <span className="text-muted-foreground/30 font-semibold italic text-xs">
                                Pending
                              </span>
                            )}
                          </span>
                          {m.customRoomId && (
                            <button
                              onClick={() => handleCopyText(m.customRoomId!, `${m.id}-id`)}
                              className="text-muted-foreground hover:text-brand transition-colors"
                              type="button"
                            >
                              {copiedId === `${m.id}-id` ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="block text-[8px] text-muted-foreground font-black">
                          PASSWORD
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-foreground text-sm select-all">
                            {m.customRoomPassword || (
                              <span className="text-muted-foreground/30 font-semibold italic text-xs">
                                Pending
                              </span>
                            )}
                          </span>
                          {m.customRoomPassword && (
                            <button
                              onClick={() => handleCopyText(m.customRoomPassword!, `${m.id}-pass`)}
                              className="text-muted-foreground hover:text-brand transition-colors"
                              type="button"
                            >
                              {copiedId === `${m.id}-pass` ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned squads list */}
                <div className="mt-4 pt-3 border-t border-border/40 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-muted-foreground font-black tracking-wider flex items-center gap-1">
                      <Users className="h-3 w-3 text-brand" /> Registered Contenders (
                      {m.teams?.length || 0})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {m.teams?.map((t, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-lg transition-colors ${theme.pill}`}
                      >
                        {t}
                      </span>
                    ))}
                    {(!m.teams || m.teams.length === 0) && (
                      <span className="text-[10px] text-muted-foreground italic font-semibold py-1">
                        No team registered yet. Assign some below!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {esportsMatches.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border/60 py-16 text-center text-xs text-muted-foreground bg-card space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p className="font-bold tracking-wider">No scheduled matches</p>
              <p className="text-[10px] text-muted-foreground/80">
                Register eSports squads and click "New Match" above to schedule!
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Form for match creation/editing */
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xl max-w-xl mx-auto"
        >
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-wider text-muted-foreground block">
              Match Title / Series Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FFMIC Grand Scrims - Match 01"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand font-medium"
            />
          </div>

          {/* Code and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-wider text-muted-foreground block">
                Match Code (Unique ID)
              </label>
              <input
                type="text"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-wider text-muted-foreground block">
                Schedule Date & Time
              </label>
              <input
                type="text"
                placeholder="e.g. 16 Jul • 08:30 PM"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-medium"
              />
            </div>
          </div>

          {/* Map and Prize */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-wider text-muted-foreground block">
                Battleground Map
              </label>
              <select
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-medium"
              >
                <option value="BERMUDA">BERMUDA</option>
                <option value="PURGATORY">PURGATORY</option>
                <option value="KALAHARI">KALAHARI</option>
                <option value="ALPINE">ALPINE</option>
                <option value="NEXTERRA">NEXTERRA</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-wider text-muted-foreground block">
                Prize Pool Amount (₹)
              </label>
              <input
                type="number"
                value={prize}
                onChange={(e) => setPrize(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-bold"
              />
            </div>
          </div>

          {/* Active Room Credentials */}
          <div className="border-t border-border/50 pt-4 space-y-3">
            <label className="text-[10px] font-black tracking-widest text-brand block font-display">
              Lobby Room Access Credentials (FFIC Standard)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground">Custom Room ID</span>
                <input
                  type="text"
                  placeholder="e.g. 10449921"
                  value={customRoomId}
                  onChange={(e) => setCustomRoomId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono font-bold focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-muted-foreground">Custom Password</span>
                <input
                  type="text"
                  placeholder="e.g. 6677"
                  value={customRoomPassword}
                  onChange={(e) => setCustomRoomPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono font-bold focus:outline-none focus:border-brand"
                />
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              *Entering credentials will instantly dispatch live notifications to matching
              authenticated player portals for immediate auto-joining.
            </p>
          </div>

          {/* Competitor / Roster Assignment with Search */}
          <div className="border-t border-border/50 pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-[10px] font-black tracking-wider text-muted-foreground">
                Assign Contenders / Registered Squads ({selectedTeams.length} Selected)
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllTeams}
                  className="text-[9px] font-black tracking-wider text-brand hover:underline"
                >
                  Select All
                </button>
                <span className="text-muted-foreground/30 text-[10px]">|</span>
                <button
                  type="button"
                  onClick={handleClearAllTeams}
                  className="text-[9px] font-black tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search registered squads..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 border border-border/40 rounded-xl p-2 bg-surface/30">
              {filteredTeams.map((t) => {
                const isSelected = selectedTeams.includes(t.name);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTeamSelection(t.name)}
                    className={`rounded-xl border p-2.5 text-left text-xs transition-all flex items-center justify-between active:scale-[0.98] ${
                      isSelected
                        ? "border-brand bg-brand/15 text-brand"
                        : "border-border/60 bg-surface-2/65 text-foreground hover:bg-surface-2"
                    }`}
                  >
                    <span className="font-bold truncate pr-1">{t.name}</span>
                    {isSelected && <Check className="h-3 w-3 shrink-0 text-brand" />}
                  </button>
                );
              })}
              {filteredTeams.length === 0 && (
                <div className="col-span-2 text-center text-xs text-muted-foreground py-4 font-semibold">
                  No matching squads available.
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-3.5 font-display text-xs font-black tracking-wider text-brand-foreground brand-glow hover:opacity-95 transition-all active:scale-[0.98]"
          >
            {view === "create" ? "Confirm & Launch Match Schedule" : "Save Modified Parameters"}
          </button>
        </form>
      )}
    </div>
  );
}
