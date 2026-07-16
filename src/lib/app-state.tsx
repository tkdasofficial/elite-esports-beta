import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  INITIAL_WALLET,
  INITIAL_TRANSACTIONS,
  INITIAL_JOINED_TOURNAMENTS,
  Tournament,
  CATEGORIES,
  TOURNAMENTS,
  RULES,
} from "./tournament-data";

type Theme = "dark" | "light";
type ThemeMode = "default" | "light" | "dark";

type NotificationsState = {
  matchesReminder: boolean;
  updates: boolean;
  offers: boolean;
  rewards: boolean;
};

type SecurityState = {
  twoFactorEmail: boolean;
  twoFactorAuthApp: boolean;
};

type Transaction = {
  t: string;
  d: string;
  a: number;
  kind: "in" | "out";
  when: string;
};

export type UserProfile = {
  email: string;
  ign: string;
  uid: string;
  legalName?: string;
  dob?: string;
  phone?: string;
  address?: string;
  isOnboarded: boolean;
  role?: "admin" | "user";
};

export type AdminRulesTemplate = {
  id: string;
  name: string;
  rules: string[];
};

export type AdminBanner = {
  id: string;
  url: string;
  name: string;
};

export type AdminUser = {
  uid: string;
  ign: string;
  email: string;
  wallet: number;
  phone?: string;
  status?: "active" | "suspended" | "banned" | "terminated";
  statusReason?: string;
  suspendedUntil?: string;
  dob?: string;
  address?: string;
  joinedAt?: string;
  gamesPlayed?: number;
  lastLogin?: string;
};

type AppState = {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  wallet: number;
  setWallet: (v: number) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  ign: string;
  setIgn: (v: string) => void;
  avatar: string;
  setAvatar: (v: string) => void;
  uid: string;
  setUid: (v: string) => void;
  notifications: NotificationsState;
  setNotifications: (v: Partial<NotificationsState>) => void;
  security: SecurityState;
  setSecurity: (v: Partial<SecurityState>) => void;
  joinedTournaments: string[];
  joinTournament: (
    id: string,
    title: string,
    matchId: string,
    entryFee: number,
  ) => { success: boolean; error?: string };
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;

  // Authentication & Onboarding
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  signup: (email: string) => void;
  logout: () => void;
  completeOnboarding: (info: {
    legalName: string;
    dob: string;
    phone: string;
    address: string;
    ign: string;
    uid: string;
  }) => void;

  // Admin Panel states & actions
  tournaments: Tournament[];
  addTournament: (t: Tournament) => void;
  updateTournament: (id: string, t: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  categories: string[];
  addCategory: (c: string) => void;
  deleteCategory: (c: string) => void;
  rulesTemplates: AdminRulesTemplate[];
  addRulesTemplate: (t: Omit<AdminRulesTemplate, "id">) => void;
  updateRulesTemplate: (id: string, t: Partial<AdminRulesTemplate>) => void;
  deleteRulesTemplate: (id: string) => void;
  banners: AdminBanner[];
  addBanner: (b: Omit<AdminBanner, "id">) => void;
  deleteBanner: (id: string) => void;
  usersList: AdminUser[];
  payUser: (userIdOrIgn: string, amount: number, description: string) => boolean;
  updateUserStatus: (
    uid: string,
    status: "active" | "suspended" | "banned" | "terminated",
    reason?: string,
    suspendedUntil?: string,
  ) => void;

  // Esports Panel states & actions
  esportsTeams: EsportsTeam[];
  addEsportsTeam: (t: EsportsTeam) => void;
  updateEsportsTeam: (id: string, t: Partial<EsportsTeam>) => void;
  deleteEsportsTeam: (id: string) => void;
  esportsMatches: EsportsMatch[];
  addEsportsMatch: (m: EsportsMatch) => void;
  updateEsportsMatch: (id: string, m: Partial<EsportsMatch>) => void;
  deleteEsportsMatch: (id: string) => void;
};

export type EsportsTeam = {
  id: string;
  name: string;
  passKey: string;
  leader: string;
  players: string[];
  backup: string;
  status?: "active" | "suspended" | "banned" | "terminated";
};

export type EsportsMatch = {
  id: string;
  title: string;
  matchId: string;
  map: string;
  dateTime: string;
  prize: number;
  status: "upcoming" | "live" | "completed";
  type: string;
  slotsBooked: string;
  teams: string[];
  customRoomId?: string;
  customRoomPassword?: string;
};

const AppContext = createContext<AppState | null>(null);

const DEFAULT_TRANSACTIONS: Transaction[] = [];

const DEFAULT_BANNERS: AdminBanner[] = [];

const DEFAULT_USERS_LIST: AdminUser[] = [];

const DEFAULT_ESPORTS_TEAMS: EsportsTeam[] = [];

const DEFAULT_ESPORTS_MATCHES: EsportsMatch[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [theme, setTheme] = useState<Theme>("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin States
  const [tournaments, setTournamentsState] = useState<Tournament[]>([]);
  const [categories, setCategoriesState] = useState<string[]>([]);
  const [rulesTemplates, setRulesTemplates] = useState<AdminRulesTemplate[]>([]);
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [esportsTeams, setEsportsTeams] = useState<EsportsTeam[]>([]);
  const [esportsMatches, setEsportsMatches] = useState<EsportsMatch[]>([]);

  // Initialize with safe fallback defaults for SSR
  const [ign, setIgnState] = useState("PhantomAceHD");
  const [uid, setUidState] = useState("52841092");
  const [wallet, setWalletState] = useState<number>(INITIAL_WALLET);
  const [joinedTournaments, setJoinedTournaments] = useState<string[]>(INITIAL_JOINED_TOURNAMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const [notifications, setNotificationsState] = useState<NotificationsState>({
    matchesReminder: true,
    updates: true,
    offers: false,
    rewards: true,
  });

  const [security, setSecurityState] = useState<SecurityState>({
    twoFactorEmail: false,
    twoFactorAuthApp: false,
  });

  // Load initial states from localStorage safely after mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const savedUser = localStorage.getItem("ff_user");
        if (savedUser !== null) {
          try {
            const parsed = JSON.parse(savedUser);
            setUserState(parsed);
            if (parsed.ign) setIgnState(parsed.ign);
            if (parsed.uid) setUidState(parsed.uid);
          } catch {
            // fallback
          }
        }

        const savedIgn = localStorage.getItem("ff_ign");
        if (savedIgn !== null) setIgnState(savedIgn);

        const savedUid = localStorage.getItem("ff_uid");
        if (savedUid !== null) setUidState(savedUid);

        const savedWallet = localStorage.getItem("ff_wallet_balance");
        if (savedWallet !== null) {
          setWalletState(parseFloat(savedWallet));
        } else {
          setWalletState(INITIAL_WALLET);
        }

        const savedTournaments = localStorage.getItem("ff_joined_tournaments");
        if (savedTournaments !== null) {
          try {
            setJoinedTournaments(JSON.parse(savedTournaments));
          } catch {
            setJoinedTournaments(INITIAL_JOINED_TOURNAMENTS);
          }
        } else {
          setJoinedTournaments(INITIAL_JOINED_TOURNAMENTS);
          localStorage.setItem("ff_joined_tournaments", JSON.stringify(INITIAL_JOINED_TOURNAMENTS));
        }

        const savedTx = localStorage.getItem("ff_transactions");
        if (savedTx) {
          try {
            setTransactions(JSON.parse(savedTx));
          } catch {
            setTransactions(INITIAL_TRANSACTIONS);
          }
        } else {
          setTransactions(INITIAL_TRANSACTIONS);
          localStorage.setItem("ff_transactions", JSON.stringify(INITIAL_TRANSACTIONS));
        }

        // Load admin states
        const savedAdminTournaments = localStorage.getItem("ff_admin_tournaments");
        if (savedAdminTournaments !== null) {
          try {
            setTournamentsState(JSON.parse(savedAdminTournaments));
          } catch {
            setTournamentsState(TOURNAMENTS);
          }
        } else {
          setTournamentsState(TOURNAMENTS);
          localStorage.setItem("ff_admin_tournaments", JSON.stringify(TOURNAMENTS));
        }

        const savedAdminCategories = localStorage.getItem("ff_admin_categories");
        if (savedAdminCategories !== null) {
          try {
            setCategoriesState(JSON.parse(savedAdminCategories));
          } catch {
            setCategoriesState(CATEGORIES);
          }
        } else {
          setCategoriesState(CATEGORIES);
          localStorage.setItem("ff_admin_categories", JSON.stringify(CATEGORIES));
        }

        const savedAdminRules = localStorage.getItem("ff_admin_rules_templates");
        if (savedAdminRules !== null) {
          try {
            setRulesTemplates(JSON.parse(savedAdminRules));
          } catch {
            setRulesTemplates([{ id: "r1", name: "Standard Rules", rules: RULES }]);
          }
        } else {
          const initRules = [{ id: "r1", name: "Standard Rules", rules: RULES }];
          setRulesTemplates(initRules);
          localStorage.setItem("ff_admin_rules_templates", JSON.stringify(initRules));
        }

        const savedAdminBanners = localStorage.getItem("ff_admin_banners");
        if (savedAdminBanners !== null) {
          try {
            setBanners(JSON.parse(savedAdminBanners));
          } catch {
            setBanners(DEFAULT_BANNERS);
          }
        } else {
          setBanners(DEFAULT_BANNERS);
          localStorage.setItem("ff_admin_banners", JSON.stringify(DEFAULT_BANNERS));
        }

        const savedAdminUsers = localStorage.getItem("ff_admin_users");
        if (savedAdminUsers !== null) {
          try {
            setUsersList(JSON.parse(savedAdminUsers));
          } catch {
            setUsersList(DEFAULT_USERS_LIST);
          }
        } else {
          setUsersList(DEFAULT_USERS_LIST);
          localStorage.setItem("ff_admin_users", JSON.stringify(DEFAULT_USERS_LIST));
        }

        const savedEsportsTeams = localStorage.getItem("ff_esports_teams");
        if (savedEsportsTeams !== null) {
          try {
            setEsportsTeams(JSON.parse(savedEsportsTeams));
          } catch {
            setEsportsTeams(DEFAULT_ESPORTS_TEAMS);
          }
        } else {
          setEsportsTeams(DEFAULT_ESPORTS_TEAMS);
          localStorage.setItem("ff_esports_teams", JSON.stringify(DEFAULT_ESPORTS_TEAMS));
        }

        const savedEsportsMatches = localStorage.getItem("ff_esports_matches");
        if (savedEsportsMatches !== null) {
          try {
            setEsportsMatches(JSON.parse(savedEsportsMatches));
          } catch {
            setEsportsMatches(DEFAULT_ESPORTS_MATCHES);
          }
        } else {
          setEsportsMatches(DEFAULT_ESPORTS_MATCHES);
          localStorage.setItem("ff_esports_matches", JSON.stringify(DEFAULT_ESPORTS_MATCHES));
        }
      } catch (e) {
        console.warn("Could not read from localStorage on mount:", e);
      }
    }
  }, []);

  const setIgn = (v: string) => {
    setIgnState(v);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("ff_ign", v);
    }
    if (user) {
      const updated = { ...user, ign: v };
      setUserState(updated);
      localStorage.setItem("ff_user", JSON.stringify(updated));
      localStorage.setItem(`ff_profile_${user.email}`, JSON.stringify(updated));
    }
  };

  const setUid = (v: string) => {
    setUidState(v);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("ff_uid", v);
    }
    if (user) {
      const updated = { ...user, uid: v };
      setUserState(updated);
      localStorage.setItem("ff_user", JSON.stringify(updated));
      localStorage.setItem(`ff_profile_${user.email}`, JSON.stringify(updated));
    }
  };

  const login = (email: string) => {
    let profile: UserProfile;
    let savedProfileStr = null;
    if (typeof window !== "undefined" && window.localStorage) {
      savedProfileStr = localStorage.getItem(`ff_profile_${email}`);
    }

    const isAdmin =
      email.toLowerCase().includes("admin") || email.toLowerCase().endsWith("@admin.com");

    if (savedProfileStr) {
      try {
        profile = JSON.parse(savedProfileStr);
        if (isAdmin) {
          profile.role = "admin";
          profile.isOnboarded = true;
          if (!profile.ign) profile.ign = "AdminConsole";
          if (!profile.uid) profile.uid = "00000001";
        } else {
          profile.role = "user";
        }
      } catch {
        profile = {
          email,
          ign: isAdmin ? "AdminConsole" : "PhantomAceHD",
          uid: isAdmin ? "00000001" : "52841092",
          isOnboarded: true,
          role: isAdmin ? "admin" : "user",
        };
      }
    } else {
      profile = {
        email,
        ign: isAdmin ? "AdminConsole" : "PhantomAceHD",
        uid: isAdmin ? "00000001" : "52841092",
        isOnboarded: true,
        role: isAdmin ? "admin" : "user",
      };
    }

    setUserState(profile);
    setIgnState(profile.ign);
    setUidState(profile.uid);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("ff_user", JSON.stringify(profile));
      localStorage.setItem(`ff_profile_${email}`, JSON.stringify(profile));
      localStorage.setItem("ff_ign", profile.ign);
      localStorage.setItem("ff_uid", profile.uid);
    }
  };

  const signup = (email: string) => {
    const isAdmin =
      email.toLowerCase().includes("admin") || email.toLowerCase().endsWith("@admin.com");
    const profile: UserProfile = {
      email,
      ign: isAdmin ? "AdminConsole" : "",
      uid: isAdmin ? "00000001" : "",
      isOnboarded: isAdmin,
      role: isAdmin ? "admin" : "user",
    };
    setUserState(profile);
    setIgnState(profile.ign);
    setUidState(profile.uid);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("ff_user", JSON.stringify(profile));
      localStorage.setItem(`ff_profile_${email}`, JSON.stringify(profile));
      localStorage.setItem("ff_ign", profile.ign);
      localStorage.setItem("ff_uid", profile.uid);
    }
  };

  const logout = () => {
    setUserState(null);
    setIgnState("");
    setUidState("");
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("ff_user");
      localStorage.setItem("ff_ign", "");
      localStorage.setItem("ff_uid", "");
    }
  };

  const completeOnboarding = (info: {
    legalName: string;
    dob: string;
    phone: string;
    address: string;
    ign: string;
    uid: string;
  }) => {
    if (!user) return;
    const updatedProfile: UserProfile = {
      ...user,
      ...info,
      isOnboarded: true,
    };
    setUserState(updatedProfile);
    setIgnState(info.ign);
    setUidState(info.uid);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("ff_user", JSON.stringify(updatedProfile));
      localStorage.setItem(`ff_profile_${user.email}`, JSON.stringify(updatedProfile));
      localStorage.setItem("ff_ign", info.ign);
      localStorage.setItem("ff_uid", info.uid);
    }
  };

  const setWallet = (v: number) => {
    setWalletState(v);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("ff_wallet_balance", v.toString());
    }
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => {
      const next = [tx, ...prev];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_transactions", JSON.stringify(next));
      }
      return next;
    });
  };

  const joinTournament = (id: string, title: string, matchId: string, entryFee: number) => {
    if (joinedTournaments.includes(id)) {
      return { success: false, error: "You are already registered for this tournament." };
    }

    if (wallet < entryFee) {
      return {
        success: false,
        error: `Insufficient balance. This match requires ₹${entryFee}, but you only have ₹${wallet.toFixed(2)}. Please top up your wallet.`,
      };
    }

    // Deduct entry fee
    const newBalance = wallet - entryFee;
    setWallet(newBalance);

    // Add to joined tournaments
    const nextTournaments = [...joinedTournaments, id];
    setJoinedTournaments(nextTournaments);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("ff_joined_tournaments", JSON.stringify(nextTournaments));
    }

    // Format current time beautifully
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const timeStr = new Date().toLocaleTimeString("en-US", options);
    const dateStr = "Today • " + timeStr;

    // Log the transaction
    const newTx: Transaction = {
      t: "Entry Fee",
      d: `${title} ${matchId}`.trim(),
      a: -entryFee,
      kind: "out" as const,
      when: dateStr,
    };
    addTransaction(newTx);

    return { success: true };
  };

  // Sync usersList when wallet, uid, or ign of logged-in user changes
  useEffect(() => {
    if (uid) {
      setUsersList((prev) => {
        const idx = prev.findIndex((u) => u.uid === uid);
        if (idx >= 0 && prev[idx].wallet !== wallet) {
          const next = [...prev];
          next[idx] = { ...next[idx], wallet };
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("ff_admin_users", JSON.stringify(next));
          }
          return next;
        }
        return prev;
      });
    }
  }, [wallet, uid]);

  useEffect(() => {
    if (uid && user) {
      setUsersList((prev) => {
        const idx = prev.findIndex((u) => u.email === user.email);
        if (idx >= 0) {
          const next = [...prev];
          if (next[idx].uid !== uid || next[idx].ign !== ign) {
            next[idx] = { ...next[idx], uid, ign };
            if (typeof window !== "undefined" && window.localStorage) {
              localStorage.setItem("ff_admin_users", JSON.stringify(next));
            }
            return next;
          }
        } else {
          const next = [...prev, { uid, ign, email: user.email, wallet }];
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("ff_admin_users", JSON.stringify(next));
          }
          return next;
        }
        return prev;
      });
    }
  }, [uid, ign, user, wallet]);

  const addCategory = (c: string) => {
    setCategoriesState((prev) => {
      if (prev.includes(c)) return prev;
      const next = [...prev, c];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_categories", JSON.stringify(next));
      }
      return next;
    });
  };

  const deleteCategory = (c: string) => {
    setCategoriesState((prev) => {
      const next = prev.filter((x) => x !== c);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_categories", JSON.stringify(next));
      }
      return next;
    });
  };

  const addRulesTemplate = (t: Omit<AdminRulesTemplate, "id">) => {
    setRulesTemplates((prev) => {
      const newTemplate = { ...t, id: "r_" + Math.random().toString(36).substring(2, 9) };
      const next = [...prev, newTemplate];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_rules_templates", JSON.stringify(next));
      }
      return next;
    });
  };

  const updateRulesTemplate = (id: string, partial: Partial<AdminRulesTemplate>) => {
    setRulesTemplates((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, ...partial } : x));
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_rules_templates", JSON.stringify(next));
      }
      return next;
    });
  };

  const deleteRulesTemplate = (id: string) => {
    setRulesTemplates((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_rules_templates", JSON.stringify(next));
      }
      return next;
    });
  };

  const addBanner = (b: Omit<AdminBanner, "id">) => {
    setBanners((prev) => {
      const newBanner = { ...b, id: "b_" + Math.random().toString(36).substring(2, 9) };
      const next = [...prev, newBanner];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_banners", JSON.stringify(next));
      }
      return next;
    });
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_banners", JSON.stringify(next));
      }
      return next;
    });
  };

  const addTournament = (newT: Tournament) => {
    setTournamentsState((prev) => {
      const next = [newT, ...prev];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_tournaments", JSON.stringify(next));
      }
      return next;
    });
  };

  const updateTournament = (id: string, partialT: Partial<Tournament>) => {
    setTournamentsState((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, ...partialT } : x));
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_tournaments", JSON.stringify(next));
      }
      return next;
    });
  };

  const deleteTournament = (id: string) => {
    setTournamentsState((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_tournaments", JSON.stringify(next));
      }
      return next;
    });
  };

  const payUser = (userIdOrIgn: string, amount: number, description: string): boolean => {
    let success = false;
    setUsersList((prev) => {
      const idx = prev.findIndex(
        (u) =>
          u.uid === userIdOrIgn ||
          u.ign.toLowerCase() === userIdOrIgn.toLowerCase() ||
          u.email.toLowerCase() === userIdOrIgn.toLowerCase(),
      );
      if (idx >= 0) {
        const next = [...prev];
        const userToPay = next[idx];
        const newBal = userToPay.wallet + amount;
        next[idx] = { ...userToPay, wallet: newBal };
        success = true;

        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("ff_admin_users", JSON.stringify(next));
        }

        // If paid user is currently logged-in user, trigger updates
        if (userToPay.uid === uid || userToPay.ign === ign) {
          setWalletState(newBal);
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("ff_wallet_balance", newBal.toString());
          }

          const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          };
          const timeStr = new Date().toLocaleTimeString("en-US", options);
          const dateStr = "Today • " + timeStr;

          const newTx: Transaction = {
            t: amount >= 0 ? "Reward Paid" : "Charge",
            d: description || "Admin Adjustment",
            a: amount,
            kind: amount >= 0 ? ("in" as const) : ("out" as const),
            when: dateStr,
          };

          setTransactions((prevTx) => {
            const nextTx = [newTx, ...prevTx];
            if (typeof window !== "undefined" && window.localStorage) {
              localStorage.setItem("ff_transactions", JSON.stringify(nextTx));
            }
            return nextTx;
          });
        }
        return next;
      }
      return prev;
    });
    return success;
  };

  const updateUserStatus = (
    uid: string,
    status: "active" | "suspended" | "banned" | "terminated",
    reason?: string,
    suspendedUntil?: string,
  ) => {
    setUsersList((prev) => {
      const next = prev.map((u) => {
        if (u.uid === uid) {
          return {
            ...u,
            status,
            statusReason: reason || "",
            suspendedUntil: status === "suspended" ? suspendedUntil || "" : undefined,
          };
        }
        return u;
      });
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_admin_users", JSON.stringify(next));
      }
      return next;
    });
  };

  useEffect(() => {
    let activeTheme: Theme = "dark";
    if (themeMode === "default") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      activeTheme = systemPrefersDark ? "dark" : "light";
    } else {
      activeTheme = themeMode === "dark" ? "dark" : "light";
    }

    setTheme(activeTheme);
    const root = document.documentElement;
    if (activeTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const setNotifications = (updates: Partial<NotificationsState>) => {
    setNotificationsState((prev) => ({ ...prev, ...updates }));
  };

  const setSecurity = (updates: Partial<SecurityState>) => {
    setSecurityState((prev) => ({ ...prev, ...updates }));
  };

  const addEsportsTeam = (team: EsportsTeam) => {
    setEsportsTeams((prev) => {
      const next = [...prev, team];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_esports_teams", JSON.stringify(next));
      }
      return next;
    });
  };

  const updateEsportsTeam = (id: string, partial: Partial<EsportsTeam>) => {
    setEsportsTeams((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...partial } : t));
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_esports_teams", JSON.stringify(next));
      }
      return next;
    });
  };

  const deleteEsportsTeam = (id: string) => {
    setEsportsTeams((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_esports_teams", JSON.stringify(next));
      }
      return next;
    });
  };

  const addEsportsMatch = (match: EsportsMatch) => {
    setEsportsMatches((prev) => {
      const next = [...prev, match];
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_esports_matches", JSON.stringify(next));
      }
      return next;
    });
  };

  const updateEsportsMatch = (id: string, partial: Partial<EsportsMatch>) => {
    setEsportsMatches((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...partial } : m));
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_esports_matches", JSON.stringify(next));
      }
      return next;
    });
  };

  const deleteEsportsMatch = (id: string) => {
    setEsportsMatches((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("ff_esports_matches", JSON.stringify(next));
      }
      return next;
    });
  };

  const value: AppState = {
    theme,
    themeMode,
    setThemeMode,
    wallet,
    setWallet,
    sidebarOpen,
    setSidebarOpen,
    ign,
    setIgn,
    avatar: ign ? ign.charAt(0).toUpperCase() : "P",
    setAvatar: () => {},
    uid,
    setUid,
    notifications,
    setNotifications,
    security,
    setSecurity,
    joinedTournaments,
    joinTournament,
    transactions,
    addTransaction,

    // Auth fields
    user,
    isLoggedIn: !!user,
    login,
    signup,
    logout,
    completeOnboarding,

    // Admin fields & handlers
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

    // Esports Panel exports
    esportsTeams,
    addEsportsTeam,
    updateEsportsTeam,
    deleteEsportsTeam,
    esportsMatches,
    addEsportsMatch,
    updateEsportsMatch,
    deleteEsportsMatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
