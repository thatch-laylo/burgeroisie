export function Card({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-bg-card p-5 ${
        hover
          ? "transition-all duration-300 hover:border-accent-gold/20 hover:shadow-lg hover:shadow-accent-gold/5 hover:-translate-y-0.5"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
