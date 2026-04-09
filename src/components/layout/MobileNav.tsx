"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/queue", label: "Next Up", icon: "\u{1F4CD}" },
  { href: "/scoreboard", label: "Ranks", icon: "\u{1F3C6}" },
  { href: "/visits/new", label: "Add", icon: "\u{2795}", isAction: true },
  { href: "/visits", label: "Visits", icon: "\u{1F4CB}" },
  { href: "/members", label: "Crew", icon: "\u{1F465}" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-bg-primary/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          if (tab.isAction) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold text-2xl shadow-lg shadow-accent-gold/30 transition-transform active:scale-95"
              >
                {tab.icon}
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors ${
                isActive
                  ? "text-accent-gold"
                  : "text-text-muted"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
