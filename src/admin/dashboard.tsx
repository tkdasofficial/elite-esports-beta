import {
  LayoutDashboard,
  Users,
  Trophy,
  Layers,
  CreditCard,
  ScrollText,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tournament, AdminUser } from "@/lib/app-state";
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

export type AdminTab =
  "dashboard" | "users" | "matches" | "categories" | "payments" | "rules" | "banners";

export function DashboardPanel({
  tournaments,
  users,
  categories,
  setActiveTab,
}: {
  tournaments: Tournament[];
  users: AdminUser[];
  categories: string[];
  setActiveTab: (t: AdminTab) => void;
}) {
  // Stats calculations
  const totalMatches = tournaments.length;
  const totalUsers = users.length;

  // Approximate calculations
  const totalEntryFees = tournaments.reduce((sum, t) => sum + t.entry * (t.slotsFilled || 0), 0);
  const totalPrizeDistributed = tournaments.reduce((sum, t) => {
    if (t.status === "played") {
      return sum + t.prize;
    }
    return sum;
  }, 0);

  // Chart Mock Data based on actual states
  const monthlyRevenueData = [
    { name: "Mon", revenue: Math.round(totalEntryFees * 0.1) || 120, matches: 2 },
    { name: "Tue", revenue: Math.round(totalEntryFees * 0.15) || 180, matches: 3 },
    { name: "Wed", revenue: Math.round(totalEntryFees * 0.22) || 240, matches: 4 },
    { name: "Thu", revenue: Math.round(totalEntryFees * 0.18) || 200, matches: 3 },
    { name: "Fri", revenue: Math.round(totalEntryFees * 0.35) || 450, matches: 6 },
    { name: "Sat", revenue: Math.round(totalEntryFees * 0.42) || 580, matches: 8 },
    { name: "Sun", revenue: Math.round(totalEntryFees * 0.3) || 410, matches: 5 },
  ];

  const categoryDistribution = categories.map((cat, i) => {
    const count = tournaments.filter((t) => t.category === cat).length;
    return {
      name: cat.split(" ")[0], // short name
      count: count || (i % 2) + 1, // fallback to some default for aesthetic representation
    };
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Total Matches"
          value={totalMatches.toString()}
          badge="Live Feed"
          onClick={() => setActiveTab("matches")}
        />
        <MetricCard
          label="Registered Users"
          value={totalUsers.toString()}
          badge="Active Roster"
          onClick={() => setActiveTab("users")}
        />
        <MetricCard
          label="Estimated Revenue"
          value={`₹${totalEntryFees}`}
          badge="Gross Fees"
          onClick={() => setActiveTab("payments")}
        />
        <MetricCard
          label="Prize Distributed"
          value={`₹${totalPrizeDistributed}`}
          badge="Total Payout"
          onClick={() => setActiveTab("payments")}
        />
      </div>

      {/* Dynamic Charts Section */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
        <div>
          <h3 className="font-display text-xs font-black tracking-wider text-muted-foreground">
            Lobby Financial Index
          </h3>
          <h4 className="font-display text-base font-black text-foreground leading-none mt-0.5">
            Entry Fees Collection Trend
          </h4>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyRevenueData}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} />
              <YAxis stroke="#525252" fontSize={10} tickLine={false} />
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
                dataKey="revenue"
                name="Revenue (₹)"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div>
            <h3 className="font-display text-xs font-black tracking-wider text-muted-foreground">
              Core Segments
            </h3>
            <h4 className="font-display text-base font-black text-foreground leading-none mt-0.5">
              Tournaments by Category
            </h4>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryDistribution}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <XAxis dataKey="name" stroke="#525252" fontSize={9} tickLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#262626",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "#f43f5e", fontSize: "12px" }}
                />
                <Bar dataKey="count" name="Matches" radius={[4, 4, 0, 0]}>
                  {categoryDistribution.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={idx % 2 === 0 ? "#f43f5e" : "#e11d48"}
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Logs / Audit ledger */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div>
            <h3 className="font-display text-xs font-black tracking-wider text-muted-foreground">
              Engine Status
            </h3>
            <h4 className="font-display text-base font-black text-foreground leading-none mt-0.5">
              Live Operation Log
            </h4>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            <LogItem
              time="Just Now"
              text="Admin paid user GhostReaperOP ₹150 (Win distribution)"
              type="success"
            />
            <LogItem
              time="10 mins ago"
              text="New tournament 'Clash Squad Clash' added successfully"
              type="info"
            />
            <LogItem
              time="2 hrs ago"
              text="Category 'CS Mode' updated by Administrator"
              type="info"
            />
            <LogItem
              time="Yesterday"
              text="Roster synchronization check complete - 0 conflicts"
              type="success"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  badge,
  onClick,
}: {
  label: string;
  value: string;
  badge: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98] hover:border-brand/40"
    >
      <span className="text-[9px] font-black tracking-widest text-muted-foreground">{label}</span>
      <strong className="font-display text-2xl font-black text-foreground mt-0.5 leading-none">
        {value}
      </strong>
      <span className="text-[8px] font-bold tracking-wider text-brand/90 mt-1">{badge} →</span>
    </button>
  );
}

function LogItem({ time, text, type }: { time: string; text: string; type: "success" | "info" }) {
  return (
    <div className="flex items-start gap-2 text-[11px] leading-relaxed border-b border-border/50 pb-1.5 last:border-b-0">
      <span
        className={cn(
          "shrink-0 h-1.5 w-1.5 rounded-full mt-1.5",
          type === "success" ? "bg-emerald-400" : "bg-sky-400",
        )}
      />
      <div className="flex-1 text-foreground/80">
        <span className="font-semibold text-foreground">{text}</span>
        <span className="text-muted-foreground text-[9px] ml-1.5">({time})</span>
      </div>
    </div>
  );
}
