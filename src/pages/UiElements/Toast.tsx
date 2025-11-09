import React, { useEffect, useState } from "react";

type ToastType = "success" | "error" | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ type = "success", message, duration = 3000,onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration,onClose]);

  if (!visible) return null;

  const bgClass = type === "success" ? "bg-green-500" : type=== "error" ? "bg-red-600" : "bg-sky-500";
  const header = type === "success" ? "Success" : type=== "error" ? "Error" : "Info";
  const icon =
    type === "success" ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ) :  ( type === "error" ?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      :
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" />
    </svg>
    );

  return (
    // <div
    //   role="status"
    //   aria-live="polite"
    //   className={`
    //     fixed bottom-5 right-5 z-50 flex items-center gap-3
    //     ${bgClass} text-white px-5 py-3 rounded-lg shadow-lg
    //     transition-all duration-500 ease-in-out
    //     ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
    //   `}
    // >
    //   {icon}
    //   <div className="text-sm font-medium">{message}</div>
    // </div>
        <div
      role="status"
      aria-live="polite"
      className={`
        fixed bottom-5 right-5 z-50 flex items-start gap-3
        ${bgClass} text-white px-5 py-4 rounded-lg shadow-lg
        transition-all duration-500 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
    >
      {/* Icon */}
      <div className="flex items-center justify-center mt-0.5">{icon}</div>

      {/* Message Area */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-tight">{header}</span>
        <span className="text-sm text-white/90 leading-snug">{message}</span>
      </div>
    </div>
  );
};

export default Toast;