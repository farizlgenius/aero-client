import React, { useEffect, useMemo, useState } from "react";
import type { ToastType } from "../../context/ToastContext";

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const EXIT_ANIMATION_MS = 240;

const toastPalette: Record<
  ToastType,
  {
    shell: string;
    iconWrapper: string;
    icon: string;
    progress: string;
    label: string;
  }
> = {
  success: {
    shell:
      "border border-success-100 bg-white/96 text-gray-700 shadow-[0_18px_40px_rgba(5,51,33,0.12)] dark:border-success-900/60 dark:bg-gray-900/95 dark:text-gray-200",
    iconWrapper: "bg-success-50 text-success-600 dark:bg-success-950/70 dark:text-success-300",
    icon: "text-success-600 dark:text-success-300",
    progress: "bg-success-500",
    label: "Success",
  },
  error: {
    shell:
      "border border-error-100 bg-white/96 text-gray-700 shadow-[0_18px_40px_rgba(85,22,12,0.14)] dark:border-error-900/60 dark:bg-gray-900/95 dark:text-gray-200",
    iconWrapper: "bg-error-50 text-error-600 dark:bg-error-950/70 dark:text-error-300",
    icon: "text-error-600 dark:text-error-300",
    progress: "bg-error-500",
    label: "Error",
  },
  warning: {
    shell:
      "border border-warning-100 bg-white/96 text-gray-700 shadow-[0_18px_40px_rgba(78,29,9,0.12)] dark:border-warning-900/60 dark:bg-gray-900/95 dark:text-gray-200",
    iconWrapper: "bg-warning-50 text-warning-600 dark:bg-warning-950/70 dark:text-warning-300",
    icon: "text-warning-600 dark:text-warning-300",
    progress: "bg-warning-500",
    label: "Warning",
  },
  pending: {
    shell:
      "border border-brand-100 bg-white/96 text-gray-700 shadow-[0_18px_40px_rgba(15,20,26,0.14)] dark:border-brand-900/60 dark:bg-gray-900/95 dark:text-gray-200",
    iconWrapper: "bg-brand-50 text-brand-600 dark:bg-brand-950/70 dark:text-brand-300",
    icon: "text-brand-600 dark:text-brand-300",
    progress: "bg-brand-500",
    label: "Pending",
  },
};

const Toast: React.FC<ToastProps> = ({ id, type, message, duration, onClose }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const palette = useMemo(() => toastPalette[type], [type]);

  useEffect(() => {
    setIsLeaving(false);
  }, [id, type, message, duration]);

  useEffect(() => {
    if (type === "pending" || duration === undefined || duration <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsLeaving(true);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, type]);

  useEffect(() => {
    if (!isLeaving) return undefined;

    const timer = window.setTimeout(() => {
      onClose(id);
    }, EXIT_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [id, isLeaving, onClose]);

  const renderIcon = () => {
    if (type === "pending") {
      return (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" className="opacity-25" stroke="currentColor" strokeWidth="3" />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            className="opacity-100"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (type === "success") {
      return (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      );
    }

    if (type === "error") {
      return (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 1 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
      );
    }

    return (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
      </svg>
    );
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl px-4 py-3 backdrop-blur-sm transition-all duration-200 ${palette.shell} ${
        isLeaving ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"
      }`}
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${palette.iconWrapper} ${palette.icon}`}>
          {renderIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
            {palette.label}
          </div>
          <p className="pr-6 text-sm font-medium leading-5 text-inherit">{message}</p>
          {type === "pending" ? (
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Waiting for server response...</p>
          ) : (
            duration !== undefined && duration > 0 && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/8">
                <div
                  className={`h-full rounded-full ${palette.progress}`}
                  style={{
                    width: "100%",
                    animation: `toast-progress ${duration}ms linear forwards`,
                  }}
                />
              </div>
            )
          )}
        </div>
        <button
          onClick={() => setIsLeaving(true)}
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/8 dark:hover:text-white"
          aria-label="Close toast"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
