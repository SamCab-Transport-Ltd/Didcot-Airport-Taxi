"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { KeyRound, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { api, apiFetcher } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/shell/PageHeader";
import { Modal } from "@/components/ui/Modal";
import type { UserPublic } from "@/lib/types";

type Dict = Record<string, unknown>;

interface AllSettings {
  site?: Dict;
  contact?: Dict;
  address?: Dict;
  social?: Dict;
  branding?: Dict;
  tracking?: Dict;
  pricing?: Dict;
  hours?: Dict;
  [k: string]: unknown;
}

export default function SettingsPage() {
  const { data, mutate, isLoading } = useSWR<AllSettings>("/settings", apiFetcher);
  const toast = useToast();
  const [draft, setDraft] = useState<AllSettings | null>(null);

  useEffect(() => {
    if (data && !draft) setDraft(structuredClone(data));
  }, [data, draft]);

  const updateSection = (section: keyof AllSettings, key: string, value: unknown) => {
    setDraft((d) => {
      if (!d) return d;
      const next = { ...d } as AllSettings;
      const sec = { ...((next[section] as Dict) ?? {}) };
      sec[key] = value;
      next[section] = sec;
      return next;
    });
  };

  const dirty = useMemo(() => {
    if (!data || !draft) return false;
    return JSON.stringify(data) !== JSON.stringify(draft);
  }, [data, draft]);

  async function saveAll() {
    if (!draft) return;
    try {
      await api("/settings", { method: "PUT", body: { values: draft } });
      toast("Settings saved");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "error");
    }
  }

  if (isLoading || !draft) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
      </div>
    );
  }

  const site = (draft.site ?? {}) as Dict;
  const contact = (draft.contact ?? {}) as Dict;
  const address = (draft.address ?? {}) as Dict;
  const social = (draft.social ?? {}) as Dict;
  const branding = (draft.branding ?? {}) as Dict;
  const tracking = (draft.tracking ?? {}) as Dict;
  const pricing = (draft.pricing ?? {}) as Dict;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Brand, contact details, pricing rules, tracking and operators."
        actions={
          <button onClick={saveAll} disabled={!dirty} className="btn-primary">
            <Save className="h-4 w-4" /> {dirty ? "Save changes" : "Up to date"}
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Site identity" description="Public-facing brand and SEO basics.">
          <Field label="Site name" value={str(site.name)} onChange={(v) => updateSection("site", "name", v)} />
          <Field label="Legal name" value={str(site.legal_name)} onChange={(v) => updateSection("site", "legal_name", v)} />
          <Field label="Tagline" value={str(site.tagline)} onChange={(v) => updateSection("site", "tagline", v)} />
          <Field label="Default meta description" value={str(site.meta_description)} onChange={(v) => updateSection("site", "meta_description", v)} as="textarea" />
        </Section>

        <Section title="Contact" description="Where bookings and enquiries land.">
          <Field label="Phone" value={str(contact.phone)} onChange={(v) => updateSection("contact", "phone", v)} />
          <Field label="WhatsApp" value={str(contact.whatsapp)} onChange={(v) => updateSection("contact", "whatsapp", v)} />
          <Field label="Email" value={str(contact.email)} onChange={(v) => updateSection("contact", "email", v)} />
          <Field label="Operator hours" value={str(contact.hours)} onChange={(v) => updateSection("contact", "hours", v)} />
        </Section>

        <Section title="Address" description="Used for LocalBusiness schema and footer.">
          <Field label="Street" value={str(address.street)} onChange={(v) => updateSection("address", "street", v)} />
          <Field label="City" value={str(address.city)} onChange={(v) => updateSection("address", "city", v)} />
          <Field label="County" value={str(address.county)} onChange={(v) => updateSection("address", "county", v)} />
          <Field label="Postcode" value={str(address.postcode)} onChange={(v) => updateSection("address", "postcode", v)} />
          <Field label="Country" value={str(address.country) || "United Kingdom"} onChange={(v) => updateSection("address", "country", v)} />
        </Section>

        <Section title="Social" description="Links exposed in footer and JSON-LD.">
          <Field label="Twitter / X" value={str(social.twitter)} onChange={(v) => updateSection("social", "twitter", v)} />
          <Field label="Facebook" value={str(social.facebook)} onChange={(v) => updateSection("social", "facebook", v)} />
          <Field label="Instagram" value={str(social.instagram)} onChange={(v) => updateSection("social", "instagram", v)} />
          <Field label="LinkedIn" value={str(social.linkedin)} onChange={(v) => updateSection("social", "linkedin", v)} />
        </Section>

        <Section title="Branding" description="Accent and surface tokens (frontend reads these on build).">
          <Field label="Accent colour" value={str(branding.accent) || "#FF0000"} onChange={(v) => updateSection("branding", "accent", v)} />
          <Field label="Background" value={str(branding.background) || "#0A0A0B"} onChange={(v) => updateSection("branding", "background", v)} />
          <Field label="Trustpilot rating" value={str(branding.trustpilot_rating) || "4.9"} onChange={(v) => updateSection("branding", "trustpilot_rating", v)} />
          <Field label="Trustpilot reviews" value={str(branding.trustpilot_reviews) || "1280"} onChange={(v) => updateSection("branding", "trustpilot_reviews", v)} />
        </Section>

        <Section title="Tracking" description="IDs read at build time and by server-side tracking.">
          <Field label="GA4 Measurement ID" value={str(tracking.ga4_id)} onChange={(v) => updateSection("tracking", "ga4_id", v)} />
          <Field label="Google Ads ID" value={str(tracking.google_ads_id)} onChange={(v) => updateSection("tracking", "google_ads_id", v)} />
          <Field label="Meta Pixel ID" value={str(tracking.meta_pixel_id)} onChange={(v) => updateSection("tracking", "meta_pixel_id", v)} />
          <Field label="TikTok Pixel ID" value={str(tracking.tiktok_pixel_id)} onChange={(v) => updateSection("tracking", "tiktok_pixel_id", v)} />
          <Field label="Microsoft Clarity" value={str(tracking.clarity_id)} onChange={(v) => updateSection("tracking", "clarity_id", v)} />
          <Field label="Hotjar ID" value={str(tracking.hotjar_id)} onChange={(v) => updateSection("tracking", "hotjar_id", v)} />
        </Section>

        <Section title="Pricing" description="Used by the fare estimator on the booking flow.">
          <Field label="Base fare (GBP)" value={str(pricing.base_fare) || "12"} onChange={(v) => updateSection("pricing", "base_fare", num(v))} type="number" />
          <Field label="Per mile" value={str(pricing.per_mile) || "1.95"} onChange={(v) => updateSection("pricing", "per_mile", num(v))} type="number" />
          <Field label="Per minute" value={str(pricing.per_minute) || "0.35"} onChange={(v) => updateSection("pricing", "per_minute", num(v))} type="number" />
          <Field label="Night surcharge %" value={str(pricing.night_surcharge_pct) || "15"} onChange={(v) => updateSection("pricing", "night_surcharge_pct", num(v))} type="number" />
          <Field label="Meet & Greet (GBP)" value={str(pricing.meet_greet_fee) || "10"} onChange={(v) => updateSection("pricing", "meet_greet_fee", num(v))} type="number" />
          <Field label="Currency" value={str(pricing.currency) || "GBP"} onChange={(v) => updateSection("pricing", "currency", v)} />
        </Section>

        <UsersSection />
      </div>
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5">
      <header className="mb-4 border-b border-bg-border pb-4">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {description && <p className="text-xs text-ink-muted">{description}</p>}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  as,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  as?: "textarea";
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {as === "textarea" ? (
        <textarea rows={3} className="field" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} className="field" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function str(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v);
}
function num(v: string): number | string {
  const n = Number(v);
  return Number.isFinite(n) && v !== "" ? n : v;
}

function UsersSection() {
  const { data, mutate } = useSWR<UserPublic[]>("/users", apiFetcher);
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "admin" });

  async function create() {
    try {
      await api("/users", { method: "POST", body: form });
      toast("User created");
      setOpen(false);
      setForm({ username: "", email: "", password: "", role: "admin" });
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this user?")) return;
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      toast("User deleted");
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  }

  return (
    <section className="card p-5 lg:col-span-2">
      <header className="mb-4 flex items-end justify-between border-b border-bg-border pb-4">
        <div>
          <h2 className="font-display text-base font-semibold">Users & access</h2>
          <p className="text-xs text-ink-muted">Operators who can sign into this dashboard.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-secondary">
          <Plus className="h-4 w-4" /> New user
        </button>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="text-xs uppercase tracking-[0.14em] text-ink-muted">
              <th className="py-2">Username</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-border">
            {(data ?? []).map((u) => (
              <tr key={u.id}>
                <td className="py-2 font-medium">{u.username}</td>
                <td className="py-2 text-ink-secondary">{u.email ?? "—"}</td>
                <td className="py-2">
                  <span className="badge bg-bg-surface text-ink-secondary ring-1 ring-bg-border">
                    <KeyRound className="h-3 w-3" /> {u.role}
                  </span>
                </td>
                <td className="py-2">
                  <span className={`badge ${u.is_active ? "bg-status-completed/15 text-[#22C55E]" : "bg-bg-surface text-ink-muted"}`}>
                    {u.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <button onClick={() => remove(u.id)} className="btn-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New user">
        <div className="space-y-3">
          <div>
            <label className="field-label">Username</label>
            <input className="field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Role</label>
            <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={create}>Create</button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
