import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-bg-border bg-bg-raised/30 px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-surface ring-1 ring-bg-border">
        <Icon className="h-5 w-5 text-ink-muted" />
      </span>
      <p className="font-display text-lg font-semibold">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-secondary">{description}</p>}
    </div>
  );
}
