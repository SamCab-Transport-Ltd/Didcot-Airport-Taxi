"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Loader2, Search, X } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import type { Booking, BookingStatus } from "@/lib/types";
import { BOOKING_STATUSES } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn, formatDate, formatGBP, titleCase } from "@/lib/utils";

export default function BookingsPage() {
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [q, setQ] = useState("");
  const toast = useToast();

  const params = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("limit", "200");
    if (status !== "all") sp.set("status", status);
    if (q.trim()) sp.set("q", q.trim());
    return sp.toString();
  }, [status, q]);

  const { data, isLoading, mutate } = useSWR<Booking[]>(`/bookings?${params}`, apiFetcher);
  const [selected, setSelected] = useState<Booking | null>(null);

  async function updateStatus(id: number, newStatus: BookingStatus) {
    try {
      await api(`/bookings/${id}`, { method: "PATCH", body: { status: newStatus } });
      toast(`Booking ${titleCase(newStatus)}`, "success");
      mutate();
      setSelected(null);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
    }
  }

  async function deleteBooking(id: number) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await api(`/bookings/${id}`, { method: "DELETE" });
      toast("Booking deleted", "success");
      mutate();
      setSelected(null);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader title="Bookings" description="Search, filter and progress every job." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reference, customer, route…"
            className="field pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", ...BOOKING_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s as BookingStatus | "all")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                status === s
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-bg-border text-ink-secondary hover:border-bg-border hover:bg-bg-surface",
              )}
            >
              {s === "all" ? "All" : titleCase(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-bg-border bg-bg-surface/40 text-left">
              <tr className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Pickup</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3 text-right">Fare</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-ink-muted" />
                  </td>
                </tr>
              )}
              {(data ?? []).map((b) => (
                <tr
                  key={b.id}
                  className="cursor-pointer table-row-hover"
                  onClick={() => setSelected(b)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-accent">{b.reference}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.customer_name}</p>
                    <p className="text-xs text-ink-muted">{b.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">
                    <p className="truncate max-w-[220px]">{b.from_location}</p>
                    <p className="truncate text-xs text-ink-muted max-w-[220px]">→ {b.to_location}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{formatDate(b.pickup_at)}</td>
                  <td className="px-4 py-3 capitalize text-ink-secondary">{b.vehicle_code ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatGBP(b.fare_total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-right text-xs text-ink-muted">{formatDate(b.created_at)}</td>
                </tr>
              ))}
              {!isLoading && (data ?? []).length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-ink-muted">
                    No bookings match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Booking ${selected.reference}` : ""}
        description={selected ? `Created ${formatDate(selected.created_at)}` : ""}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-ink-muted">
                Source: <span className="text-ink-secondary">{selected.source}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="Customer" value={selected.customer_name} />
              <DetailField label="Phone" value={selected.customer_phone} />
              <DetailField label="Email" value={selected.customer_email} />
              <DetailField label="Trip type" value={titleCase(selected.trip_type)} />
              <DetailField label="From" value={selected.from_location} />
              <DetailField label="To" value={selected.to_location} />
              <DetailField label="Pickup" value={formatDate(selected.pickup_at)} />
              <DetailField label="Return" value={selected.return_at ? formatDate(selected.return_at) : "—"} />
              <DetailField label="Passengers" value={String(selected.passengers)} />
              <DetailField label="Luggage" value={String(selected.luggage)} />
              <DetailField label="Vehicle" value={selected.vehicle_code ?? "—"} />
              <DetailField label="Flight" value={selected.flight_number ?? "—"} />
              <DetailField label="Meet & Greet" value={selected.meet_greet ? "Yes" : "No"} />
              <DetailField label="Fare" value={formatGBP(selected.fare_total)} mono />
            </div>

            {selected.notes && (
              <div>
                <p className="field-label">Customer notes</p>
                <p className="rounded-lg border border-bg-border bg-bg-surface p-3 text-sm text-ink-secondary">
                  {selected.notes}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bg-border pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="field-label !mb-0">Set status</span>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value as BookingStatus)}
                  className="field !py-2 !w-auto"
                >
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s} value={s}>{titleCase(s)}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => deleteBooking(selected.id)} className="btn-danger">
                <X className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <p className={cn("text-sm", mono && "font-mono")}>{value}</p>
    </div>
  );
}
