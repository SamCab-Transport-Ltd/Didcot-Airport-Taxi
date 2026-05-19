"use client";

import { useState } from "react";
import useSWR from "swr";
import { Activity, Trash2 } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import type { TrackingEvent } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export default function TrackingPage() {
  const [filter, setFilter] = useState("");
  const { data, mutate } = useSWR<TrackingEvent[]>(
    `/tracking/events?limit=200${filter ? `&event=${encodeURIComponent(filter)}` : ""}`,
    apiFetcher,
    { refreshInterval: 15_000 },
  );
  const toast = useToast();

  async function clearAll() {
    if (!confirm("Delete ALL tracking events? This cannot be undone.")) return;
    try {
      await api("/tracking/events", { method: "DELETE" });
      toast("Events cleared");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Tracking events"
        description="Server-side event stream from the public site (auto-refreshing)."
        actions={
          <button onClick={clearAll} className="btn-danger">
            <Trash2 className="h-4 w-4" /> Clear all
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <input
          className="field max-w-xs"
          placeholder="Filter by event name…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {(data ?? []).length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No events yet"
          description="Visit the public site and trigger an action to see events appear here in real time."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-bg-border bg-bg-surface/40 text-left">
                <tr className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Params</th>
                  <th className="px-4 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {(data ?? []).map((e) => (
                  <tr key={e.id} className="table-row-hover">
                    <td className="px-4 py-3 font-mono text-xs text-accent">{e.event}</td>
                    <td className="px-4 py-3 max-w-[220px] truncate text-ink-secondary">{e.page ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-ink-muted">{e.client_id?.slice(0, 12) ?? "—"}</td>
                    <td className="px-4 py-3">
                      <pre className="max-w-[420px] overflow-x-auto rounded-md bg-bg-surface px-2 py-1 text-[11px] text-ink-secondary">
                        {JSON.stringify(e.params, null, 0)}
                      </pre>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-ink-muted">{formatDate(e.created_at)}</td>
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
