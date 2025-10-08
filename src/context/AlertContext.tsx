import { createContext, useContext, useState } from "react"
import { AlertContextInterface } from "../constants/types";




// Create Context 
const AlertContext = createContext<AlertContextInterface | null>(null);

// Provider
export const AlertProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [showAlertFlag,setShowAlertFlag] = useState<boolean>(false);
    const [alertSuccessFlag,setAlertSuccessFlag] = useState<boolean>(false);
    const [alertMessage,setAlertMessage] = useState<string>("");
    return (
        <AlertContext.Provider value={{showAlertFlag,setShowAlertFlag,alertSuccessFlag,setAlertSuccessFlag,alertMessage,setAlertMessage}}>
            {children}
        </AlertContext.Provider>
    );
}

// Custom hook for easy usage
export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};