"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type ToastVariant = "success" | "error";
interface Toast {
  id: number;
  text: string;
  variant: ToastVariant;
}

const ToastContext = createContext<{
  toast: (text: string, variant?: ToastVariant) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((text: string, variant: ToastVariant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-bg-border bg-bg-elevated px-4 py-2.5 text-sm shadow-soft"
          >
            {t.variant === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-status-completed" />
            ) : (
              <XCircle className="h-4 w-4 text-accent" />
            )}
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
