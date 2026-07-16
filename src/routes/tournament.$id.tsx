import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Users, Trophy, ScrollText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { TournamentCard } from "@/components/tournament-card";
import { PRIZE_DISTRIBUTION, PLAYERS, RULES, MY_MATCHES } from "@/lib/tournament-data";
import { cn } from "@/lib/utils";

import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/tournament/$id")({
  component: TournamentDetail,
});

type Tab = "prize" | "players" | "rules";

function TournamentDetail() {
  const { id } = useParams({ from: "/tournament/$id" });
  const { joinedTournaments, joinTournament, wallet, ign, uid, tournaments } = useApp();

  const [tab, setTab] = useState<Tab>("prize");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "confirm">("confirm");
  const [errorMessage, setErrorMessage] = useState("");

  // Map historical played IDs to their actual tournament IDs
  const resolvedId = id === "p1" ? "t1" : id === "p2" ? "t4" : id;
  const baseT = tournaments.find((x) => x.id === resolvedId) ?? tournaments[0];

  if (!baseT) {
    return (
      <AppShell hideTopBar hideBottomNav>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <h2 className="text-xl font-bold text-foreground">Tournament not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This tournament may have been deleted or does not exist.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 font-display text-sm font-black tracking-wider text-brand-foreground shadow-lg transition-all hover:opacity-90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const isJoined = joinedTournaments.includes(baseT.id);

  // Calculate dynamic slots filled
  const addedSlot = isJoined && !MY_MATCHES.some((m) => m.id === baseT.id) ? 1 : 0;
  const t = {
    ...baseT,
    slotsFilled: baseT.slotsFilled + addedSlot,
  };

  const handleJoinClick = () => {
    if (isJoined) return;
    setModalType("confirm");
    setShowModal(true);
  };

  const confirmJoin = () => {
    const res = joinTournament(t.id, t.title, t.matchId, t.entry);
    if (res.success) {
      setModalType("success");
    } else {
      setErrorMessage(res.error || "Failed to join tournament.");
      setModalType("error");
    }
  };

  return (
    <AppShell hideTopBar hideBottomNav>
      {/* Slim header */}
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-surface-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="rounded-full bg-surface-2 px-3 py-1 font-display text-[10px] font-bold tracking-widest text-muted-foreground">
          {t.matchId}
        </span>
      </div>

      {/* Reused match card */}
      <div className="px-4">
        <TournamentCard t={t} variant="detail" />
      </div>

      {/* Tabs — soft pill for active */}
      <div className="mx-4 mt-4 flex items-center gap-2">
        {(
          [
            { k: "prize", l: "Prize Pool", Icon: Trophy },
            { k: "players", l: "Players", Icon: Users },
            { k: "rules", l: "Rules", Icon: ScrollText },
          ] as const
        ).map(({ k, l, Icon }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 font-display text-xs font-black tracking-wider transition-all",
                active ? "bg-brand/12 text-brand" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
              {l}
            </button>
          );
        })}
      </div>

      <div className="mx-4 mt-3">
        {tab === "prize" && <PrizeList distribution={t.distribution} />}
        {tab === "players" && <PlayerList filled={t.slotsFilled} isJoined={isJoined} ign={ign} />}
        {tab === "rules" && <RulesList rules={t.rules} />}
      </div>

      {/* Sticky Join Footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3 p-3">
          <div className="rounded-xl bg-surface-2 px-3.5 py-2.5 font-display text-base font-black flex flex-col justify-center leading-none">
            <span className="text-[8px] text-muted-foreground tracking-widest mb-0.5">
              Entry Fee
            </span>
            ₹{t.entry}
          </div>
          <button
            onClick={handleJoinClick}
            disabled={t.slotsFilled >= t.slotsTotal && !isJoined}
            className={cn(
              "flex-1 rounded-xl py-3.5 font-display text-sm font-black tracking-wider text-brand-foreground transition-all duration-200",
              isJoined
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold tracking-wide shadow-none"
                : t.slotsFilled >= t.slotsTotal
                  ? "bg-neutral-800 text-muted-foreground cursor-not-allowed shadow-none"
                  : "bg-brand hover:scale-[1.01] active:scale-[0.98] brand-glow",
            )}
          >
            {isJoined
              ? "✓ Already Joined"
              : t.slotsFilled >= t.slotsTotal
                ? "Match Full"
                : "Join Now"}
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      {/* Modern Confirmation & Status Modals */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in zoom-in-95 duration-200 text-center space-y-4">
            {modalType === "confirm" && (
              <>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-black tracking-wide">
                    Confirm Registration
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    You are joining <span className="font-semibold text-foreground">{t.title}</span>
                    . Entry fee of <span className="font-semibold text-brand">₹{t.entry}</span> will
                    be deducted from your wallet.
                  </p>
                </div>

                {/* Roster / Gamer tag warning */}
                <div className="bg-surface-2 border border-border rounded-xl p-3 text-left space-y-1.5">
                  <span className="text-[8px] font-black tracking-widest text-muted-foreground block">
                    REGISTERING CREDENTIALS
                  </span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">IGN:</span>
                    <strong className="font-display font-bold text-foreground">{ign}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Free Fire UID:</span>
                    <strong className="font-mono text-foreground">{uid}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setShowModal(false)}
                    className="py-3 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-bold tracking-wider text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmJoin}
                    className="py-3 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider brand-glow"
                  >
                    Confirm Join
                  </button>
                </div>
              </>
            )}

            {modalType === "success" && (
              <>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <h4 className="font-display text-base font-black tracking-wide text-emerald-400">
                    Successfully Joined!
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    Your roster slot is successfully locked. We have debited ₹{t.entry} from your
                    balance.
                  </p>
                </div>

                {/* Ticket Details */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-left space-y-2">
                  <div className="flex justify-between items-center text-xs border-b border-emerald-500/10 pb-1.5">
                    <span className="text-[8px] font-black tracking-widest text-emerald-400">
                      ENTRY SLIP
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">
                      {t.matchId}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Player:</span>
                      <strong className="text-foreground">{ign}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UID:</span>
                      <strong className="font-mono text-foreground">{uid}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  The Room ID & Password will be shared 10 minutes prior to match schedule. Keep
                  notifications active!
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 rounded-xl bg-emerald-500 text-white font-display text-xs font-black tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Awesome
                  </button>
                </div>
              </>
            )}

            {modalType === "error" && (
              <>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                  <span className="text-lg">!</span>
                </div>
                <div>
                  <h4 className="font-display text-base font-black tracking-wide text-destructive">
                    Join Match Failed
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {errorMessage}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="py-3 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-bold tracking-wider text-foreground"
                  >
                    Close
                  </button>
                  <Link
                    to="/wallet"
                    className="py-3 rounded-xl bg-brand text-brand-foreground font-display text-xs font-black tracking-wider text-center flex items-center justify-center brand-glow"
                  >
                    Add Money
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function PrizeList({ distribution }: { distribution?: { rank: number; prize: number }[] }) {
  const medalBg = (r: number) =>
    r === 1 ? "bg-gold/15" : r === 2 ? "bg-silver/20" : r === 3 ? "bg-bronze/15" : "bg-surface";
  const data = distribution && distribution.length > 0 ? distribution : PRIZE_DISTRIBUTION;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 pb-32">
      <h3 className="mb-3 font-display text-lg font-black">Prize Distribution</h3>
      <ul className="space-y-1.5">
        {data.map(({ rank, prize }) => (
          <li
            key={rank}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2.5",
              medalBg(rank),
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold">Rank {rank}</span>
            </div>
            <span className="font-display text-sm font-black text-success">₹{prize}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlayerList({ filled, isJoined, ign }: { filled: number; isJoined: boolean; ign: string }) {
  let shown = [...PLAYERS];
  if (isJoined) {
    if (!shown.includes(ign)) {
      shown = [ign, ...shown];
    }
  }
  shown = shown.slice(0, Math.max(filled, 6));

  return (
    <div className="pb-32">
      <div className="mb-2 text-right text-[10px] font-semibold tracking-widest text-muted-foreground">
        {shown.length} Players
      </div>
      <ul className="space-y-2">
        {shown.map((p) => (
          <li
            key={p}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-all",
              p === ign
                ? "border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                : "border-border bg-card",
            )}
          >
            <div
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display text-xs font-black",
                p === ign ? "bg-emerald-500/20 text-emerald-400" : "bg-surface-2 text-brand",
              )}
            >
              {p.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 truncate font-display text-xs font-bold flex items-center gap-1.5">
              <span className="truncate">{p}</span>
              {p === ign && (
                <span className="shrink-0 text-[8px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black tracking-wider">
                  You
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RulesList({ rules }: { rules?: string[] }) {
  const data = rules && rules.length > 0 ? rules : RULES;
  return (
    <ol className="space-y-2 pb-32">
      {data.map((r, i) => (
        <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/15 font-display text-xs font-black text-brand">
            {i + 1}
          </span>
          <p className="text-sm leading-relaxed text-foreground/90">{r}</p>
        </li>
      ))}
    </ol>
  );
}
