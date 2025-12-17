import React, { createContext, JSX, useContext, useState } from "react";
import RemoveModal from "../pages/UiElements/RemoveModal";
import CreateModal from "../pages/UiElements/CreateModal";
import UpdateModal from "../pages/UiElements/UpdateModal";

interface PopupContextInterface {
  create:boolean;
  setCreate:React.Dispatch<React.SetStateAction<boolean>>;
  update:boolean;
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>;
  remove:boolean;
  setRemove:React.Dispatch<React.SetStateAction<boolean>>;
  removeModal:JSX.Element;
  createModal:JSX.Element;
  updateModal:JSX.Element;
  setConfirmCreate: (fn: () => void) => void;
  setConfirmUpdate: (fn: () => void) => void;
  setConfirmRemove: (fn: () => void) => void;
  edit:boolean;
  setEdit:React.Dispatch<React.SetStateAction<boolean>>;
};

type RemovePayload = {
  mac?: string;
  id?: number;
};

// Create context
const PopupContext = createContext<PopupContextInterface | null>(null);

// Provider
export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [create,setCreate] = useState<boolean>(false);
  const [update,setUpdate] = useState<boolean>(false);
  const [remove,setRemove] = useState<boolean>(false);
  const [edit,setEdit] = useState<boolean>(false);

  const [confirmCreate, setConfirmCreate] = useState<() => void>(() => () => {});
  const [confirmUpdate, setConfirmUpdate] = useState<() => void>(() => () => {});
  const [confirmRemove, setConfirmRemove] = useState<(payload?:RemovePayload) => void>(() => () => {});

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch(e.currentTarget.name){
      case "create-confirm":
        confirmCreate();
        setCreate(false);
        break;
      case "create-cancel":
        setCreate(false);
        break;
      case "update-confirm":
        confirmUpdate()
        setUpdate(false);
        break;
      case "update-cancel":
        setUpdate(false);
        break;
      case "remove-confirm":
        confirmRemove()
        setRemove(false)
        break;
      case "remove-cancel":
        setRemove(false);
        break;
      default:
        break;
    }
  }

  const removeModal = <RemoveModal  handleClick={handleClick} />
  const createModal = <CreateModal handleClick={handleClick} />
  const updateModal = <UpdateModal handleClick={handleClick} />



  return (
    <PopupContext.Provider value={{
      create,
      update,
      remove,
      setCreate,
      setUpdate,
      setRemove,
      removeModal,
      updateModal,
      createModal,
      setConfirmCreate,
        setConfirmUpdate,
        setConfirmRemove,
        edit,
        setEdit
      }}>
      {children}
    </PopupContext.Provider>
  );
};

// Custom hook for easy usage
export const usePopup = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used inside PopupProvider");
  return ctx;
};