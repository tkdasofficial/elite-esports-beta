export type Tournament = {
  id: string;
  title: string;
  mode: string;
  map: string;
  slotsTotal: number;
  slotsFilled: number;
  prize: number;
  entry: number;
  perKill?: number;
  matchId: string;
  dateTime: string;
  category: string;
  status?: "upcoming" | "live" | "played";
  wonAmount?: number;
  position?: number;
  rules?: string[];
  distribution?: { rank: number; prize: number }[];
  logoEmoji?: string;
  logoUrl?: string;
  slotsSelectType?: "AUTO" | "MANUAL";
};

export type Transaction = {
  t: string;
  d: string;
  a: number;
  kind: "in" | "out";
  when: string;
};

export type LeaderboardEntry = {
  ign: string;
  earnings: number;
};

export type PrizeEntry = {
  rank: number;
  prize: number;
};

// Clean default categories for general Esports tournaments
export const CATEGORIES = [
  "All",
  "Solo BR",
  "Duo BR",
  "Squad BR",
  "Elite Solo",
  "Solo Per Kill",
  "CS Mode",
];

export const TOURNAMENTS: Tournament[] = [];

export const MY_MATCHES: Tournament[] = [];

export const INITIAL_WALLET: number = 0;

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_JOINED_TOURNAMENTS: string[] = [];

export const PRIZE_DISTRIBUTION: PrizeEntry[] = [
  { rank: 1, prize: 50 },
  { rank: 2, prize: 40 },
  { rank: 3, prize: 30 },
  { rank: 4, prize: 20 },
  { rank: 5, prize: 15 },
  { rank: 6, prize: 12 },
  { rank: 7, prize: 10 },
  { rank: 8, prize: 8 },
];

export const RULES: string[] = [
  "Screen recording is mandatory for all participants.",
  "No use of emotes or emulators during matches.",
  "Only mobile devices are allowed — tablets & iPads restricted.",
  "Teaming with other solo players will result in a permanent ban.",
  "Room ID & password will be shared 10 minutes before match start.",
  "Any hacks, mods, or third-party tools = instant disqualification.",
  "Screenshots of the final position must be uploaded within 15 minutes.",
];

export const PLAYERS: string[] = [];

export const LEADERBOARD: LeaderboardEntry[] = [];
