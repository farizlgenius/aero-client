import { createContext, useContext, useState } from "react"


interface AlertContextInterface {
  showAlertFlag:boolean;
  setShowAlertFlag:React.Dispatch<React.SetStateAction<boolean>>;
  alertSuccessFlag:boolean;
  setAlertSuccessFlag:React.Dispatch<React.SetStateAction<boolean>>;
  alertMessage?:string;
  setAlertMessage?:React.Dispatch<React.SetStateAction<string>>;
}

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