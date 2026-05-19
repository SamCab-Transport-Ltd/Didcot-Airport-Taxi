"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  Loader2,
  PiggyBank,
  Plane,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { apiFetcher } from "@/lib/api";
import type { Booking, OverviewStats } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatGBP } from "@/lib/utils";
import { OverviewChart } from "@/components/charts/OverviewChart";

export default function OverviewPage() {
  const { data: stats } = useSWR<OverviewStats>("/stats/overview", apiFetcher, {
    refreshInterval: 30_000,
  });
  const { data: recent } = useSWR<Booking[]>("/bookings?limit=8", apiFetcher, {
    refreshInterval: 30_000,
  });

  if (!stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Bookings today",
      value: stats.bookings_today.toString(),
      sub: `${stats.bookings_week} this week`,
      icon: Ticket,
    },
    {
      label: "Revenue today",
      value: formatGBP(stats.revenue_today),
      sub: `${formatGBP(stats.revenue_week)} this week`,
      icon: PiggyBank,
    },
    {
      label: "Pending action",
      value: stats.pending_bookings.toString(),
      sub: `${stats.upcoming_24h} pickups next 24h`,
      icon: CalendarClock,
    },
    {
      label: "Customers",
      value: stats.customers_total.toString(),
      sub: "Lifetime",
      icon: Users,
    },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Operational pulse for the Didcot Airport Taxi platform."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                  {k.label}
                </span>
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{k.value}</p>
              <p className="mt-1 text-xs text-ink-secondary">{k.sub}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Bookings (14 days)</h2>
              <p className="text-xs text-ink-muted">Booking volume and revenue trend</p>
            </div>
            <TrendingUp className="h-4 w-4 text-ink-muted" />
          </div>
          <OverviewChart data={stats.bookings_last_14d} />
        </div>

        <div className="card p-5">
          <h2 className="font-display text-base font-semibold">Status mix</h2>
          <p className="mb-4 text-xs text-ink-muted">All-time bookings by status</p>
          <ul className="space-y-2">
            {Object.entries(stats.bookings_by_status).length === 0 && (
              <li className="text-sm text-ink-muted">No bookings yet.</li>
            )}
            {Object.entries(stats.bookings_by_status).map(([status, count]) => (
              <li key={status} className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2">
                <StatusBadge status={status} />
                <span className="font-mono text-sm text-ink-primary">{count}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-bg-border bg-bg-surface/40 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Plane className="h-4 w-4 text-accent" /> Total revenue
            </div>
            <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
              {formatGBP(stats.revenue_total)}
            </p>
            <p className="text-xs text-ink-muted">Across {stats.bookings_total} bookings</p>
          </div>
        </div>
      </section>

      <section className="mt-6 card overflow-hidden">
        <header className="flex items-center justify-between border-b border-bg-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold">Recent bookings</h2>
            <p className="text-xs text-ink-muted">Latest 8 — auto-refreshes every 30s</p>
          </div>
          <Link href="/bookings" className="btn-ghost">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-bg-border bg-bg-surface/40 text-left">
              <tr className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-5 py-3">Ref</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Pickup</th>
                <th className="px-5 py-3 text-right">Fare</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {(recent ?? []).map((b) => (
                <tr key={b.id} className="table-row-hover">
                  <td className="px-5 py-3">
                    <Link
                      href={`/bookings?ref=${b.reference}`}
                      className="font-mono text-xs text-accent"
                    >
                      {b.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{b.customer_name}</p>
                    <p className="text-xs text-ink-muted">{b.customer_phone}</p>
                  </td>
                  <td className="px-5 py-3 text-ink-secondary">
                    <p className="truncate">{b.from_location}</p>
                    <p className="truncate text-xs text-ink-muted">→ {b.to_location}</p>
                  </td>
                  <td className="px-5 py-3 text-ink-secondary">{formatDate(b.pickup_at)}</td>
                  <td className="px-5 py-3 text-right font-mono">{formatGBP(b.fare_total)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
              {(recent ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-ink-muted">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
