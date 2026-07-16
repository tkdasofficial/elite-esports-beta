import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Joystick,
  Hash,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useApp();

  const [legalName, setLegalName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ign, setIgn] = useState("");
  const [uid, setUid] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !legalName.trim() ||
      !dob ||
      !phone.trim() ||
      !address.trim() ||
      !ign.trim() ||
      !uid.trim()
    ) {
      setError("Please fill out all identity and contact fields.");
      return;
    }

    // Phone format check: ensure there is a country code prefix (e.g. +91 or +1)
    if (!phone.startsWith("+") || phone.length < 10) {
      setError("Phone number must include Country Code prefix (e.g. +91 9876543210).");
      return;
    }

    // UID format check: only digits
    if (!/^\d+$/.test(uid.trim())) {
      setError("Free Fire Player UID must contain digits only.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      completeOnboarding({
        legalName: legalName.trim(),
        dob,
        phone: phone.trim(),
        address: address.trim(),
        ign: ign.trim(),
        uid: uid.trim(),
      });
      navigate({ to: "/" });
    }, 1500);
  };

  const handleFillDemoOnboarding = () => {
    setLegalName("Tushar Kanti Das");
    setDob("2002-05-18");
    setPhone("+91 8892014852");
    setAddress("Sector 5, Salt Lake City, Kolkata, West Bengal - 700091");
    setIgn("ViperKingOP");
    setUid("49210482");
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground px-4 py-8 pb-16">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
        {/* Onboarding Header */}
        <div className="text-center space-y-2">
          <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 border border-brand/30 text-brand">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-black tracking-wider text-gradient-brand">
            Get Started
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Please register your authentic identity documents and Gamer tags. All profile details
            must match your official KYC documents.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="border-b border-border pb-3.5 flex items-center justify-between">
            <h2 className="font-display text-sm font-black tracking-wider text-foreground">
              Official KYC & Gamer Setup
            </h2>
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-brand">
              Step 1 of 1
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Legal Name */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                Full Legal Name <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="As written on legal identity documents"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                Date of Birth <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                />
              </div>
              <p className="mt-1 text-[9px] text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3 text-brand shrink-0" /> Date must exactly match your
                National Identity ID Card.
              </p>
            </div>

            {/* Phone (WhatsApp Linked) */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                WhatsApp Phone Number <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. +91 9876543210 (with Country Code)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                Full Residential Address <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  placeholder="House No, Street Name, City, State, ZIP code"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors resize-none"
                />
              </div>
            </div>

            {/* Gamer tag setups */}
            <div className="border-t border-border pt-4 mt-6 space-y-4">
              <span className="block text-[10px] font-black text-brand tracking-widest">
                Esports Gamer Tag Details
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* IGN */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                    Gamer IGN <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <Joystick className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. ProViper"
                      value={ign}
                      onChange={(e) => setIgn(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                {/* Player UID */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5">
                    Free Fire UID <span className="text-brand">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. 52841092"
                      value={uid}
                      onChange={(e) => setUid(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs font-bold text-foreground outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-success/15 text-success text-xs font-bold text-center brand-glow">
                <CheckCircle2 className="h-4 w-4 animate-bounce" /> Profile verified! Launching
                lobby...
              </div>
            ) : (
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-display text-sm font-black tracking-wider text-brand-foreground brand-glow transition-all active:scale-[0.98]"
              >
                Complete Identity Setup &rarr;
              </button>
            )}
          </form>

          {/* Fill sandbox default profiles button */}
          <div className="pt-2">
            <button
              onClick={handleFillDemoOnboarding}
              className="w-full rounded-xl border border-dashed border-border p-3 flex items-center justify-between bg-surface hover:bg-surface-2 transition-colors"
            >
              <div className="text-left">
                <span className="block text-[8px] tracking-wider font-bold text-muted-foreground">
                  Sandbox autofill
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Autofill legal KYC profile
                </span>
              </div>
              <Sparkles className="h-4 w-4 text-brand animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
