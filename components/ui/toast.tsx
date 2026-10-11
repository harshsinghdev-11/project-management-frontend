"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { Paperclip } from "@/components/stationery/paperclip";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, description, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "success", title, description });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "error", title, description, duration: 6000 });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      showToast({ type: "info", title, description });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, info, dismiss }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative flex items-start gap-3 p-4 rounded-xl border paper-shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
                isSuccess
                  ? "bg-[#FCFBF8] border-[#CFDFCB] text-[#1E2229]"
                  : isError
                  ? "bg-[#FDF9F7] border-[#ECC1B5] text-[#1E2229]"
                  : "bg-[#FAF7F0] border-[#DDD3C4] text-[#1E2229]"
              }`}
              style={{
                boxShadow: "0 1px 3px rgba(45,35,20,0.08), 0 8px 20px rgba(45,35,20,0.12)",
              }}
            >
              {/* Paperclip clipping the toast memo */}
              <div className="absolute -top-3.5 left-4 z-10">
                <Paperclip color={isError ? "copper" : isSuccess ? "brass" : "silver"} size="sm" rotation={-8} />
              </div>

              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#5B7553]" />}
                {isError && <AlertCircle className="w-5 h-5 text-[#C86446]" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-[#2C4258]" />}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-bold tracking-tight text-[#1E2229] font-editorial leading-snug">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-[11px] text-[#5A6472] mt-0.5 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 text-[#8C98A8] hover:text-[#2A3442] p-1 rounded transition"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
