import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, ShieldCheck, Database } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell hideTopBar>
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-surface-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-black tracking-wider">Privacy Policy</h1>
      </div>

      <div className="px-4 py-2 space-y-5 pb-24">
        {/* Intro */}
        <div className="rounded-2xl border border-border bg-gradient-to-r from-brand/10 to-transparent p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <Eye className="h-5 w-5 text-brand" />
            <h2 className="font-display text-base font-bold tracking-wide">Data Protection</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            At Elite eSports, we prioritize your data privacy. This policy outlines what information
            we collect, how it is managed, and your rights as a gamer. Last updated: July 2026.
          </p>
        </div>

        {/* Section 1 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              01
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">Information We Collect</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To coordinate scrim matches and transfer payouts, we collect your:
          </p>
          <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
            <li>In-Game Name (IGN) and gamer statistics</li>
            <li>In-game UID to set up custom game rooms</li>
            <li>Basic profile credentials (email, password)</li>
            <li>Financial account details strictly for verifying withdrawal history</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              02
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">How Your Data is Used</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Collected data is utilized strictly for tournament lobby placements, match history
            rankings, sending match reminder notifications, preventing fraudulent duplicate account
            access, and securing cash transfers. We do not sell gamer statistics or personal
            indicators to third-party advertisers.
          </p>
        </div>

        {/* Section 3 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              03
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">Secure Storage & 2FA</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Credentials and profile settings are stored with high-grade transport layer encryption
            (TLS). When enabling Two-Factor Authentication (2FA) via Authenticator Apps or Email
            OTP, seed hashes are salted and safely hashed.
          </p>
        </div>

        {/* Section 4 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              04
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">Your Privacy Rights</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Under international guidelines, you can request full extraction of your recorded
            tournament data or complete account deletion. Please contact support to initiate a
            profile purge.
          </p>
        </div>

        {/* Certification */}
        <div className="rounded-2xl border border-dashed border-border p-4 bg-surface-2/30 text-center">
          <ShieldCheck className="h-6 w-6 text-brand mx-auto mb-2" />
          <h4 className="font-display text-xs font-black tracking-wider text-muted-foreground">
            GDPR & Privacy Compliant
          </h4>
          <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Your telemetry and private identity is strictly locked to secure cloud storage.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
