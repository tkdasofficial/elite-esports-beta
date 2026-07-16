import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export function CategoriesPanel({
  categories,
  addCategory,
  deleteCategory,
  showSuccess,
  showError,
}: {
  categories: string[];
  addCategory: (c: string) => void;
  deleteCategory: (c: string) => void;
  showSuccess: (m: string) => void;
  showError: (m: string) => void;
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategory.trim();
    if (!clean) return;

    if (categories.includes(clean)) {
      showError(`Category "${clean}" already exists.`);
      return;
    }

    addCategory(clean);
    showSuccess(`Category "${clean}" added successfully.`);
    setNewCategory("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <h2 className="font-display text-base font-black text-foreground">
        Match Categories Manager
      </h2>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. Clash Squad Tournaments"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-xl bg-brand px-4 py-2 font-display text-xs font-black tracking-wider text-brand-foreground shadow-lg shadow-brand/15"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="text-xs font-bold text-foreground tracking-wide">{cat}</span>

            {/* Protect general template categories or allow deletion */}
            <button
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to delete "${cat}"? This will affect tournaments categorised under it.`,
                  )
                ) {
                  deleteCategory(cat);
                  showSuccess(`Category "${cat}" removed.`);
                }
              }}
              className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              title="Delete Category"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground bg-card">
            No categories defined.
          </div>
        )}
      </div>
    </div>
  );
}
