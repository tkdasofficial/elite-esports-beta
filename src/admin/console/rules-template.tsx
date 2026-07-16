import { useState } from "react";
import { Plus, Trash2, Edit, Save, BookOpen, AlertCircle } from "lucide-react";
import { useApp, AdminRulesTemplate } from "@/lib/app-state";

export function EsportsRulesPanel({
  showSuccess,
  showError,
}: {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}) {
  const { rulesTemplates, addRulesTemplate, updateRulesTemplate, deleteRulesTemplate } = useApp();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState("");
  const [name, setName] = useState("");
  const [rulesText, setRulesText] = useState("");

  const handleOpenCreate = () => {
    setName("");
    setRulesText("");
    setEditingId("");
    setView("form");
  };

  const handleOpenEdit = (rt: AdminRulesTemplate) => {
    setName(rt.name);
    setRulesText(rt.rules.join("\n"));
    setEditingId(rt.id);
    setView("form");
  };

  const loadPreset = (presetType: "ffic" | "scrims" | "general") => {
    if (presetType === "ffic") {
      setName("FFIC Official Tournament Rulebook");
      setRulesText(
        [
          "Mobile-Only: Emulators and tablets are strictly prohibited. Handcam checks may be enforced.",
          "Point-Calc: Placement point criteria: 1st=12pts, 2nd=9pts, 3rd=8pts, 4th=7pts, 5th=6pts, 6th=5pts, 7th=4pts, 8th=3pts, 9th=2pts, 10th=1pt.",
          "Kill-Points: 1 point awarded per verified opponent elimination.",
          "Cheating & Scripting: Any usage of scripts, aim-assist, visual bugs, or third-party overlays will lead to an immediate ban.",
          "Disconnects: Rematches are only scheduled if more than 3 teams disconnect simultaneously before the first zone shrinks.",
        ].join("\n"),
      );
    } else if (presetType === "scrims") {
      setName("Pro Scrims Operational Regulations");
      setRulesText(
        [
          "Time Strictness: Teams must enter the custom lobby room at least 10 minutes before the scheduled kickoff.",
          "Security Passkey: Team captains must never share the custom lobby passkey outside of their registered roster.",
          "Substitute Rules: Sub entries (Player 5) are allowed only if requested in writing 30 minutes before kickoff.",
          "Teaming Prohibition: Cross-teaming or pre-arranged landing agreements will cause instant tournament bans and point forfeiture.",
        ].join("\n"),
      );
    } else {
      setName("General Competitive Guidelines");
      setRulesText(
        [
          "All players must show sportsmanlike behavior. Offensive chat or taunting leads to slot suspensions.",
          "Devices must run verified anti-cheat versions of the official client application.",
          "Internet or high-ping issues are the sole responsibility of the individual competitor/team.",
        ].join("\n"),
      );
    }
    showSuccess("Standard tournament rule presets populated successfully.");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Please specify a template name.");
      return;
    }

    const rules = rulesText
      .split("\n")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    const payload: AdminRulesTemplate = {
      id: editingId || "rt_" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      rules,
    };

    if (editingId) {
      updateRulesTemplate(editingId, payload);
      showSuccess(`Template "${name}" updated successfully!`);
    } else {
      addRulesTemplate(payload);
      showSuccess(`Template "${name}" created successfully!`);
    }
    setView("list");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-black text-muted-foreground tracking-wider">
          {view === "list" && `Competitive Rule Templates (${rulesTemplates.length})`}
          {view === "form" && (editingId ? "Form: Edit Rule Template" : "Form: New Rule Template")}
        </h2>
        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 font-display text-[10px] font-black tracking-wider text-brand-foreground shadow"
          >
            <Plus className="h-3.5 w-3.5" /> New Template
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rulesTemplates.map((rt) => (
            <div
              key={rt.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-brand" />
                    <h3 className="font-display text-xs font-black text-foreground">{rt.name}</h3>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(rt)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-foreground/80 hover:bg-surface-3 transition-colors"
                      title="Edit Template"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete rule template "${rt.name}"?`)) {
                          deleteRulesTemplate(rt.id);
                          showSuccess("Rule template deleted.");
                        }
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Delete Template"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside bg-surface p-3 rounded-xl border border-border/40">
                  {rt.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {rule}
                    </li>
                  ))}
                  {rt.rules.length === 0 && (
                    <span className="italic text-muted-foreground/50">No rules specified.</span>
                  )}
                </ul>
              </div>
            </div>
          ))}
          {rulesTemplates.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground bg-card">
              No rule templates listed. Create one above to establish Scrim regulatory profiles!
            </div>
          )}
        </div>
      ) : (
        /* Form Creation/Edit */
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl max-w-xl mx-auto"
        >
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Load Official Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loadPreset("ffic")}
                className="py-1.5 rounded-lg bg-surface-2 text-[9px] font-black tracking-wider text-brand border border-brand/20 hover:bg-surface-3"
              >
                FFIC Rulebook
              </button>
              <button
                type="button"
                onClick={() => loadPreset("scrims")}
                className="py-1.5 rounded-lg bg-surface-2 text-[9px] font-black tracking-wider text-brand border border-brand/20 hover:bg-surface-3"
              >
                Pro Scrims Setup
              </button>
              <button
                type="button"
                onClick={() => loadPreset("general")}
                className="py-1.5 rounded-lg bg-surface-2 text-[9px] font-black tracking-wider text-brand border border-brand/20 hover:bg-surface-3"
              >
                General Standard
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Template Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FFIC Season 4 Official Standards"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Rule List statements (One per line) *
              </label>
              <span className="text-[9px] text-muted-foreground font-semibold">
                Separate with Enter key
              </span>
            </div>
            <textarea
              required
              rows={8}
              placeholder="Write rules here...&#10;Rule #1: Emulator play forbidden&#10;Rule #2: Standard Zone-1 landing restrictions"
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-3.5 font-display text-xs font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98]"
          >
            {editingId ? "Save Changes" : "Register Rule Template"}
          </button>
        </form>
      )}
    </div>
  );
}
