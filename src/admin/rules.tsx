import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { AdminRulesTemplate } from "@/lib/app-state";

export function RulesTemplatesPanel({
  rulesTemplates,
  addRulesTemplate,
  updateRulesTemplate,
  deleteRulesTemplate,
  showSuccess,
  showError,
}: {
  rulesTemplates: AdminRulesTemplate[];
  addRulesTemplate: (t: AdminRulesTemplate) => void;
  updateRulesTemplate: (id: string, t: Partial<AdminRulesTemplate>) => void;
  deleteRulesTemplate: (id: string) => void;
  showSuccess: (m: string) => void;
  showError: (m: string) => void;
}) {
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
        <h2 className="font-display text-base font-black text-foreground">
          {view === "list" && "Rule Templates"}
          {view === "form" &&
            (editingId ? "Form: Edit Rule Template" : "Form: Create Rule Template")}
        </h2>
        {view === "list" ? (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 font-display text-xs font-black tracking-wider text-brand-foreground shadow-lg shadow-brand/15 transition-transform active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" /> New Template
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
          {rulesTemplates.map((rt) => (
            <div
              key={rt.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-md space-y-2"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-display text-sm font-black tracking-wide text-foreground">
                    {rt.name}
                  </h3>
                  <span className="text-[9px] text-muted-foreground font-semibold">
                    {rt.rules.length} core rules defined
                  </span>
                </div>

                <div className="flex gap-1.5">
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

              {/* Collapsible/Preview */}
              <ul className="text-[10px] list-disc list-inside text-muted-foreground/90 space-y-1 pl-1 max-h-24 overflow-y-auto border-t border-border/40 pt-2">
                {rt.rules.map((rule, idx) => (
                  <li key={idx} className="truncate">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {rulesTemplates.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground bg-card">
              No rule templates configured.
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xl"
        >
          {/* Template Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Template Policy Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Squad Classic Match Policy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
            />
          </div>

          {/* Rules TextArea */}
          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Rules (One rule per line)
            </label>
            <p className="text-[9px] text-muted-foreground">
              These will automatically populate the bullet list for any match choosing this
              template.
            </p>
            <textarea
              rows={12}
              placeholder="e.g. Emotes strictly not allowed.&#10;Hacking leads to immediate ban.&#10;Team up is prohibited."
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand font-medium leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider shadow-lg shadow-brand/15 brand-glow"
          >
            Save Template Policy
          </button>
        </form>
      )}
    </div>
  );
}
