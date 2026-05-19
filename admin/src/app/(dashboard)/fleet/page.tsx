"use client";

import { useState } from "react";
import useSWR from "swr";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import type { Vehicle } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface FormState {
  id?: number;
  code: string;
  name: string;
  tagline: string;
  passengers: number;
  luggage: string;
  features: string;
  multiplier: number;
  sort_order: number;
  is_active: boolean;
}

const empty: FormState = {
  code: "",
  name: "",
  tagline: "",
  passengers: 4,
  luggage: "",
  features: "",
  multiplier: 1,
  sort_order: 100,
  is_active: true,
};

export default function FleetPage() {
  const { data, mutate } = useSWR<Vehicle[]>("/vehicles", apiFetcher);
  const toast = useToast();
  const [form, setForm] = useState<FormState | null>(null);

  function startCreate() {
    setForm({ ...empty });
  }
  function startEdit(v: Vehicle) {
    setForm({
      id: v.id,
      code: v.code,
      name: v.name,
      tagline: v.tagline ?? "",
      passengers: v.passengers,
      luggage: v.luggage ?? "",
      features: v.features.join(", "),
      multiplier: v.multiplier,
      sort_order: v.sort_order,
      is_active: v.is_active,
    });
  }

  async function save() {
    if (!form) return;
    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      tagline: form.tagline.trim() || null,
      passengers: form.passengers,
      luggage: form.luggage.trim() || null,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
      multiplier: form.multiplier,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };
    try {
      if (form.id) {
        await api(`/vehicles/${form.id}`, { method: "PATCH", body: payload });
        toast("Vehicle updated");
      } else {
        await api("/vehicles", { method: "POST", body: payload });
        toast("Vehicle created");
      }
      setForm(null);
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await api(`/vehicles/${id}`, { method: "DELETE" });
      toast("Vehicle deleted");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Fleet"
        description="Vehicle classes, capacities and pricing multipliers."
        actions={
          <button onClick={startCreate} className="btn-primary">
            <Plus className="h-4 w-4" /> New vehicle
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((v) => (
          <div key={v.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">{v.code}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{v.name}</h3>
                {v.tagline && <p className="text-sm text-ink-secondary">{v.tagline}</p>}
              </div>
              <span className={`badge ${v.is_active ? "bg-status-completed/15 text-[#22C55E]" : "bg-bg-surface text-ink-muted"}`}>
                {v.is_active ? "Active" : "Hidden"}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-ink-muted">Passengers</dt>
                <dd className="font-mono">{v.passengers}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Luggage</dt>
                <dd>{v.luggage ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Multiplier</dt>
                <dd className="font-mono">×{v.multiplier.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Sort</dt>
                <dd className="font-mono">{v.sort_order}</dd>
              </div>
            </dl>
            {v.features.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {v.features.map((f) => (
                  <span key={f} className="badge bg-bg-surface text-ink-secondary ring-1 ring-bg-border">
                    {f}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5 flex items-center gap-2 border-t border-bg-border pt-4">
              <button onClick={() => startEdit(v)} className="btn-secondary">
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button onClick={() => remove(v.id)} className="btn-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title={form?.id ? "Edit vehicle" : "New vehicle"}
        size="lg"
      >
        {form && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="field-label">Code</label>
              <input
                className="field"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="saloon"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="field-label">Name</label>
              <input
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Saloon"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Tagline</label>
              <input
                className="field"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Up to 4 passengers"
              />
            </div>
            <div>
              <label className="field-label">Passengers</label>
              <input
                type="number"
                className="field"
                value={form.passengers}
                onChange={(e) => setForm({ ...form, passengers: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="field-label">Luggage</label>
              <input
                className="field"
                value={form.luggage}
                onChange={(e) => setForm({ ...form, luggage: e.target.value })}
                placeholder="2 large + 2 carry"
              />
            </div>
            <div>
              <label className="field-label">Multiplier</label>
              <input
                type="number"
                step="0.01"
                className="field"
                value={form.multiplier}
                onChange={(e) => setForm({ ...form, multiplier: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="field-label">Sort order</label>
              <input
                type="number"
                className="field"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Features (comma separated)</label>
              <input
                className="field"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="Free wait, Card payments, Trip tracking"
              />
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-bg-border bg-bg-surface accent-accent"
              />
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
