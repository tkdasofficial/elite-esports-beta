import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  Settings,
  Shield,
  HeadphonesIcon,
  ScrollText,
  Eye,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

const items = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Lobby Console", icon: Shield },
  { to: "/admin/official-esports", label: "eSports Console", icon: Shield },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/private", label: "Official eSports", icon: Shield },
  { to: "/support", label: "Help & Support", icon: HeadphonesIcon },
  { to: "/terms", label: "Terms of Service", icon: ScrollText },
  { to: "/privacy", label: "Privacy Policy", icon: Eye },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen, ign, wallet, logout, user } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isAdmin = user?.role === "admin";

  const sidebarItems = items.filter((it) => {
    if (isAdmin) {
      return ["/admin", "/admin/official-esports", "/support", "/terms", "/privacy"].includes(
        it.to,
      );
    } else {
      return !["/admin", "/admin/official-esports"].includes(it.to);
    }
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[78%] max-w-sm flex flex-col h-full transform bg-surface shadow-2xl transition-transform duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-[env(safe-area-inset-top)] shrink-0" />

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pb-36 min-h-0">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand/20 via-background to-background p-5">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-foreground animate-pulse"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-brand bg-background font-display text-3xl font-black text-brand brand-glow">
                {ign ? ign.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-lg font-bold">
                  {ign || "AdminConsole"}
                </div>
              </div>
            </div>

            {isAdmin ? (
              <div className="mt-4 rounded-xl border border-border bg-brand/5 p-3 text-center">
                <div className="font-display text-xs font-black text-brand tracking-wider">
                  Console Administrator
                </div>
                <div className="text-[9px] tracking-wider text-muted-foreground mt-0.5">
                  {user?.email}
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat label="Wallet" value={`₹${wallet.toFixed(0)}`} />
                <Stat label="Wins" value="42" />
                <Stat label="Rank" value="#3" />
              </div>
            )}
          </div>

          <nav className="flex flex-col px-3 py-2">
            {sidebarItems.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-surface-2"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-brand">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{it.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Fixed Footer */}
        <div className="absolute inset-x-0 bottom-0 border-t border-border p-4 bg-surface z-10">
          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
              navigate({ to: "/login" });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-2 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">v1.0.0-alpha</div>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </aside>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-2 text-center">
      <div className="font-display text-base font-bold">{value}</div>
      <div className="text-[9px] tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

// silence unused imports for lucide User type
export const _User = User;
