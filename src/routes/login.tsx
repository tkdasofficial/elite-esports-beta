import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, security } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2FA States
  const [show2FA, setShow2FA] = useState(false);
  const [selected2FAMethod, setSelected2FAMethod] = useState<"email" | "app" | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [mockTwoFactorCode, setMockTwoFactorCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // If either 2FA is enabled globally (from Settings or mock defaults)
      const has2FA = security.twoFactorEmail || security.twoFactorAuthApp;

      if (has2FA) {
        // Automatically default to the first enabled method
        if (security.twoFactorEmail && security.twoFactorAuthApp) {
          setSelected2FAMethod("email"); // Let them choose
        } else if (security.twoFactorEmail) {
          setSelected2FAMethod("email");
        } else {
          setSelected2FAMethod("app");
        }

        // Generate a random 6-digit mock code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setMockTwoFactorCode(code);
        setShow2FA(true);
      } else {
        // Direct login
        login(email);
        const isAdmin =
          email.toLowerCase().includes("admin") || email.toLowerCase().endsWith("@admin.com");
        if (isAdmin) {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/" });
        }
      }
    }, 1000);
  };

  const handleGoogleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Google sign-in directly logs in (no 2FA requirement as it is SSO)
      login("esports.pro@gmail.com");
      navigate({ to: "/" });
    }, 1200);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError("");

    if (twoFactorCode.length !== 6) {
      setTwoFactorError("Code must be exactly 6 digits.");
      return;
    }

    if (twoFactorCode !== mockTwoFactorCode) {
      setTwoFactorError("Invalid verification code. Please check and try again.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email);
      const isAdmin =
        email.toLowerCase().includes("admin") || email.toLowerCase().endsWith("@admin.com");
      if (isAdmin) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-grid h-16 w-16 overflow-hidden rounded-2xl border border-brand/20 bg-black/25 brand-glow">
            <img src="/icon.svg" alt="Elite eSports Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="font-display text-4xl font-black tracking-wider text-gradient-brand">
            Elite eSports
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            The ultimate battleground for Free Fire pro players.
          </p>
        </div>

        {/* 2FA UI */}
        {show2FA ? (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="text-center space-y-1.5">
              <div className="inline-grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="font-display text-lg font-black tracking-wide">
                Two-Factor Security Check
              </h2>
              <p className="text-xs text-muted-foreground">
                Your account is secured with 2FA. Please verify your identity.
              </p>
            </div>

            {/* Method Selectors (Visible if both are enabled) */}
            {security.twoFactorEmail && security.twoFactorAuthApp && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-2 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSelected2FAMethod("email");
                    setTwoFactorCode("");
                    setTwoFactorError("");
                  }}
                  className={`py-2 text-[11px] font-black tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selected2FAMethod === "email"
                      ? "bg-brand text-brand-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" /> Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected2FAMethod("app");
                    setTwoFactorCode("");
                    setTwoFactorError("");
                  }}
                  className={`py-2 text-[11px] font-black tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selected2FAMethod === "app"
                      ? "bg-brand text-brand-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> Auth App
                </button>
              </div>
            )}

            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                  {selected2FAMethod === "email"
                    ? "Verify Email Secure Code"
                    : "Authenticator App 6-Digit Pin"}
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 192834"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-11 pr-4 py-3.5 text-center text-lg font-black tracking-[0.4em] font-mono text-foreground outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {twoFactorError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{twoFactorError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={twoFactorCode.length !== 6 || loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-display text-sm font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98] disabled:opacity-40"
              >
                Verify & Secure Login
              </button>

              <button
                type="button"
                onClick={() => setShow2FA(false)}
                className="w-full text-center text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                &larr; Back to login
              </button>
            </form>
          </div>
        ) : (
          /* Credentials Login form */
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="font-display text-xl font-black tracking-wider">Log In</h2>
              <p className="text-[11px] text-muted-foreground">
                Enter your details to rejoin the elite lobby.
              </p>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="e.g. pro.gamer@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-bold text-brand hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-10 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-display text-sm font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98] disabled:opacity-40"
              >
                {loading ? "Logging in..." : "Log In"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center py-2">
              <span className="absolute inset-x-0 h-px bg-border" />
              <span className="relative bg-card px-3.5 text-[9px] font-black text-muted-foreground tracking-widest">
                Or Connect Via
              </span>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface-2 py-3 text-xs font-black tracking-wider text-foreground hover:bg-surface transition-colors active:scale-[0.98] disabled:opacity-40"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google Account
            </button>

            {/* Redirect to Sign Up */}
            <div className="text-center text-[11px] text-muted-foreground">
              New to Elite eSports?{" "}
              <Link to="/signup" className="font-bold text-brand hover:underline">
                Sign Up &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Footer info links */}
        <div className="flex items-center justify-center gap-4 text-[9px] text-muted-foreground font-black tracking-widest">
          <Link to="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
