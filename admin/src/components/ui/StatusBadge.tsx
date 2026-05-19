import { cn, statusColor, titleCase } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("badge", statusColor(status))}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {titleCase(status)}
    </span>
  );
}
