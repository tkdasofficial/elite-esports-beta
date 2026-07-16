import { useApp } from "@/lib/app-state";
import { Trophy, Users, Calendar, DollarSign, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export function EsportsDashboardPanel() {
  const { esportsTeams, esportsMatches } = useApp();

  // Metrics
  const totalTeams = esportsTeams.length;
  const totalMatches = esportsMatches.length;
  const totalPlayers = esportsTeams.reduce(
    (sum, t) => sum + (t.players?.length || 0) + (t.backup ? 1 : 0),
    0,
  );
  const totalPrizePool = esportsMatches.reduce((sum, m) => sum + (m.prize || 0), 0);

  // Scrim Registration trends / Booking
  const matchActivityData = esportsMatches.map((m, i) => {
    // Parse slots
    // e.g., "4 / 12 Teams" => 4
    let booked = 0;
    if (m.slotsBooked) {
      const match = m.slotsBooked.match(/^(\d+)/);
      if (match) booked = parseInt(match[1]);
    }
    return {
      name: m.title.length > 15 ? `${m.title.substring(0, 15)}...` : m.title,
      bookedTeams: booked || 2,
      prize: m.prize || 100,
    };
  });

  // Mock trend data if no matches exist for visual consistency
  const defaultTrendData = [
    { name: "Scrim #1", bookedTeams: 4, prize: 500 },
    { name: "Scrim #2", bookedTeams: 8, prize: 1000 },
    { name: "Scrim #3", bookedTeams: 6, prize: 800 },
    { name: "Scrim #4", bookedTeams: 12, prize: 2000 },
  ];

  const chartData = matchActivityData.length > 0 ? matchActivityData : defaultTrendData;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-muted-foreground">
              Total Squads
            </span>
            <div className="p-1 rounded-lg bg-brand/10 text-brand">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-black text-foreground">{totalTeams}</span>
            <span className="text-[9px] text-emerald-400 font-bold tracking-wider">+Active</span>
          </div>
          <p className="text-[8px] text-muted-foreground font-black">Registered Clans</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-muted-foreground">
              Pro Scrims
            </span>
            <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-black text-foreground">{totalMatches}</span>
            <span className="text-[9px] text-indigo-400 font-bold tracking-wider">Live Feed</span>
          </div>
          <p className="text-[8px] text-muted-foreground font-black">Scheduled Matches</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-muted-foreground">
              Roster Players
            </span>
            <div className="p-1 rounded-lg bg-pink-500/10 text-pink-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-black text-foreground">{totalPlayers}</span>
            <span className="text-[9px] text-pink-400 font-bold tracking-wider">Verified</span>
          </div>
          <p className="text-[8px] text-muted-foreground font-black">With Unique UIDs</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-muted-foreground">
              Total Prize Pool
            </span>
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-black text-foreground">
              ₹{totalPrizePool}
            </span>
            <span className="text-[9px] text-emerald-400 font-bold tracking-wider">INR</span>
          </div>
          <p className="text-[8px] text-muted-foreground font-black">FFIC & FFMIC Pool</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scrim Booking Area Chart */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
          <div>
            <h3 className="font-display text-xs font-black tracking-wider text-muted-foreground">
              Competitor Engagement
            </h3>
            <h4 className="font-display text-base font-black text-foreground leading-none mt-0.5">
              Squad Slots Filled by Match
            </h4>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBooked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#737373" fontSize={10} tickLine={false} />
                <YAxis stroke="#737373" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#262626",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#a3a3a3", fontSize: "11px" }}
                  itemStyle={{ color: "#f43f5e", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="bookedTeams"
                  name="Booked Squads"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorBooked)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prize Pool Distribution Bar Chart */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
          <div>
            <h3 className="font-display text-xs font-black tracking-wider text-muted-foreground">
              Prize Indexes
            </h3>
            <h4 className="font-display text-base font-black text-foreground leading-none mt-0.5">
              Prize Allocation Per Scrim
            </h4>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#737373" fontSize={10} tickLine={false} />
                <YAxis stroke="#737373" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#262626",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#a3a3a3", fontSize: "11px" }}
                  itemStyle={{ color: "#22c55e", fontSize: "12px" }}
                />
                <Bar dataKey="prize" name="Prize Pool (₹)" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#f43f5e" : "#e11d48"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Engine Status Info */}
      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 flex gap-3 items-start">
        <Zap className="h-5 w-5 text-brand shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-display text-xs font-black tracking-wider text-foreground">
            FFIC Esports Sync Engine Active
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All registered squad members, scheduled Scrim events, custom room credentials, and rule
            templates are automatically pushed live to players' dashboard sections in real-time. Use
            the tabs to manage rosters, generate passkeys, and update lobby details.
          </p>
        </div>
      </div>
    </div>
  );
}
