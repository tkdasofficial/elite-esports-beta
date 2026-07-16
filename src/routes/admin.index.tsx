import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

// Import modular sub-panels
import { DashboardPanel } from "@/admin/dashboard";
import { MatchesPanel } from "@/admin/matches";
import { UsersPanel } from "@/admin/users";
import { CategoriesPanel } from "@/admin/categories";
import { PaymentsPanel } from "@/admin/payments";
import { RulesTemplatesPanel } from "@/admin/rules";
import { BannersPanel } from "@/admin/banners";

export const Route = createFileRoute("/admin/")({
  component: AdminPanel,
});

type AdminTab = "dashboard" | "users" | "matches" | "categories" | "payments" | "rules" | "banners";

function AdminPanel() {
  const {
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    categories,
    addCategory,
    deleteCategory,
    rulesTemplates,
    addRulesTemplate,
    updateRulesTemplate,
    deleteRulesTemplate,
    banners,
    addBanner,
    deleteBanner,
    usersList,
    payUser,
    updateUserStatus,
    setSidebarOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  return (
    <AppShell hideTopBar hideBottomNav>
      <div className="min-h-screen bg-background text-foreground pb-24">
        {/* Admin Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 border border-brand/25 text-brand">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="font-display text-sm font-black tracking-wider text-foreground">
                Lobby Console
              </h1>
              <p className="text-[10px] tracking-widest text-brand font-bold">Lobby Console</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block rounded-full bg-brand/10 border border-brand/25 px-2 py-0.5 font-display text-[9px] font-bold tracking-widest text-brand animate-pulse">
              • Live Engine
            </span>
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-foreground hover:bg-surface transition-colors font-semibold"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Global Notifications */}
        {successMsg && (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Horizontal Nav Tabs */}
        <div className="scrollbar-hide flex gap-1.5 overflow-x-auto px-4 py-3 border-b border-border bg-card">
          {(
            [
              { k: "dashboard", l: "Dashboard", Icon: Shield },
              { k: "matches", l: "Matches", Icon: Shield },
              { k: "users", l: "Users", Icon: Shield },
              { k: "categories", l: "Categories", Icon: Shield },
              { k: "payments", l: "Payments", Icon: Shield },
              { k: "rules", l: "Rules Templates", Icon: Shield },
              { k: "banners", l: "Banners", Icon: Shield },
            ] as const
          ).map(({ k, l, Icon }) => {
            const active = activeTab === k;
            return (
              <button
                key={k}
                onClick={() => {
                  setActiveTab(k);
                  setSuccessMsg("");
                  setErrorMsg("");
                }}
                className={cn(
                  "flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-2 font-display text-xs font-black tracking-wider transition-all",
                  active
                    ? "bg-brand text-brand-foreground shadow-lg shadow-brand/15"
                    : "bg-surface-2 text-muted-foreground hover:bg-surface-3",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {l}
              </button>
            );
          })}
        </div>

        {/* Content Panels */}
        <main className="mt-4 px-4 space-y-4">
          {activeTab === "dashboard" && (
            <DashboardPanel
              tournaments={tournaments}
              users={usersList}
              categories={categories}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "matches" && (
            <MatchesPanel
              tournaments={tournaments}
              categories={categories}
              rulesTemplates={rulesTemplates}
              banners={banners}
              addTournament={addTournament}
              updateTournament={updateTournament}
              deleteTournament={deleteTournament}
              showSuccess={showSuccess}
              showError={showError}
            />
          )}
          {activeTab === "users" && (
            <UsersPanel
              users={usersList}
              payUser={payUser}
              updateUserStatus={updateUserStatus}
              showSuccess={showSuccess}
              showError={showError}
            />
          )}
          {activeTab === "categories" && (
            <CategoriesPanel
              categories={categories}
              addCategory={addCategory}
              deleteCategory={deleteCategory}
              showSuccess={showSuccess}
              showError={showError}
            />
          )}
          {activeTab === "payments" && (
            <PaymentsPanel showSuccess={showSuccess} showError={showError} />
          )}
          {activeTab === "rules" && (
            <RulesTemplatesPanel
              rulesTemplates={rulesTemplates}
              addRulesTemplate={addRulesTemplate}
              updateRulesTemplate={updateRulesTemplate}
              deleteRulesTemplate={deleteRulesTemplate}
              showSuccess={showSuccess}
              showError={showError}
            />
          )}
          {activeTab === "banners" && (
            <BannersPanel
              banners={banners}
              addBanner={addBanner}
              deleteBanner={deleteBanner}
              showSuccess={showSuccess}
              showError={showError}
            />
          )}
        </main>
      </div>
    </AppShell>
  );
}
