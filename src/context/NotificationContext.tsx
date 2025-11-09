import { createContext, useContext, useState } from "react"

// small types used by the toast system
type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationContextInterface {
  showNoti:boolean;
  setShowNoti:React.Dispatch<React.SetStateAction<boolean>>;
  notiType:NotificationType;
  setNotiType:React.Dispatch<React.SetStateAction<NotificationType>>;

}


// Create Context 
const NotificationContext = createContext<NotificationContextInterface | null>(null);

// Provider
export const NotificationProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [notiType,setNotiType] = useState<NotificationType>("info");
    const [toastMessage,setToastMessage] = useState<string>("")
    const [showNoti, setShowNoti] = useState(false);

    return (
        <NotificationContext.Provider value={{showNoti,setShowNoti,notiType,setNotiType}}>
            {children}
        </NotificationContext.Provider>
    );
}

// Custom hook for easy usage
export const useNoti = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};