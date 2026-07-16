import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Recovery credentials states
  const [otp, setOtp] = useState("");
  const [mockOtp, setMockOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Generate an 8-digit mock OTP code for recovery
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      setMockOtp(code);
      setStep(2);
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");

    if (!otp.trim() || !newPassword || !confirmPassword) {
      setRecoveryError("Please fill out all fields.");
      return;
    }

    if (otp.length !== 8) {
      setRecoveryError("Recovery OTP code must be exactly 8 digits.");
      return;
    }

    if (otp !== mockOtp) {
      setRecoveryError("Invalid OTP. Tap the code button below to use the correct simulated OTP.");
      return;
    }

    if (newPassword.length < 6) {
      setRecoveryError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setRecoveryError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setSuccess(true);

    setTimeout(() => {
      setLoading(false);
      login(email); // Performs auto login directly with recovered email
      navigate({ to: "/" }); // Go straight to lobby
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 border-2 border-brand/40 text-3xl brand-glow">
            <KeyRound className="h-8 w-8 text-brand" />
          </div>
          <h1 className="font-display text-4xl font-black tracking-wider text-gradient-brand">
            Elite eSports
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Gamer account recovery and credentials override.
          </p>
        </div>

        {step === 1 ? (
          /* Step 1: Input Email */
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="font-display text-xl font-black tracking-wider">Reset Credentials</h2>
              <p className="text-[11px] text-muted-foreground">
                Enter your registered email to request an 8-digit OTP.
              </p>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="e.g. viper.esports@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                  />
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
                {loading ? "Generating Code..." : "Request Recovery OTP"}{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="text-center text-[11px] text-muted-foreground">
              Remembered your credentials?{" "}
              <Link to="/login" className="font-bold text-brand hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          /* Step 2: 8-digit OTP, New Password and Confirm */
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="text-center space-y-1.5">
              <div className="inline-grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-black tracking-wider">Reset Password</h2>
              <p className="text-xs text-muted-foreground">
                We generated an 8-digit OTP for recovery of: <br />
                <strong className="text-foreground">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4">
              {/* 8-digit OTP */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                  8-Digit Verification Code (OTP)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="e.g. 94820152"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-sm font-bold font-mono tracking-widest text-foreground outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                  Choose New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {recoveryError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {/* Simulated OTP Display Banner */}
              <div className="p-4 bg-brand/10 border border-brand/25 rounded-xl text-center space-y-1.5">
                <span className="text-[9px] font-black tracking-widest text-brand flex items-center justify-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Simulated Recovery Dispatch Complete
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(mockOtp);
                    setRecoveryError("");
                  }}
                  className="font-mono text-sm font-black px-4 py-1.5 rounded-lg bg-background border border-border text-foreground hover:border-brand transition-colors"
                >
                  Use Code: {mockOtp}
                </button>
                <p className="text-[9px] text-muted-foreground">
                  Tap the simulated 8-digit code to apply.
                </p>
              </div>

              {success ? (
                <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-success/15 text-success text-xs font-bold text-center brand-glow">
                  <Check className="h-4 w-4 animate-bounce" /> Password changed! Auto Logging in...
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-display text-sm font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98]"
                >
                  Confirm & Auto Login
                </button>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                &larr; Request code again
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
