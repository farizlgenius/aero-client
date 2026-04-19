import React, { createContext, JSX, useContext, useEffect, useMemo, useState } from "react";
import Toast from "../pages/UiElements/Toast";

export type ToastType = "success" | "error" | "warning" | "pending";

export type ToastOptions = {
  duration?: number;
};

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

interface ToastContextInterface {
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  toggleToast: (toastType: ToastType, toastMessage: string, options?: ToastOptions) => string;
  updateToast: (id: string, updates: Partial<Omit<ToastItem, "id">>) => void;
  removeToast: (id: string) => void;
  ToastContainer: () => JSX.Element;
}

const DEFAULT_TOAST_DURATION = 3000;

const ToastContext = createContext<ToastContextInterface | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastList, setToastList] = useState<ToastItem[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setShowToast(toastList.length > 0);
  }, [toastList]);

  const toggleToast = (toastType: ToastType, toastMessage: string, options?: ToastOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    setToastList((prev) => [
      ...prev,
      {
        id,
        type: toastType,
        message: toastMessage,
        duration: options?.duration ?? (toastType === "pending" ? undefined : DEFAULT_TOAST_DURATION),
      },
    ]);

    return id;
  };

  const updateToast = (id: string, updates: Partial<Omit<ToastItem, "id">>) => {
    setToastList((prev) =>
      prev.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              ...updates,
              duration:
                updates.duration !== undefined
                  ? updates.duration
                  : updates.type === "pending"
                    ? undefined
                    : toast.duration ?? DEFAULT_TOAST_DURATION,
            }
          : toast
      )
    );
  };

  const removeToast = (id: string) => {
    setToastList((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = useMemo(
    () =>
      function ToastContainerComponent() {
        return (
          <div className="fixed top-5 right-5 z-99999 flex w-full max-w-sm flex-col gap-3">
            {toastList.map((toast) => (
              <Toast
                key={toast.id}
                id={toast.id}
                type={toast.type}
                message={toast.message}
                duration={toast.duration}
                onClose={removeToast}
              />
            ))}
          </div>
        );
      },
    [toastList]
  );

  return (
    <ToastContext.Provider
      value={{ ToastContainer, showToast, setShowToast, toggleToast, updateToast, removeToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
