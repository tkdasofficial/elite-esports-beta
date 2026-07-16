import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Trophy,
  MessageCircle,
  BookOpen,
  Gamepad2,
  Lock,
  Unlock,
  Award,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useApp, EsportsTeam, EsportsMatch } from "@/lib/app-state";

export const Route = createFileRoute("/private")({
  component: OfficialEsportsPage,
});

function OfficialEsportsPage() {
  const { esportsTeams, esportsMatches } = useApp();
  const [passKey, setPassKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedTeam, setUnlockedTeam] = useState<EsportsTeam | null>(null);
  const [error, setError] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"matches" | "roster" | "rules">("matches");
  const [showPass, setShowPass] = useState(false);

  // Clean raw key of special characters/spaces to count exactly 12 alphanumeric characters
  const cleanKey = passKey.replace(/[^A-Z0-9]/gi, "");

  const handleUnlock = () => {
    const cleanEnteredKey = passKey.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    const team = esportsTeams.find(
      (t) => t.passKey.replace(/[^A-Z0-9]/gi, "").toUpperCase() === cleanEnteredKey,
    );

    if (team) {
      setUnlockedTeam(team);
      setIsUnlocked(true);
      setError("");
    } else {
      setError(
        "Invalid Pass-Key. Verify with your manager or contact admin (e.g. TEAM-ESQ1-8899).",
      );
    }
  };

  const formatPassKey = (val: string) => {
    const cleaned = val.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    let formatted = cleaned;
    if (cleaned.length > 4 && cleaned.length <= 8) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else if (cleaned.length > 8) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
    }
    setPassKey(formatted);
  };

  // Filter matches where this team is playing
  const myAssignedMatches = unlockedTeam
    ? esportsMatches.filter((m) => m.teams.includes(unlockedTeam.name))
    : [];

  return (
    <AppShell hideTopBar>
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 transition-all active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-lg font-black tracking-wider text-foreground">
              Official eSports
            </h1>
            <p className="text-[10px] tracking-wider text-brand font-bold">FFIC & FFMIC Arena</p>
          </div>
        </div>
        {isUnlocked && unlockedTeam && (
          <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-[10px] font-bold text-brand tracking-wider flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="h-3 w-3 text-brand" /> {unlockedTeam.name}
          </span>
        )}
      </div>

      {!isUnlocked ? (
        <div className="px-4 py-4 max-w-lg mx-auto">
          {/* Informational Banner */}
          <div className="mb-5 rounded-2xl border border-brand/25 bg-brand/5 p-5 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand/15 text-brand brand-glow">
              <Shield className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-lg font-black tracking-wider text-brand">
              Pro Scrims & Rules Hub
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              This premium portal is designed for official team match tracking, custom lobby room
              distribution, and FFMIC/FFIC tournament rules. Enter your team's assigned 12-digit
              passkey to access.
            </p>
          </div>

          {/* Passcode Box */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-display text-sm font-black tracking-wide flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand" /> Enter Team Pass-Key
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Contact Admin via Help desk if your team has not been registered.
            </p>

            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-3 py-3">
              <Lock className="h-4.5 w-4.5 text-muted-foreground" />
              <input
                value={passKey}
                onChange={(e) => formatPassKey(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="flex-1 bg-transparent font-display text-base font-bold tracking-widest outline-none placeholder:text-muted-foreground/30 text-foreground"
                maxLength={14} // 12 characters + 2 hyphens
              />
            </div>

            {error && <p className="mt-2.5 text-xs text-destructive font-semibold">{error}</p>}

            <button
              onClick={handleUnlock}
              disabled={cleanKey.length !== 12}
              className="mt-4 w-full rounded-xl bg-brand py-3.5 font-display text-xs font-black tracking-widest text-brand-foreground brand-glow disabled:opacity-40 transition-all active:scale-[0.98]"
            >
              Verify & Unlock Portal
            </button>
          </div>

          {/* Instruction Box */}
          <div className="mt-5 rounded-2xl border border-dashed border-border p-4 bg-surface/30">
            <h4 className="font-display text-xs font-black tracking-wider text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-brand" /> Team Practice Rules
            </h4>
            <ul className="mt-2.5 space-y-2 text-[11px] text-muted-foreground leading-relaxed">
              <li>
                • <strong>Roster Rule:</strong> Standard squad must contain 4 active players + 1
                optional substitute.
              </li>
              <li>
                • <strong>Verification:</strong> Player UIDs must exactly match registered profiles
                inside matches.
              </li>
              <li>
                • <strong>Fair Play:</strong> Emulator players are strictly banned unless specified.
                Standard mobile tournament rules apply.
              </li>
            </ul>
            <div className="mt-4 flex justify-center">
              <Link
                to="/support"
                className="inline-flex items-center gap-1.5 rounded-xl bg-surface-2 px-4 py-2 text-[10px] font-black tracking-wider text-brand hover:bg-surface-2/80 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Support & Registration
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-28 max-w-lg mx-auto">
          {/* Sub-Tabs */}
          <div className="my-4 grid grid-cols-3 gap-1.5 rounded-xl bg-surface-2 p-1">
            <button
              onClick={() => setActiveSubTab("matches")}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg font-display text-[10px] font-black tracking-wider transition-all ${
                activeSubTab === "matches"
                  ? "bg-brand text-brand-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gamepad2 className="h-3 w-3" /> Matches
            </button>
            <button
              onClick={() => setActiveSubTab("roster")}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg font-display text-[10px] font-black tracking-wider transition-all ${
                activeSubTab === "roster"
                  ? "bg-brand text-brand-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-3 w-3" /> Team
            </button>
            <button
              onClick={() => setActiveSubTab("rules")}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg font-display text-[10px] font-black tracking-wider transition-all ${
                activeSubTab === "rules"
                  ? "bg-brand text-brand-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3 w-3" /> Point Rules
            </button>
          </div>

          {activeSubTab === "matches" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xs font-black tracking-wider text-muted-foreground">
                  Your eSports Match Roster ({myAssignedMatches.length})
                </h2>
                <span className="text-[10px] text-brand font-bold">Real-time update</span>
              </div>

              {myAssignedMatches.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                  <Gamepad2 className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs font-bold tracking-wider">No Scheduled Matches</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-xs mx-auto">
                    Your team is currently not assigned to any upcoming scrims or tournaments.
                    Contact administration to assign slots.
                  </p>
                </div>
              ) : (
                myAssignedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg"
                  >
                    {/* Header */}
                    <div className="bg-surface px-4 py-3 flex justify-between items-center border-b border-border">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand tracking-wider">
                        <Calendar className="h-3.5 w-3.5" /> {match.dateTime}
                      </span>
                      <span className="rounded-md bg-brand/10 border border-brand/20 px-2 py-0.5 font-mono text-[9px] text-brand font-bold">
                        {match.matchId}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-display text-base font-black tracking-wide text-foreground">
                        {match.title}
                      </h3>

                      {/* Info grid */}
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-muted-foreground">
                        <div className="rounded-xl bg-surface p-2 border border-border">
                          <span className="block text-[8px] font-bold text-muted-foreground mb-0.5">
                            MAP
                          </span>
                          <strong className="text-foreground font-display tracking-wide">
                            {match.map}
                          </strong>
                        </div>
                        <div className="rounded-xl bg-surface p-2 border border-border">
                          <span className="block text-[8px] font-bold text-muted-foreground mb-0.5">
                            PRIZE POOL
                          </span>
                          <strong className="text-brand font-display">
                            {match.prize > 0 ? `₹${match.prize}` : "Practice"}
                          </strong>
                        </div>
                        <div className="rounded-xl bg-surface p-2 border border-border">
                          <span className="block text-[8px] font-bold text-muted-foreground mb-0.5">
                            SLOTS
                          </span>
                          <strong className="text-foreground font-mono">{match.slotsBooked}</strong>
                        </div>
                      </div>

                      {/* Room ID and Password - Crucial feature for esports players */}
                      {match.customRoomId ? (
                        <div className="mt-4 rounded-xl border border-success/30 bg-success/5 p-3.5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black tracking-wider text-success flex items-center gap-1.5">
                              <Unlock className="h-3.5 w-3.5" /> Custom Room Credentials
                            </span>
                            <button
                              onClick={() => setShowPass(!showPass)}
                              className="text-[10px] text-success hover:underline flex items-center gap-1 font-bold"
                            >
                              {showPass ? (
                                <>
                                  <EyeOff className="h-3 w-3" /> Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3" /> Show Password
                                </>
                              )}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/25 rounded-lg px-3 py-2 border border-border">
                              <span className="block text-[8px] text-muted-foreground font-bold">
                                Room ID
                              </span>
                              <span className="font-mono text-xs font-black text-foreground select-all flex items-center gap-1">
                                <Hash className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                                {match.customRoomId}
                              </span>
                            </div>
                            <div className="bg-black/25 rounded-lg px-3 py-2 border border-border">
                              <span className="block text-[8px] text-muted-foreground font-bold">
                                Password
                              </span>
                              <span className="font-mono text-xs font-black text-foreground">
                                {showPass ? (
                                  <span className="text-success tracking-wide select-all">
                                    {match.customRoomPassword || "Not Set"}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/50 tracking-widest">
                                    ••••••
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-[9px] text-muted-foreground text-center">
                            *Do not share Room ID/Pass. Registered accounts only. Unregistered UIDs
                            will be kicked automatically.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-center">
                          <span className="text-[10px] font-bold text-muted-foreground flex items-center justify-center gap-1.5">
                            <Lock className="h-3.5 w-3.5" /> Room details not assigned yet
                          </span>
                          <p className="text-[9px] text-muted-foreground/60 mt-1">
                            Credentials will appear here 15 minutes before the scheduled map
                            kick-off.
                          </p>
                        </div>
                      )}

                      {/* Opponent list */}
                      <div className="mt-4 border-t border-border pt-3">
                        <div className="text-[10px] font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Trophy className="h-3 w-3 text-brand" /> Competing Squads
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {match.teams.map((t, idx) => {
                            const isMine = t === unlockedTeam?.name;
                            return (
                              <span
                                key={idx}
                                className={`rounded-md px-2.5 py-1 text-[9px] font-bold border transition-colors ${
                                  isMine
                                    ? "bg-brand/15 text-brand border-brand/30 font-black"
                                    : "bg-surface text-muted-foreground border-border/40"
                                }`}
                              >
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSubTab === "roster" && unlockedTeam && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 border border-brand/20 text-brand">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-black tracking-wider text-foreground">
                        {unlockedTeam.name}
                      </h3>
                      <p className="text-[10px] tracking-wider text-muted-foreground">
                        Assigned Leader:{" "}
                        <span className="text-foreground font-bold">{unlockedTeam.leader}</span>
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-[9px] font-black tracking-wider text-brand">
                    Active Squad
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="text-[10px] font-bold text-muted-foreground">
                    Registered Active Players
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {unlockedTeam.players.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-surface-2 p-3 border border-border/60"
                      >
                        <div className="text-[9px] font-bold text-brand">Player {idx + 1}</div>
                        <div className="font-display text-xs font-bold text-foreground truncate mt-0.5">
                          {p || "Empty slot"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-bold text-brand">
                        Roster Substitute (Extra)
                      </div>
                      <div className="font-display text-xs font-bold text-foreground mt-0.5">
                        {unlockedTeam.backup || "No Substitute Assigned"}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground bg-surface-2 px-2.5 py-1 rounded-lg border border-border">
                      Backup
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex justify-between items-center bg-surface-2 rounded-xl p-3 border border-border">
                    <div>
                      <span className="block text-[8px] text-muted-foreground font-black">
                        Your Security Key
                      </span>
                      <span className="font-mono text-xs font-bold text-foreground tracking-widest">
                        {unlockedTeam.passKey}
                      </span>
                    </div>
                    <span className="text-[8px] font-black bg-success/15 text-success border border-success/30 px-2 py-0.5 rounded">
                      Authorized
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "rules" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Point table card */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-sm font-black tracking-wider text-foreground flex items-center gap-1.5 mb-3">
                  <Award className="h-4.5 w-4.5 text-brand" /> Official FFIC / FFMIC Points System
                </h3>
                <p className="text-[11px] text-muted-foreground mb-4">
                  Point system matches standard Garena eSports guidelines. Points are aggregated
                  based on Placement + Kill Points.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black text-brand mb-1">Placement Score</div>
                    <div className="space-y-1 text-xs font-medium text-foreground/80">
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>1st (Booyah)</span> <strong className="text-brand">12 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>2nd Place</span> <strong>9 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>3rd Place</span> <strong>8 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>4th Place</span> <strong>7 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>5th Place</span> <strong>6 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>6th Place</span> <strong>5 pts</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black text-brand mb-1">
                      Placement Score Cont.
                    </div>
                    <div className="space-y-1 text-xs font-medium text-foreground/80">
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>7th Place</span> <strong>4 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>8th Place</span> <strong>3 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>9th Place</span> <strong>2 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>10th Place</span> <strong>1 pt</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1">
                        <span>11th-12th Place</span> <strong>0 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-border/50 pb-1 text-brand">
                        <span>Each Kill Point</span> <strong>1 pt</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament conduct */}
              <div className="rounded-2xl border border-dashed border-border p-4 bg-surface/30">
                <h4 className="font-display text-xs font-black tracking-wider text-foreground">
                  Pro-Player Code of Conduct
                </h4>
                <ul className="mt-2.5 space-y-2 text-[11px] text-muted-foreground leading-relaxed">
                  <li>
                    • <strong>Screen Recording:</strong> Standard procedure requires players to
                    record full device screen or stream-proof footage during matches.
                  </li>
                  <li>
                    • <strong>No Exploits:</strong> Use of safe zone glitches, graphic file mods, or
                    custom config edits will lead to immediate disqualification and a permanent ban.
                  </li>
                  <li>
                    • <strong>Tie-Breaker Rule:</strong> In case of identical point scores at
                    end-of-series, highest number of total Booyah! matches will decide the rank,
                    followed by total kill counts.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="mt-6 rounded-2xl border border-border p-4 bg-surface-2/40 text-center">
            <h4 className="font-display text-xs font-black tracking-wider text-muted-foreground">
              Official Tournament Support
            </h4>
            <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Please direct all match reschedule requests and lobby roster alterations to the admin
              console.
            </p>
            <div className="mt-3.5 flex justify-center gap-2">
              <Link
                to="/support"
                className="rounded-xl bg-brand px-4 py-2.5 text-[10px] font-black tracking-widest text-brand-foreground brand-glow transition-all active:scale-95"
              >
                Go to Help Desk
              </Link>
              <button
                onClick={() => {
                  setPassKey("");
                  setUnlockedTeam(null);
                  setIsUnlocked(false);
                }}
                className="rounded-xl bg-surface px-4 py-2.5 text-[10px] font-black tracking-widest text-foreground hover:bg-surface-2 transition-all border border-border"
              >
                Exit Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
