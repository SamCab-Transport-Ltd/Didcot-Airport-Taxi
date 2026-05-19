"use client";

import { useState } from "react";
import useSWR from "swr";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import type { FAQ } from "@/lib/types";
import { PageHeader } from "@/components/shell/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface F {
  id?: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

const empty: F = { question: "", answer: "", category: "", sort_order: 100, is_active: true };

export default function FaqsPage() {
  const { data, mutate } = useSWR<FAQ[]>("/faqs", apiFetcher);
  const toast = useToast();
  const [form, setForm] = useState<F | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  function startEdit(f: FAQ) {
    setForm({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category ?? "",
      sort_order: f.sort_order,
      is_active: f.is_active,
    });
  }

  async function save() {
    if (!form) return;
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };
    try {
      if (form.id) {
        await api(`/faqs/${form.id}`, { method: "PATCH", body: payload });
        toast("FAQ updated");
      } else {
        await api("/faqs", { method: "POST", body: payload });
        toast("FAQ created");
      }
      setForm(null);
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await api(`/faqs/${id}`, { method: "DELETE" });
      toast("FAQ deleted");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="FAQs"
        description="Drives the help section and FAQPage schema markup."
        actions={
          <button onClick={() => setForm({ ...empty })} className="btn-primary">
            <Plus className="h-4 w-4" /> New FAQ
          </button>
        }
      />

      <div className="card divide-y divide-bg-border overflow-hidden">
        {(data ?? []).map((f) => (
          <div key={f.id}>
            <button
              onClick={() => setOpenId(openId === f.id ? null : f.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-bg-surface/40"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{f.question}</p>
                {f.category && <p className="text-xs text-ink-muted">{f.category}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${f.is_active ? "bg-status-completed/15 text-[#22C55E]" : "bg-bg-surface text-ink-muted"}`}>
                  {f.is_active ? "Live" : "Hidden"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-ink-muted transition-transform ${openId === f.id ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {openId === f.id && (
              <div className="px-5 pb-5 text-sm text-ink-secondary">
                <p className="whitespace-pre-line">{f.answer}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => startEdit(f)} className="btn-secondary">
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => remove(f.id)} className="btn-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <div className="px-5 py-12 text-center text-ink-muted">No FAQs yet.</div>
        )}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit FAQ" : "New FAQ"} size="lg">
        {form && (
          <div className="space-y-4">
            <div>
              <label className="field-label">Question</label>
              <input className="field" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Answer</label>
              <textarea rows={6} className="field" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Category</label>
                <input className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Booking, Payment, …" />
              </div>
              <div>
                <label className="field-label">Sort order</label>
                <input type="number" className="field" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-accent" />
              <span className="text-sm">Show on public site</span>
            </label>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
