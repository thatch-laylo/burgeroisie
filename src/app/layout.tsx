import type { Metadata } from "next";
import { Space_Grotesk, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Burgeroisie | NYC Burger Scoreboard",
  description:
    "The definitive ranking of NYC's best burgers, scored by a crew of dedicated burger connoisseurs.",
  openGraph: {
    title: "Burgeroisie",
    description: "NYC's most elite burger review crew.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-dvh bg-bg-primary text-text-primary font-sans antialiased">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
