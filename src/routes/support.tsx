import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  Instagram,
  Facebook,
  Youtube,
  Globe,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/support")({
  component: SupportPage,
});

const FAQ = [
  {
    q: "How do I book an Official eSports Match slot?",
    a: "Official matches are managed directly by the admin. The team leader must contact the admin via WhatsApp or official social channels with their team roster (4 main players + 1 backup) to secure a slot.",
  },
  {
    q: "What is the team requirement for Official matches?",
    a: "You must have a team of exactly 5 players: 4 active players and 1 backup (extra player). Only the team leader can submit details.",
  },
  {
    q: "How do I withdraw my winnings?",
    a: "Go to Wallet → Withdraw and enter your UPI or bank details.",
  },
  { q: "When does the leaderboard reset?", a: "Every Monday at 00:00 IST." },
  { q: "What happens if I miss a match?", a: "Entry fees are non-refundable for no-shows." },
  {
    q: "How is prize money credited?",
    a: "Automatically within 30 minutes of match verification.",
  },
];

const SOCIALS = [
  {
    name: "WhatsApp",
    url: "https://wa.me/919999999999",
    color: "bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366]",
    desc: "Direct Admin Booking",
    icon: MessageCircle,
  },
  {
    name: "Instagram",
    url: "https://instagram.com/elite_esports",
    color: "bg-[#E1306C]/15 hover:bg-[#E1306C]/25 text-[#E1306C]",
    desc: "Match Highlights",
    icon: Instagram,
  },
  {
    name: "Facebook",
    url: "https://facebook.com/elite_esports",
    color: "bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2]",
    desc: "Community Hub",
    icon: Facebook,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/c/elite_esports",
    color: "bg-[#FF0000]/15 hover:bg-[#FF0000]/25 text-[#FF0000]",
    desc: "Live Streams",
    icon: Youtube,
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/elite_esports",
    color: "bg-foreground/10 hover:bg-foreground/20 text-foreground",
    desc: "Official Updates",
    // Render text "X" inside icon area
    icon: () => <span className="font-display font-black text-sm">X</span>,
  },
  {
    name: "Website",
    url: "https://elite-esports.com",
    color: "bg-brand/15 hover:bg-brand/25 text-brand",
    desc: "Portals & Tourneys",
    icon: Globe,
  },
];

function SupportPage() {
  return (
    <AppShell hideTopBar>
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-surface-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-black tracking-wider">Help & Support</h1>
      </div>

      <div className="px-4 py-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-black tracking-wider text-brand">
            Official Match Booking
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Team leaders need to contact the admin directly to book slots for Official matches. Make
            sure to provide details for exactly <strong>4 main players & 1 backup player</strong> (5
            players total per team).
          </p>
        </div>
      </div>

      {/* Admin Social Contacts */}
      <div className="mt-4 px-4">
        <h2 className="font-display text-sm font-bold tracking-wider text-muted-foreground mb-3">
          Contact Admin & Social Media
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {SOCIALS.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all hover:scale-[1.02]"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${social.color}`}
                >
                  {typeof Icon === "function" ? <Icon /> : <Icon className="h-5 w-5" />}
                </span>
                <div className="min-w-0">
                  <div className="font-display text-xs font-black tracking-wider text-foreground">
                    {social.name}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground">{social.desc}</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-6 px-4 pb-28">
        <h2 className="font-display text-sm font-bold tracking-wider text-muted-foreground mb-3">
          Frequently Asked Questions
        </h2>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {FAQ.map((f, i) => (
            <li key={i} className="p-4 hover:bg-surface-2/30 transition-colors">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="font-display text-sm font-black tracking-wider text-foreground/90">
                    {f.q}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.a}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
