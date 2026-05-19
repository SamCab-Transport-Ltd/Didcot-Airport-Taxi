"use client";

import useSWR from "swr";
import { Mail, Phone, User } from "lucide-react";
import { apiFetcher } from "@/lib/api";
import type { Customer } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const { data } = useSWR<Customer[]>("/customers", apiFetcher);
  const customers = data ?? [];

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has booked, ranked by recency." />
      {customers.length === 0 ? (
        <EmptyState
          icon={User}
          title="No customers yet"
          description="Customers will appear here automatically as bookings come in."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-bg-border bg-bg-surface/40 text-left">
                <tr className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-right">Bookings</th>
                  <th className="px-4 py-3 text-right">Last booking</th>
                  <th className="px-4 py-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {customers.map((c) => (
                  <tr key={c.id} className="table-row-hover">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {c.email && (
                        <p className="flex items-center gap-2 text-xs">
                          <Mail className="h-3.5 w-3.5 text-ink-muted" /> {c.email}
                        </p>
                      )}
                      {c.phone && (
                        <p className="flex items-center gap-2 text-xs">
                          <Phone className="h-3.5 w-3.5 text-ink-muted" /> {c.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{c.total_bookings}</td>
                    <td className="px-4 py-3 text-right text-ink-secondary">
                      {c.last_booking_at ? formatDate(c.last_booking_at) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-ink-muted">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
