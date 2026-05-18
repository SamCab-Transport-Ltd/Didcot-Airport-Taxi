import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-bg-elevated ring-1 ring-bg-border transition-all group-hover:ring-accent">
        <span className="absolute inset-0 rounded-xl bg-accent/0 transition-colors group-hover:bg-accent/10" />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="relative h-5 w-5 text-accent"
          fill="currentColor"
        >
          <path d="M3 16l1.5-4.5A3 3 0 0 1 7.34 9.5h9.32a3 3 0 0 1 2.84 2L21 16v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3z" />
          <circle cx="7.5" cy="17" r="1.4" fill="#0A0A0B" />
          <circle cx="16.5" cy="17" r="1.4" fill="#0A0A0B" />
          <path d="M8 5h8l1 3H7z" />
        </svg>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-base font-semibold tracking-tight text-ink-primary">
            Didcot Airport Taxi
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            by SamCab Transport
          </span>
        </span>
      ) : null}
    </Link>
  );
}
