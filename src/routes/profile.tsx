import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  User,
  Save,
  LogOut,
  ShieldCheck,
  Mail,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { ign, setIgn, uid, setUid, user, logout } = useApp();
  const [tempIgn, setTempIgn] = useState(ign);
  const [tempUid, setTempUid] = useState(uid);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (tempIgn.trim() && tempUid.trim()) {
      setIgn(tempIgn.trim());
      setUid(tempUid.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <AppShell hideTopBar>
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-surface-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-black tracking-wider">Profile</h1>
      </div>

      <div className="px-4 py-2">
        {/* Active Profile Info */}
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <div className="relative mx-auto h-24 w-24">
            <div className="grid h-24 w-24 place-items-center rounded-3xl border-3 border-brand bg-background font-display text-5xl font-black text-brand overflow-hidden brand-glow">
              {ign.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="mt-4 font-display text-lg font-black tracking-wide">{ign}</h2>

          {/* Copyable UID */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-2 px-3.5 py-2.5">
            <div className="text-left">
              <span className="block text-[8px] tracking-widest font-black text-muted-foreground">
                Free Fire UID
              </span>
              <strong className="font-mono text-xs text-foreground tracking-wider">{uid}</strong>
            </div>
            <button
              onClick={handleCopyUid}
              className="grid h-8 w-8 place-items-center rounded-lg bg-background text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors"
              title="Copy UID"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Edit In-Game Name & UID Form */}
        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-xs font-black tracking-wider text-muted-foreground mb-3">
            Gamer Identity Setup
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                In-Game Name (IGN)
              </label>
              <input
                type="text"
                value={tempIgn}
                onChange={(e) => setTempIgn(e.target.value)}
                placeholder="Enter new IGN"
                className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm font-bold text-foreground outline-none focus:border-brand transition-colors"
                maxLength={18}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                Free Fire Player UID
              </label>
              <input
                type="text"
                value={tempUid}
                onChange={(e) => setTempUid(e.target.value)}
                placeholder="e.g. 52841092"
                className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm font-bold text-foreground outline-none focus:border-brand transition-colors"
                maxLength={15}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={
                !tempIgn.trim() ||
                !tempUid.trim() ||
                (tempIgn.trim() === ign && tempUid.trim() === uid)
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-display text-sm font-black tracking-wider text-brand-foreground brand-glow disabled:opacity-40 transition-all active:scale-[0.98]"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" /> Updated Successfully!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Identity
                </>
              )}
            </button>
          </div>
        </div>

        {/* KYC Verification Info */}
        {user && user.legalName && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="h-4.5 w-4.5 text-success" />
              <h3 className="font-display text-xs font-black tracking-wider text-success">
                Verified Account KYC Details
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground text-[10px] font-black">Legal Name</span>
                <span className="font-bold text-foreground text-right">{user.legalName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground text-[10px] font-black">Date of Birth</span>
                <span className="font-mono font-bold text-foreground">{user.dob}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground text-[10px] font-black">
                  WhatsApp Linked
                </span>
                <span className="font-mono font-bold text-foreground">{user.phone}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-[10px] font-black">
                  Registered Address
                </span>
                <span className="font-bold text-foreground text-left bg-surface-2 p-2.5 rounded-xl border border-border leading-relaxed text-[11px]">
                  {user.address}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Match statistics summary */}
        <div className="mt-5 rounded-2xl border border-dashed border-border p-4 bg-surface-2/30 text-center">
          <h4 className="font-display text-xs font-black tracking-wider text-muted-foreground flex items-center justify-center gap-1.5">
            <User className="h-3.5 w-3.5 text-brand" /> Gamer Credentials
          </h4>
          <p className="mt-1.5 text-[10px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Your identity card is used across all official Free Fire eSports matches, custom scrim
            rooms, and community leaderboards. Roster slots are locked to this credentials card.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
