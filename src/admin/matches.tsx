import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tournament, AdminRulesTemplate, AdminBanner } from "@/lib/app-state";

export function MatchesPanel({
  tournaments,
  categories,
  rulesTemplates,
  banners,
  addTournament,
  updateTournament,
  deleteTournament,
  showSuccess,
  showError,
}: {
  tournaments: Tournament[];
  categories: string[];
  rulesTemplates: AdminRulesTemplate[];
  banners: AdminBanner[];
  addTournament: (t: Tournament) => void;
  updateTournament: (id: string, t: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  showSuccess: (m: string) => void;
  showError: (m: string) => void;
}) {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("SOLO");
  const [map, setMap] = useState("BERMUDA");
  const [slotsTotal, setSlotsTotal] = useState(48);
  const [slotsFilled, setSlotsFilled] = useState(0);
  const [prize, setPrize] = useState(500);
  const [entry, setEntry] = useState(15);
  const [perKill, setPerKill] = useState<number | "">("");
  const [matchId, setMatchId] = useState("");
  const [dateTime, setDateTime] = useState("16 Jul • 05:30 PM");
  const [category, setCategory] = useState("");
  const [slotsSelectType, setSlotsSelectType] = useState<"AUTO" | "MANUAL">("AUTO");

  // Logo / Banner field (Base64 uploader is selectable)
  const [selectedBanner, setSelectedBanner] = useState("");
  const [logoEmoji, setLogoEmoji] = useState("T");

  // Prize Distribution Rows (Starts with 3 customizable ranks)
  const [distribution, setDistribution] = useState<{ rank: number; prize: number }[]>([
    { rank: 1, prize: 200 },
    { rank: 2, prize: 150 },
    { rank: 3, prize: 100 },
  ]);

  // Selected rules template
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [manualRules, setManualRules] = useState<string>("");

  const resetForm = () => {
    setTitle("");
    setMode("SOLO");
    setMap("BERMUDA");
    setSlotsTotal(48);
    setSlotsFilled(0);
    setPrize(500);
    setEntry(15);
    setPerKill("");
    setMatchId("");
    setDateTime(
      "Today • " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    );
    setCategory(categories[1] || categories[0] || "");
    setSlotsSelectType("AUTO");
    setSelectedBanner(banners[0]?.url || "");
    setLogoEmoji("T");
    setDistribution([
      { rank: 1, prize: 200 },
      { rank: 2, prize: 150 },
      { rank: 3, prize: 100 },
    ]);
    setSelectedTemplateId(rulesTemplates[0]?.id || "");
    setManualRules("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setMatchId("#FF" + Math.floor(10000 + Math.random() * 90000));
    setView("create");
  };

  const handleOpenEdit = (t: Tournament) => {
    setEditingId(t.id);
    setTitle(t.title);
    setMode(t.mode);
    setMap(t.map);
    setSlotsTotal(t.slotsTotal);
    setSlotsFilled(t.slotsFilled);
    setPrize(t.prize);
    setEntry(t.entry);
    setPerKill(t.perKill || "");
    setMatchId(t.matchId);
    setDateTime(t.dateTime);
    setCategory(t.category);
    setSlotsSelectType(t.slotsSelectType || "AUTO");
    setSelectedBanner(t.logoUrl || "");
    setLogoEmoji(t.logoEmoji || "T");
    setDistribution(t.distribution || []);
    setManualRules(t.rules ? t.rules.join("\n") : "");
    setView("edit");
  };

  const addDistributionRow = () => {
    const nextRank = distribution.length + 1;
    setDistribution([...distribution, { rank: nextRank, prize: 10 }]);
  };

  const removeDistributionRow = (idx: number) => {
    const next = distribution
      .filter((_, i) => i !== idx)
      .map((row, i) => ({
        ...row,
        rank: i + 1, // normalize ranks
      }));
    setDistribution(next);
  };

  const updateDistributionRow = (idx: number, amount: number) => {
    const next = [...distribution];
    next[idx].prize = amount;
    setDistribution(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      showError("Please enter a title and select a category.");
      return;
    }

    // Resolve rules array
    let resolvedRules: string[] = [];
    if (selectedTemplateId) {
      const template = rulesTemplates.find((rt) => rt.id === selectedTemplateId);
      if (template) resolvedRules = [...template.rules];
    } else if (manualRules.trim()) {
      resolvedRules = manualRules
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
    }

    const payload: Tournament = {
      id: view === "edit" ? editingId : "t_" + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      mode,
      map,
      slotsTotal: Number(slotsTotal),
      slotsFilled: Number(slotsFilled),
      prize: Number(prize),
      entry: Number(entry),
      perKill: perKill !== "" ? Number(perKill) : undefined,
      matchId,
      dateTime,
      category,
      status: "upcoming",
      distribution,
      rules: resolvedRules,
      logoEmoji,
      logoUrl: selectedBanner,
      slotsSelectType,
    };

    if (view === "create") {
      addTournament(payload);
      showSuccess(`Tournament "${title}" created successfully!`);
    } else {
      updateTournament(editingId, payload);
      showSuccess(`Tournament "${title}" updated successfully!`);
    }
    setView("list");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-black text-foreground">
          {view === "list" && "Tournament Registry"}
          {view === "create" && "Form: Craft New Match"}
          {view === "edit" && "Form: Modify Match"}
        </h2>
        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 font-display text-xs font-black tracking-wider text-brand-foreground shadow-lg shadow-brand/15 transition-transform active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" /> New Match
          </button>
        ) : (
          <button
            onClick={() => setView("list")}
            className="rounded-xl bg-surface-2 px-3.5 py-2 font-display text-xs font-black tracking-wider text-foreground hover:bg-surface-3 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {view === "list" ? (
        <div className="space-y-3">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-md"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="rounded bg-brand/10 border border-brand/20 px-1.5 py-0.5 text-[8px] font-bold text-brand">
                      {t.category}
                    </span>
                    <span className="rounded bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 text-[8px] font-mono text-neutral-300">
                      {t.matchId}
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-black tracking-wide text-foreground mt-1 truncate">
                    {t.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                    {t.dateTime} • {t.map} • {t.mode}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-foreground/80 hover:bg-surface-3 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete tournament "${t.title}"?`)) {
                        deleteTournament(t.id);
                        showSuccess("Tournament deleted successfully.");
                      }
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-2 mt-1 text-[11px] font-bold">
                <span className="text-brand">Entry: ₹{t.entry}</span>
                <span className="text-success">Prize Pool: ₹{t.prize}</span>
                <span className="text-muted-foreground">
                  Spots: {t.slotsFilled}/{t.slotsTotal}
                </span>
              </div>
            </div>
          ))}
          {tournaments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground bg-card">
              No tournaments in registry yet.
            </div>
          )}
        </div>
      ) : (
        /* Create/Edit Form */
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Tournament Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grand Master Squad Showdown"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Match Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Type (Mode) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Team Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              >
                <option value="SOLO">SOLO</option>
                <option value="DUO">DUO</option>
                <option value="SQUAD">SQUAD</option>
                <option value="CS MODE">CS MODE</option>
              </select>
            </div>

            {/* Map */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Battleground Map
              </label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              >
                <option value="BERMUDA">BERMUDA</option>
                <option value="PURGATORY">PURGATORY</option>
                <option value="KALAHARI">KALAHARI</option>
                <option value="ALPINE">ALPINE</option>
                <option value="CS-ARENA">CS-ARENA</option>
              </select>
            </div>

            {/* Slots Total */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Total Roster Slots
              </label>
              <input
                type="number"
                value={slotsTotal}
                onChange={(e) => setSlotsTotal(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>

            {/* Slots Select Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Slots Control Mode
              </label>
              <select
                value={slotsSelectType}
                onChange={(e) => setSlotsSelectType(e.target.value as "AUTO" | "MANUAL")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              >
                <option value="AUTO">AUTO (Fills automatically on user registrations)</option>
                <option value="MANUAL">MANUAL (Specify hard spots filled below)</option>
              </select>
            </div>

            {/* Slots Filled (conditional/manual override) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Slots Filled Override
              </label>
              <input
                type="number"
                value={slotsFilled}
                disabled={slotsSelectType === "AUTO" && view !== "edit"}
                onChange={(e) => setSlotsFilled(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand disabled:opacity-50"
              />
            </div>

            {/* Entry Fee (₹) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Entry Fee (₹)
              </label>
              <input
                type="number"
                value={entry}
                onChange={(e) => setEntry(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>

            {/* Prize Pool (₹) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Total Guaranteed Prize Pool (₹)
              </label>
              <input
                type="number"
                value={prize}
                onChange={(e) => setPrize(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>

            {/* Per Kill (₹) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Per Kill Payout (₹) (Optional)
              </label>
              <input
                type="number"
                placeholder="Leave empty for standard distribution"
                value={perKill}
                onChange={(e) => setPerKill(e.target.value !== "" ? Number(e.target.value) : "")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand font-bold"
              />
            </div>

            {/* Match Code */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Match Code (Generated/Override)
              </label>
              <input
                type="text"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand font-mono"
              />
            </div>

            {/* DateTime String */}
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Schedule String (Format: e.g. 15 Jul • 05:30 PM)
              </label>
              <input
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Logo / Emoji Indicator */}
          <div className="border-t border-border/60 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Choose Banner / Card Logo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {banners.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBanner(b.url)}
                    className={cn(
                      "relative rounded-lg overflow-hidden border-2 bg-neutral-900 aspect-square",
                      selectedBanner === b.url ? "border-brand" : "border-border",
                    )}
                  >
                    <img src={b.url} alt={b.name} className="h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[7px] truncate p-0.5 text-center block">
                      {b.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Fallback Emblem / Letter
              </label>
              <input
                type="text"
                maxLength={1}
                value={logoEmoji}
                onChange={(e) => setLogoEmoji(e.target.value)}
                className="w-16 rounded-xl border border-border bg-background px-3 py-2 text-center text-lg focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Rules Selection */}
          <div className="border-t border-border/60 pt-3 space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Match Rules Policy
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground block">Choose Template:</span>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    if (e.target.value !== "") setManualRules("");
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                >
                  <option value="">-- Manual/Plain Text Rules --</option>
                  {rulesTemplates.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedTemplateId && (
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground block">
                    Write Custom Rules (One rule per line):
                  </span>
                  <textarea
                    rows={4}
                    placeholder="Enter custom match bullet-point rules here..."
                    value={manualRules}
                    onChange={(e) => setManualRules(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-brand"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Prize Distribution (Interactive rows) */}
          <div className="border-t border-border/60 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground">
                Prize Money Distribution Hierarchy
              </label>
              <button
                type="button"
                onClick={addDistributionRow}
                className="flex items-center gap-1 text-[9px] font-black tracking-wider text-brand hover:underline"
              >
                <Plus className="h-3 w-3" /> Add Rank Row
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {distribution.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl p-2"
                >
                  <span className="font-display text-xs font-bold shrink-0 w-16 text-muted-foreground">
                    Rank {row.rank}:
                  </span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      value={row.prize}
                      onChange={(e) => updateDistributionRow(idx, Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background pl-6 pr-2 py-1 text-xs text-foreground focus:outline-none focus:border-brand"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDistributionRow(idx)}
                    className="grid h-7 w-7 place-items-center rounded bg-destructive/10 text-destructive shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-border/60 pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setView("list")}
              className="flex-1 py-3 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-bold tracking-wider text-foreground"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider shadow-lg shadow-brand/15 brand-glow"
            >
              Save Tournament
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
