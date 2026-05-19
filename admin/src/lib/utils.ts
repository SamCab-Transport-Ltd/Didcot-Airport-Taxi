import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGBP(amount: number, opts: { withSymbol?: boolean } = {}) {
  const { withSymbol = true } = opts;
  return new Intl.NumberFormat("en-GB", {
    style: withSymbol ? "currency" : "decimal",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...opts,
  }).format(date);
}

export function formatRelative(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  return `${days}d ago`;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-status-pending/15 text-[#F4B400] ring-1 ring-[#F4B400]/30",
    confirmed: "bg-status-confirmed/15 text-[#3D8BFD] ring-1 ring-[#3D8BFD]/30",
    assigned: "bg-status-assigned/15 text-[#A56CFF] ring-1 ring-[#A56CFF]/30",
    in_progress: "bg-status-in_progress/15 text-[#22D3EE] ring-1 ring-[#22D3EE]/30",
    completed: "bg-status-completed/15 text-[#22C55E] ring-1 ring-[#22C55E]/30",
    cancelled: "bg-status-cancelled/15 text-[#9CA3AF] ring-1 ring-[#9CA3AF]/30",
  };
  return map[status] || "bg-bg-surface text-ink-secondary";
}

export function titleCase(s: string): string {
  return s.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
