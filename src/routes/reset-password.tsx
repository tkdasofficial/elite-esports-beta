import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Check, KeyRound, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [suggestedOtp, setSuggestedOtp] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to load the last generated OTP from settings page
    const lastOtp = localStorage.getItem("reset_password_otp");
    if (lastOtp) {
      setSuggestedOtp(lastOtp);
    }
  }, []);

  const handleRequestNewOtp = () => {
    const randomOtp = Math.floor(10000000 + Math.random() * 90000000).toString();
    localStorage.setItem("reset_password_otp", randomOtp);
    setSuggestedOtp(randomOtp);
    setError("");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || !newPassword || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (otp.trim().length !== 8) {
      setError("OTP must be exactly an 8-digit number.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Reset succeeded
    setSuccess(true);
    localStorage.removeItem("reset_password_otp"); // Clean up

    setTimeout(() => {
      // Redirect to app home page after successful reset
      navigate({ to: "/" });
    }, 2000);
  };

  return (
    <AppShell hideTopBar>
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          to="/settings"
          className="grid h-10 w-10 place-items-center rounded-full bg-surface-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-black tracking-wider">Reset Password</h1>
      </div>

      <div className="px-4 py-2 max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="font-display text-lg font-black tracking-wide">Secure Recovery</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter the 8-digit verification code along with your new credentials.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
            {/* OTP Input */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                8-Digit OTP Code
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. 84920481"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-sm font-bold font-mono tracking-widest text-foreground outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-success/15 text-success text-xs font-bold text-center brand-glow">
                <Check className="h-4 w-4 animate-bounce" /> Credentials updated! Redirecting to
                lobby...
              </div>
            ) : (
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-display text-sm font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98]"
              >
                Reset Password
              </button>
            )}
          </form>
        </div>
      </div>
    </AppShell>
  );
}
