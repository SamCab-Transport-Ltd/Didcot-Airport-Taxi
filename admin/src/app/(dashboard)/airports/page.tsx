"use client";

import { useState } from "react";
import useSWR from "swr";
import { Pencil, Plane, Plus, Trash2 } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import type { Airport } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatGBP } from "@/lib/utils";

interface F {
  id?: number;
  slug: string;
  name: string;
  short_name: string;
  iata: string;
  city: string;
  distance_miles: number;
  drive_time_mins: number;
  fare_from: number;
  description: string;
  highlights: string;
  is_active: boolean;
  sort_order: number;
}

const empty: F = {
  slug: "",
  name: "",
  short_name: "",
  iata: "",
  city: "",
  distance_miles: 0,
  drive_time_mins: 0,
  fare_from: 0,
  description: "",
  highlights: "",
  is_active: true,
  sort_order: 100,
};

export default function AirportsPage() {
  const { data, mutate } = useSWR<Airport[]>("/airports", apiFetcher);
  const toast = useToast();
  const [form, setForm] = useState<F | null>(null);

  function startEdit(a: Airport) {
    setForm({
      id: a.id,
      slug: a.slug,
      name: a.name,
      short_name: a.short_name,
      iata: a.iata,
      city: a.city,
      distance_miles: a.distance_miles,
      drive_time_mins: a.drive_time_mins,
      fare_from: a.fare_from,
      description: a.description,
      highlights: a.highlights.join("\n"),
      is_active: a.is_active,
      sort_order: a.sort_order,
    });
  }

  async function save() {
    if (!form) return;
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      short_name: form.short_name.trim(),
      iata: form.iata.trim().toUpperCase(),
      city: form.city.trim(),
      distance_miles: form.distance_miles,
      drive_time_mins: form.drive_time_mins,
      fare_from: form.fare_from,
      description: form.description.trim(),
      highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      is_active: form.is_active,
      sort_order: form.sort_order,
    };
    try {
      if (form.id) {
        await api(`/airports/${form.id}`, { method: "PATCH", body: payload });
        toast("Airport updated");
      } else {
        await api("/airports", { method: "POST", body: payload });
        toast("Airport created");
      }
      setForm(null);
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this airport?")) return;
    try {
      await api(`/airports/${id}`, { method: "DELETE" });
      toast("Airport deleted");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Airports"
        description="Landing pages, distances, drive times and starting fares."
        actions={
          <button onClick={() => setForm({ ...empty })} className="btn-primary">
            <Plus className="h-4 w-4" /> New airport
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-bg-border bg-bg-surface/40 text-left">
              <tr className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-4 py-3">Airport</th>
                <th className="px-4 py-3">IATA</th>
                <th className="px-4 py-3 text-right">Miles</th>
                <th className="px-4 py-3 text-right">Drive</th>
                <th className="px-4 py-3 text-right">From</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {(data ?? []).map((a) => (
                <tr key={a.id} className="table-row-hover">
                  <td className="px-4 py-3">
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-ink-muted">{a.city} · /airports/{a.slug}</p>
                  </td>
                  <td className="px-4 py-3 font-mono">{a.iata}</td>
                  <td className="px-4 py-3 text-right font-mono">{a.distance_miles}</td>
                  <td className="px-4 py-3 text-right font-mono">{a.drive_time_mins}m</td>
                  <td className="px-4 py-3 text-right font-mono">{formatGBP(a.fare_from)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${a.is_active ? "bg-status-completed/15 text-[#22C55E]" : "bg-bg-surface text-ink-muted"}`}>
                      {a.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => startEdit(a)} className="btn-ghost">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(a.id)} className="btn-danger">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-ink-muted">
                    <Plane className="mx-auto mb-2 h-5 w-5" /> No airports configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit airport" : "New airport"} size="lg">
        {form && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Slug</label>
              <input className="field" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Name</label>
              <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Short name</label>
              <input className="field" value={form.short_name} onChange={(e) => setForm({ ...form, short_name: e.target.value })} />
            </div>
            <div>
              <label className="field-label">IATA</label>
              <input className="field" value={form.iata} onChange={(e) => setForm({ ...form, iata: e.target.value })} />
            </div>
            <div>
              <label className="field-label">City</label>
              <input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Sort order</label>
              <input type="number" className="field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div>
              <label className="field-label">Distance (miles)</label>
              <input type="number" className="field" value={form.distance_miles} onChange={(e) => setForm({ ...form, distance_miles: Number(e.target.value) })} />
            </div>
            <div>
              <label className="field-label">Drive time (mins)</label>
              <input type="number" className="field" value={form.drive_time_mins} onChange={(e) => setForm({ ...form, drive_time_mins: Number(e.target.value) })} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Fare from (GBP)</label>
              <input type="number" step="0.01" className="field" value={form.fare_from} onChange={(e) => setForm({ ...form, fare_from: Number(e.target.value) })} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Description</label>
              <textarea rows={3} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Highlights (one per line)</label>
              <textarea rows={4} className="field" value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-accent" />
              <span className="text-sm">Visible on public site</span>
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button className="btn-secondary" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
