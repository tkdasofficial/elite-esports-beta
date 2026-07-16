import { useState } from "react";
import { Plus, Trash2, Upload, Check, Image as ImageIcon } from "lucide-react";
import { useApp, AdminBanner } from "@/lib/app-state";

export function EsportsBannersPanel({
  showSuccess,
  showError,
}: {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}) {
  const { banners, addBanner, deleteBanner } = useApp();

  const [name, setName] = useState("");
  const [selectedBase64, setSelectedBase64] = useState("");
  const [selectedPresetUrl, setSelectedPresetUrl] = useState("");

  const presetArtworkList = [
    {
      name: "Cyber Crimson Arena",
      url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Bermuda Tech HUD",
      url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Neon Kalahari Sunset",
      url: "https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Tactical Red Zone",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setSelectedBase64(b64);
      setSelectedPresetUrl(""); // reset preset selection if file uploaded
      if (!name) {
        setName(file.name.split(".")[0]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: (typeof presetArtworkList)[0]) => {
    setSelectedPresetUrl(preset.url);
    setSelectedBase64(""); // reset uploaded file if preset selected
    setName(preset.name);
    showSuccess(`Selected graphic preset: "${preset.name}"`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = selectedPresetUrl || selectedBase64;
    if (!finalUrl) {
      showError("Please upload an image file or select an official preset artwork.");
      return;
    }

    const payload: AdminBanner = {
      id: "ban_" + Math.random().toString(36).substring(2, 9),
      name: name.trim() || "Esports Official Banner",
      url: finalUrl,
    };

    addBanner(payload);
    showSuccess(`Esports graphics banner "${payload.name}" loaded into sync database!`);

    // reset form
    setName("");
    setSelectedBase64("");
    setSelectedPresetUrl("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <h2 className="font-display text-xs font-black text-muted-foreground tracking-wider">
        Match Banners & Cover Graphics Hub
      </h2>

      {/* Upload/Creation Section */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Graphic Banner Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FFIC Semi-Final Poster Cover"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand"
              />
            </div>

            {/* Hidden File Input */}
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-widest text-muted-foreground block">
                Source Image File
              </span>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-brand/40 bg-background rounded-xl p-4 cursor-pointer transition-colors text-center">
                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-[10px] font-black tracking-wider text-foreground">
                  Choose Image File
                </span>
                <span className="text-[8px] text-muted-foreground font-semibold">
                  Any aspect ratio accepted (16:9 recommended)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedBase64 && (
                <div className="text-[9px] font-black text-emerald-400 mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> File ready: {name} (Custom Base64 Upload)
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Selection Cover */}
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-muted-foreground block">
              Or Choose Official Free Fire Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {presetArtworkList.map((preset) => {
                const isSelected = selectedPresetUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`rounded-xl border overflow-hidden text-left transition-all ${
                      isSelected
                        ? "border-brand ring-2 ring-brand/10 scale-[0.98]"
                        : "border-border hover:border-brand/30"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="h-16 w-full object-cover"
                    />
                    <div className="p-1.5 bg-surface text-[8px] font-black tracking-wider flex items-center justify-between">
                      <span className="truncate text-foreground max-w-[80px]">{preset.name}</span>
                      {isSelected && <Check className="h-3 w-3 text-brand" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand py-3 font-display text-xs font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98]"
        >
          Confirm & Load Banner Into Sync Database
        </button>
      </form>

      {/* Grid displaying current loaded graphics */}
      <div className="space-y-3">
        <h3 className="font-display text-xs font-black text-muted-foreground tracking-wider">
          Currently Synchronized Graphics ({banners.length})
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {banners.map((ban) => (
            <div
              key={ban.id}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm group relative"
            >
              <img
                src={ban.url}
                alt={ban.name}
                referrerPolicy="no-referrer"
                className="h-28 w-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => {
                    if (confirm(`Delete banner asset "${ban.name}"?`)) {
                      deleteBanner(ban.id);
                      showSuccess("Banner deleted from synchronization feed.");
                    }
                  }}
                  className="grid h-7 w-7 place-items-center rounded bg-destructive text-white shadow-md hover:bg-red-600 transition-colors"
                  title="Delete Banner"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3 bg-surface flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-brand shrink-0" />
                <span className="text-[10px] font-black tracking-wider text-foreground truncate">
                  {ban.name}
                </span>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground bg-card">
              No graphics banners loaded. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
