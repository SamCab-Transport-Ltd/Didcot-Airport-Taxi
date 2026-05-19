"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Car,
  CarTaxiFront,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  Plane,
  Settings,
  Ticket,
  Users,
  UserSquare2,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav: { href: string; label: string; icon: React.ElementType }[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/bookings", label: "Bookings", icon: Ticket },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/drivers", label: "Drivers", icon: UserSquare2 },
  { href: "/fleet", label: "Fleet", icon: Car },
  { href: "/airports", label: "Airports", icon: Plane },
  { href: "/areas", label: "Areas", icon: MapPin },
  { href: "/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/tracking", label: "Tracking", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-bg-border bg-bg-raised/70 backdrop-blur md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-bg-border px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
          <CarTaxiFront className="h-5 w-5" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold tracking-tight">Didcot Airport Taxi</span>
          <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-muted">Operator console</span>
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent/12 text-ink-primary ring-1 ring-accent/30"
                  : "text-ink-secondary hover:bg-bg-surface hover:text-ink-primary",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-ink-muted")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-bg-border p-3">
        <div className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2">
          <div className="leading-tight">
            <p className="text-sm font-medium">{user?.username ?? "—"}</p>
            <p className="text-xs text-ink-muted">{user?.role ?? "role"}</p>
          </div>
          <button onClick={logout} className="btn-ghost px-2 py-1" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
