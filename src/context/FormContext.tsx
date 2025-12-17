import { createContext, useContext, useState } from "react"


interface FormContextInterface {
    form:boolean;
}

// Create Context 
const FormContext = createContext<FormContextInterface | null>(null);

// Provider
export const AlertProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [form,setForm] = useState<boolean>(false);

    return (
        <FormContext.Provider value={{form}}>
            {children}
        </FormContext.Provider>
    );
}

// Custom hook for easy usage
export const useForm = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used inside FormProvider");
  return ctx;
};