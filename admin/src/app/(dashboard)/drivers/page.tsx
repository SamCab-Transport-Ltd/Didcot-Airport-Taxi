"use client";

import { useState } from "react";
import useSWR from "swr";
import { Pencil, Plus, Trash2, UserSquare2 } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import type { Driver, Vehicle } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";

interface F {
  id?: number;
  name: string;
  phone: string;
  email: string;
  license_number: string;
  vehicle_id: number | null;
  is_active: boolean;
  notes: string;
}
const empty: F = { name: "", phone: "", email: "", license_number: "", vehicle_id: null, is_active: true, notes: "" };

export default function DriversPage() {
  const { data, mutate } = useSWR<Driver[]>("/drivers", apiFetcher);
  const { data: vehicles } = useSWR<Vehicle[]>("/vehicles", apiFetcher);
  const toast = useToast();
  const [form, setForm] = useState<F | null>(null);

  function startEdit(d: Driver) {
    setForm({
      id: d.id,
      name: d.name,
      phone: d.phone ?? "",
      email: d.email ?? "",
      license_number: d.license_number ?? "",
      vehicle_id: d.vehicle_id,
      is_active: d.is_active,
      notes: d.notes ?? "",
    });
  }

  async function save() {
    if (!form) return;
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      license_number: form.license_number.trim() || null,
      vehicle_id: form.vehicle_id,
      is_active: form.is_active,
      notes: form.notes.trim() || null,
    };
    try {
      if (form.id) {
        await api(`/drivers/${form.id}`, { method: "PATCH", body: payload });
        toast("Driver updated");
      } else {
        await api("/drivers", { method: "POST", body: payload });
        toast("Driver created");
      }
      setForm(null);
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this driver?")) return;
    try {
      await api(`/drivers/${id}`, { method: "DELETE" });
      toast("Driver deleted");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Drivers"
        description="Operator roster — assign to vehicles and bookings."
        actions={
          <button onClick={() => setForm({ ...empty })} className="btn-primary">
            <Plus className="h-4 w-4" /> New driver
          </button>
        }
      />

      {(data ?? []).length === 0 ? (
        <EmptyState
          icon={UserSquare2}
          title="No drivers added yet"
          description="Add drivers to start assigning jobs from the bookings list."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="border-b border-bg-border bg-bg-surface/40 text-left">
              <tr className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Licence</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border">
              {(data ?? []).map((d) => {
                const v = vehicles?.find((x) => x.id === d.vehicle_id);
                return (
                  <tr key={d.id} className="table-row-hover">
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3 text-ink-secondary">{d.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-secondary">{d.email ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{d.license_number ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-secondary">{v?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${d.is_active ? "bg-status-completed/15 text-[#22C55E]" : "bg-bg-surface text-ink-muted"}`}>
                        {d.is_active ? "Active" : "Off-shift"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => startEdit(d)} className="btn-ghost"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(d.id)} className="btn-danger"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit driver" : "New driver"} size="lg">
        {form && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label">Name</label>
              <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Licence number</label>
              <input className="field" value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Vehicle</label>
              <select
                className="field"
                value={form.vehicle_id ?? ""}
                onChange={(e) =>
                  setForm({ ...form, vehicle_id: e.target.value ? Number(e.target.value) : null })
                }
              >
                <option value="">Unassigned</option>
                {(vehicles ?? []).map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Notes</label>
              <textarea rows={3} className="field" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-accent" />
              <span className="text-sm">Active on roster</span>
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
