type WordmarkProps = {
  className?: string;
  compact?: boolean;
};

export function Wordmark({ className = "", compact = false }: WordmarkProps) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span
        className={`font-serif tracking-[0.38em] text-gold-soft ${
          compact ? "text-lg" : "text-2xl md:text-3xl"
        }`}
      >
        ANA
      </span>
      <span
        className={`mt-1 uppercase tracking-[0.42em] text-muted ${
          compact ? "text-[9px]" : "text-[10px]"
        }`}
      >
        Beauty Studio
      </span>
    </span>
  );
}
