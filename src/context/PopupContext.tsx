import React, { createContext, useContext, useState } from "react";

interface PopupContextInterface {
  showPopupFlag:boolean;
  setShowPopupFlag:React.Dispatch<React.SetStateAction<boolean>>;
  popupSuccessFlag:boolean;
  setPopupSuccessFlag:React.Dispatch<React.SetStateAction<boolean>>;
  popUpMessage:string[];
  setPopUpMessage:React.Dispatch<React.SetStateAction<string[]>>;
};

// Create context
const PopupContext = createContext<PopupContextInterface | null>(null);

// Provider
export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showPopupFlag,setShowPopupFlag] = useState<boolean>(false);
  const [popupSuccessFlag,setPopupSuccessFlag] = useState<boolean>(false);
  const [popUpMessage,setPopUpMessage] = useState<string[]>([]);

  return (
    <PopupContext.Provider value={{ showPopupFlag,setShowPopupFlag,popupSuccessFlag,setPopupSuccessFlag,popUpMessage,setPopUpMessage }}>
      {children}
    </PopupContext.Provider>
  );
};

// Custom hook for easy usage
export const usePopup = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};