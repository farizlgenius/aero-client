import React, { createContext, useContext, useState } from "react"

// small types used by the toast system
type ToastType = "success" | "error" | "info";

export interface ToastContextInterface {
  toastType:ToastType;
  toastMessage:string;
  showToast:boolean;
  setShowToast:React.Dispatch<React.SetStateAction<boolean>>
  toggleToast:(toastType:ToastType,toastMessage:string) => void;
}


// Create Context 
const ToastContext = createContext<ToastContextInterface | null>(null);

// Provider
export const ToastProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [toastType,setToastType] = useState<ToastType>("info");
    const [toastMessage,setToastMessage] = useState<string>("")
    const [showToast, setShowToast] = useState(false);
    const toggleToast = (toastType:ToastType,toastMessage:string) => {
      setToastType(toastType);
      setToastMessage(toastMessage);
      setShowToast(true);
    }

    return (
        <ToastContext.Provider value={{toastType,toastMessage,showToast,setShowToast,toggleToast}}>
            {children}
        </ToastContext.Provider>
    );
}

// Custom hook for easy usage
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};