"use client";

import { useState } from "react";
import useSWR from "swr";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import type { Area } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface F {
  id?: number;
  slug: string;
  name: string;
  description: string;
  postcode_prefixes: string;
  is_active: boolean;
  sort_order: number;
}

const empty: F = {
  slug: "",
  name: "",
  description: "",
  postcode_prefixes: "",
  is_active: true,
  sort_order: 100,
};

export default function AreasPage() {
  const { data, mutate } = useSWR<Area[]>("/areas", apiFetcher);
  const toast = useToast();
  const [form, setForm] = useState<F | null>(null);

  function startEdit(a: Area) {
    setForm({
      id: a.id,
      slug: a.slug,
      name: a.name,
      description: a.description,
      postcode_prefixes: a.postcode_prefixes.join(", "),
      is_active: a.is_active,
      sort_order: a.sort_order,
    });
  }

  async function save() {
    if (!form) return;
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      postcode_prefixes: form.postcode_prefixes.split(",").map((s) => s.trim()).filter(Boolean),
      is_active: form.is_active,
      sort_order: form.sort_order,
    };
    try {
      if (form.id) {
        await api(`/areas/${form.id}`, { method: "PATCH", body: payload });
        toast("Area updated");
      } else {
        await api("/areas", { method: "POST", body: payload });
        toast("Area created");
      }
      setForm(null);
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this area?")) return;
    try {
      await api(`/areas/${id}`, { method: "DELETE" });
      toast("Area deleted");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Service areas"
        description="Locations covered with their landing pages and postcodes."
        actions={
          <button onClick={() => setForm({ ...empty })} className="btn-primary">
            <Plus className="h-4 w-4" /> New area
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold">{a.name}</h3>
                <p className="text-xs text-ink-muted">/areas/{a.slug}</p>
              </div>
              <span className={`badge ${a.is_active ? "bg-status-completed/15 text-[#22C55E]" : "bg-bg-surface text-ink-muted"}`}>
                {a.is_active ? "Active" : "Hidden"}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-secondary line-clamp-3">{a.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.postcode_prefixes.map((p) => (
                <span key={p} className="badge bg-bg-surface text-ink-secondary ring-1 ring-bg-border">
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-bg-border pt-3">
              <button onClick={() => startEdit(a)} className="btn-secondary">
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button onClick={() => remove(a.id)} className="btn-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <div className="md:col-span-2 xl:col-span-3">
            <div className="card flex flex-col items-center p-10 text-center">
              <MapPin className="mb-3 h-5 w-5 text-ink-muted" />
              <p className="text-sm text-ink-secondary">No service areas yet.</p>
            </div>
          </div>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit area" : "New area"} size="lg">
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
            <div className="sm:col-span-2">
              <label className="field-label">Description</label>
              <textarea rows={3} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Postcode prefixes (comma separated)</label>
              <input className="field" value={form.postcode_prefixes} onChange={(e) => setForm({ ...form, postcode_prefixes: e.target.value })} placeholder="OX11, OX14" />
            </div>
            <div>
              <label className="field-label">Sort order</label>
              <input type="number" className="field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
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
