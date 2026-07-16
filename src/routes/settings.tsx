import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Moon, Sun, Monitor, Bell, Shield, KeyRound, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { themeMode, setThemeMode, notifications, setNotifications, security, setSecurity, ign } =
    useApp();

  return (
    <AppShell hideTopBar>
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-surface-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-black tracking-wider">Settings</h1>
      </div>

      {/* Mini Profile card */}
      <Link
        to="/profile"
        className="mx-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-brand/40"
      >
        <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-brand bg-background font-display text-lg font-black text-brand brand-glow">
          {ign.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] tracking-widest text-muted-foreground">In-Game Name</div>
          <div className="truncate font-display text-lg font-bold">{ign}</div>
          <div className="text-[10px] font-semibold tracking-wider text-brand/90">
            Configure identity &rarr;
          </div>
        </div>
      </Link>

      {/* Theme selection */}
      <div className="mt-6">
        <div className="px-5 pb-2 text-[10px] font-bold tracking-widest text-muted-foreground">
          Appearance
        </div>
        <div className="mx-4 overflow-hidden rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-brand">
                {themeMode === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : themeMode === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
              </span>
              <div>
                <div className="font-display text-sm font-bold">Theme Mode</div>
                <div className="text-[11px] text-muted-foreground">
                  Choose your interface layout
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-surface-2 p-1 rounded-xl">
            {(["default", "light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setThemeMode(mode)}
                className={cn(
                  "py-2 text-xs font-bold capitalize rounded-lg transition-all",
                  themeMode === mode
                    ? "bg-brand text-brand-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode === "default" ? "Default" : mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <Section title="Notifications">
        <Row icon={Bell} label="My Matches Reminder" desc="Alert before active slots start">
          <Toggle
            on={notifications.matchesReminder}
            onChange={() => setNotifications({ matchesReminder: !notifications.matchesReminder })}
          />
        </Row>
        <Row icon={Bell} label="Updates" desc="Game announcements and news">
          <Toggle
            on={notifications.updates}
            onChange={() => setNotifications({ updates: !notifications.updates })}
          />
        </Row>
        <Row icon={Bell} label="Offers" desc="Event passes & exclusive content">
          <Toggle
            on={notifications.offers}
            onChange={() => setNotifications({ offers: !notifications.offers })}
          />
        </Row>
        <Row icon={Bell} label="Rewards" desc="Tournament payouts & bonuses">
          <Toggle
            on={notifications.rewards}
            onChange={() => setNotifications({ rewards: !notifications.rewards })}
          />
        </Row>
      </Section>

      {/* Two-Factor Authentication Section */}
      <Section title="Two-Factor Authentication (2FA)">
        <Row
          icon={Shield}
          label="Email OTP Verification"
          desc="Verify transfers via registered email"
        >
          <Toggle
            on={security.twoFactorEmail}
            onChange={() => setSecurity({ twoFactorEmail: !security.twoFactorEmail })}
          />
        </Row>
        <Row
          icon={Shield}
          label="Authenticator App"
          desc="Google Authenticator or Duo App security code"
        >
          <Toggle
            on={security.twoFactorAuthApp}
            onChange={() => setSecurity({ twoFactorAuthApp: !security.twoFactorAuthApp })}
          />
        </Row>
      </Section>

      {/* Simplified Reset Password Block */}
      <div className="mt-6">
        <div className="px-5 pb-2 text-[10px] font-bold tracking-widest text-muted-foreground">
          Privacy & Security
        </div>
        <div className="mx-4 rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-brand">
              <KeyRound className="h-4 w-4" />
            </span>
            <div>
              <div className="font-display text-sm font-bold">Account Security</div>
              <div className="text-[11px] text-muted-foreground">
                Manage and reset account credentials
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            If you have forgotten or need to refresh your account password, tap the button below to
            go to the password reset screen. An 8-digit secure verification OTP will be generated
            for your recovery.
          </p>

          <div className="pt-2">
            <Link
              to="/reset-password"
              onClick={() => {
                // Automatically generate and set the 8-digit OTP so it is ready on the reset screen
                const randomOtp = Math.floor(10000000 + Math.random() * 90000000).toString();
                localStorage.setItem("reset_password_otp", randomOtp);
              }}
              className="py-3.5 w-full text-xs font-black tracking-wider rounded-xl bg-brand hover:scale-[1.02] active:scale-[0.98] transition-all text-brand-foreground text-center flex items-center justify-center brand-glow"
            >
              Reset Password
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 pt-8 text-center text-[10px] text-muted-foreground">
        Elite eSports • v1.0.0-alpha
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="px-5 pb-2 text-[10px] font-bold tracking-widest text-muted-foreground">
        {title}
      </div>
      <div className="mx-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {children}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-display text-sm font-bold">{label}</div>
        {desc && <div className="text-[11px] text-muted-foreground">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        on ? "bg-brand" : "bg-neutral-800",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          on ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
