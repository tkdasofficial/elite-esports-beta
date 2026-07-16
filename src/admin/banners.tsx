import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { AdminBanner } from "@/lib/app-state";

export function BannersPanel({
  banners,
  addBanner,
  deleteBanner,
  showSuccess,
  showError,
}: {
  banners: AdminBanner[];
  addBanner: (b: AdminBanner) => void;
  deleteBanner: (id: string) => void;
  showSuccess: (m: string) => void;
  showError: (m: string) => void;
}) {
  const [name, setName] = useState("");
  const [selectedBase64, setSelectedBase64] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We can extract base64 from the uploaded asset file
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setSelectedBase64(b64);
      if (!name) {
        setName(file.name.split(".")[0]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBase64) {
      showError("Please upload/select an image file first.");
      return;
    }

    const payload: AdminBanner = {
      id: "ban_" + Math.random().toString(36).substring(2, 9),
      name: name.trim() || "Uploaded Banner",
      url: selectedBase64,
    };

    addBanner(payload);
    showSuccess(`Banner asset "${payload.name}" loaded into database!`);

    // reset
    setName("");
    setSelectedBase64("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <h2 className="font-display text-base font-black text-foreground">
        Match Banners & Graphics Hub
      </h2>

      {/* Upload/Creation Section */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Asset Graphic Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bermuda Map Cover Art"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
            />

            {/* Hidden File Input */}
            <div className="pt-1">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-brand/40 bg-background rounded-xl p-4 cursor-pointer transition-colors text-center">
                <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
                <span className="text-[10px] font-black tracking-wider text-foreground">
                  Choose Image File
                </span>
                <span className="text-[8px] text-muted-foreground font-semibold mt-0.5">
                  Any aspect ratio accepted (1:1 recommended)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-background rounded-xl border border-border p-3">
            <span className="text-[9px] font-black tracking-wider text-muted-foreground mb-2">
              Preview Panel
            </span>
            <div className="relative h-28 w-28 rounded-lg overflow-hidden border border-border bg-neutral-900">
              {selectedBase64 ? (
                <img
                  src={selectedBase64}
                  alt="Asset Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground text-center p-2 font-medium">
                  Select a file to preview graphic
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider shadow-lg shadow-brand/15 brand-glow"
        >
          Publish Graphic Asset
        </button>
      </form>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {banners.map((b) => (
          <div
            key={b.id}
            className="group relative rounded-2xl overflow-hidden border border-border bg-card p-2 flex flex-col gap-1.5"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-900 border border-border/40">
              <img src={b.url} alt={b.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex justify-between items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-bold text-foreground truncate flex-1">
                {b.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Purge banner asset "${b.name}" from library?`)) {
                    deleteBanner(b.id);
                    showSuccess(`Banner asset removed.`);
                  }
                }}
                className="grid h-6 w-6 place-items-center rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors shrink-0"
                title="Delete Graphic Asset"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
