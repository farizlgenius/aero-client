import React, { createContext, JSX, useContext, useEffect, useState } from "react"
import Toast from "../pages/UiElements/Toast";

// small types used by the toast system
type ToastType = "success" | "error" | "warning";
type Toast = {
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextInterface {
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>
  toggleToast: (toastType: ToastType, toastMessage: string) => void;
  ToastContainer: () => JSX.Element;
}


// Create Context 
const ToastContext = createContext<ToastContextInterface | null>(null);

// Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastList, setToastList] = useState<Toast[]>([]);
  const [showToast, setShowToast] = useState(false);
  const toggleToast = (toastType: ToastType, toastMessage: string) => {

    setToastList(prev => ([...prev,{
      type:toastType,
      message:toastMessage,
      duration:3000
    }]))
    setShowToast(true);
  }
  const ToastContainer = () => {
    const handleClose = (i:number) => {
      setToastList(prev => (prev.filter((_,index) => index !== i)))
    };
    return (
      <div className=" fixed top-5 right-5 w-xs flex flex-col items-start justify-center gap-3 z-99999">
        {toastList.map((a: Toast, i: number) => (
          // <div
          //   key={i}
          //   className={`flex items-center w-full max-w-xs p-4 mb-1 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${}`}
          //   role="alert">
          //   {icon(a.type)}

          //   <div className="ml-3 text-sm font-normal">{a.message}</div>
          //   <button onClick={() => handleClose(i)} type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
          //     <span className="sr-only">Close</span>
          //     <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          //       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          //     </svg>
          //   </button>
          // </div>
          <Toast key={i} type={a.type} message={a.message} onClose={handleClose} index={i} duration={a.duration} />
        ))}
        
      </div>
    );
  }


  const icon = (a: ToastType) => {
    switch (a) {
      case "success":
        return <>
          <div
            className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
              viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
        </>
      case "error":
        return <>
          <div
            className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
              viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg>
            <span className="sr-only">Error icon</span>
          </div>
        </>
      case "warning":
        return <>
          <div
            className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
              viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
            <span className="sr-only">Warning icon</span>
          </div>
        </>
    }
  }


  return (
    <ToastContext.Provider value={{ ToastContainer,showToast, setShowToast, toggleToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook for easy usage
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};