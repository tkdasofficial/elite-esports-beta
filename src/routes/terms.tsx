import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ScrollText, AlertTriangle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell hideTopBar>
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-surface-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-black tracking-wider">Terms of Service</h1>
      </div>

      <div className="px-4 py-2 space-y-5 pb-24">
        {/* Intro */}
        <div className="rounded-2xl border border-border bg-gradient-to-r from-brand/10 to-transparent p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <ScrollText className="h-5 w-5 text-brand" />
            <h2 className="font-display text-base font-bold tracking-wide">Elite Platform Rules</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Welcome to Elite eSports. By accessing or using our services, you agree to be bound by
            these Terms of Service. Please read them carefully. Last updated: July 2026.
          </p>
        </div>

        {/* Section 1 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              01
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">Eligibility & Account</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You must be at least 13 years of age to participate. Users under 18 must have
            parental/guardian consent. Only one account is permitted per player. Shared accounts,
            duplicate registrations, and multi-boxing are strictly prohibited and will lead to an
            immediate ban.
          </p>
        </div>

        {/* Section 2 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              02
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">Matchplay & Anti-Cheat</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Elite eSports maintains a zero-tolerance policy for hacking, modding, script injection,
            teaming, stream sniping, or utilizing game exploits. All tournament results must be
            supported by screenshots/screen recordings. Admin decisions are final and binding in all
            match disputes.
          </p>
          <div className="flex items-start gap-2 bg-destructive/10 text-destructive text-[11px] p-3 rounded-xl mt-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              Detected cheating or spoofing will result in immediate termination of the user profile
              and forfeiture of any accrued wallet balance.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              03
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">Wallet & Withdrawals</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All entry fees and tournament prize pools are listed in Indian Rupees (₹). Withdrawals
            are subjected to identity verification (KYC) to prevent money laundering. Real money
            deposits are non-refundable unless a tournament is explicitly cancelled by the
            organization.
          </p>
        </div>

        {/* Section 4 */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand/10 text-brand font-display text-[10px] font-black">
              04
            </span>
            <h3 className="font-display text-sm font-bold tracking-wide">
              Limitation of Liability
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We are not responsible for technical outages, server-side failures on third-party games,
            or platform disconnects that affect active matchplay. Players are responsible for
            ensuring stable internet connectivity.
          </p>
        </div>

        {/* Certification */}
        <div className="rounded-2xl border border-dashed border-border p-4 bg-surface-2/30 text-center">
          <ShieldCheck className="h-6 w-6 text-brand mx-auto mb-2" />
          <h4 className="font-display text-xs font-black tracking-wider text-muted-foreground">
            Fairplay Certification
          </h4>
          <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
            These guidelines are structured to maintain an authentic, competitive gaming
            environment.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
