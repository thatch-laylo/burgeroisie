"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/visits", label: "Visits" },
  { href: "/members", label: "Crew" },
  { href: "/stats", label: "Stats" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">&#x1F354;</span>
          <span className="font-display text-xl font-bold tracking-tight text-accent-gold">
            Burgeroisie
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-accent-gold"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/visits/new"
            className="ml-2 rounded-lg bg-accent-gold px-4 py-2 text-sm font-bold text-bg-primary transition-all hover:brightness-110"
          >
            + New Visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
