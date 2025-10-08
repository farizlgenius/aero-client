import { usePopup } from "../context/PopupContext";

export const usePopupActions = () => {
  const { setShowPopupFlag,setPopupSuccessFlag,setPopUpMessage  } = usePopup();

  const showPopup = (isSuccess: boolean, popUpMessage: string[]) => {
    setShowPopupFlag(true);
    setPopUpMessage(popUpMessage);
    setPopupSuccessFlag(isSuccess);
  };


  const hidePopup = () => {
    setPopUpMessage([]);
    setShowPopupFlag(false);
  };

  return { showPopup, hidePopup };
};