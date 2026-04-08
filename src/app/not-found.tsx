import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span className="text-6xl mb-4">&#x1F354;</span>
      <h1 className="font-display text-4xl font-bold mb-2">404</h1>
      <p className="text-text-secondary mb-6">
        This burger doesn&apos;t exist. Yet.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent-gold px-6 py-3 font-display font-bold text-bg-primary transition-all hover:brightness-110"
      >
        Back to Home
      </Link>
    </div>
  );
}
