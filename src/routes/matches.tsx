import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { TournamentCard } from "@/components/tournament-card";
import { useApp } from "@/lib/app-state";
import { MY_MATCHES } from "@/lib/tournament-data";
import type { Tournament } from "@/lib/tournament-data";
import { cn } from "@/lib/utils";
import { PartyPopper, Trophy } from "lucide-react";

export const Route = createFileRoute("/matches")({
  component: MatchesPage,
});

type Tab = "upcoming" | "live" | "played";

function MatchesPage() {
  const { joinedTournaments, tournaments } = useApp();
  const [tab, setTab] = useState<Tab>("upcoming");

  // Helper to determine the status of pre-joined and joined tournaments
  const getTournamentStatus = (id: string): "upcoming" | "live" | "played" => {
    const myMatch = MY_MATCHES.find((m) => m.id === id);
    if (myMatch && myMatch.status) return myMatch.status;
    return "upcoming";
  };

  // Merge static matches and dynamically joined tournaments
  const allMyMatches: Tournament[] = [];

  // Add all dynamically joined tournaments with correct status and dynamic slots calculation
  joinedTournaments.forEach((id) => {
    const baseT = tournaments.find((x) => x.id === id);
    if (baseT) {
      const addedSlot = !MY_MATCHES.some((m) => m.id === baseT.id) ? 1 : 0;
      allMyMatches.push({
        ...baseT,
        slotsFilled: baseT.slotsFilled + addedSlot,
        status: getTournamentStatus(baseT.id),
      });
    }
  });

  // Add played matches from MY_MATCHES to keep the mock played history
  MY_MATCHES.forEach((m) => {
    if (m.status === "played") {
      if (!allMyMatches.some((x) => x.id === m.id)) {
        allMyMatches.push(m);
      }
    }
  });

  const list = allMyMatches.filter((m) => m.status === tab);

  return (
    <AppShell>
      <div className="mx-4 mt-2 grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
        {(["upcoming", "live", "played"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-lg py-2 font-display text-xs font-bold tracking-wider transition-all",
              tab === t ? "bg-brand text-brand-foreground brand-glow" : "text-muted-foreground",
            )}
          >
            {t === "live" && (
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  tab === "live" ? "bg-white" : "bg-brand pulse-live",
                )}
              />
            )}
            {t === "upcoming" ? "Upcoming" : t === "live" ? "Live" : "Played"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-4">
        {list.map((m) => (
          <div key={m.id} className="relative">
            {m.status === "played" && (
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold tracking-widest text-gold ring-1 ring-gold/40">
                <Trophy className="h-2.5 w-2.5" />
                Winners
              </div>
            )}
            {m.status === "live" && (
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-brand/20 px-2 py-0.5 text-[9px] font-bold tracking-widest text-brand ring-1 ring-brand/40">
                <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-live" />
                Live
              </div>
            )}
            <TournamentCard t={m} />
            {m.status === "played" && (m.wonAmount ?? 0) > 0 && (
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-success">
                <PartyPopper className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  You won ₹{m.wonAmount} (Position #{m.position})
                </span>
              </div>
            )}
          </div>
        ))}
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            No {tab} matches.
          </div>
        )}
      </div>
    </AppShell>
  );
}
