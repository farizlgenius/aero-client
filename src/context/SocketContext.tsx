import { createContext, useContext, useEffect } from "react";
import SignalRService from "../services/SignalRService";

interface SocketContextInterface {

}

const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    useEffect(() => {
        const connection = SignalRService.getConnection();

        
        return () => {

        }
    },[])

    return (
        <SocketContext.Provider
            value={{}}
        >
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocker must be used inside SocketProvider");
    return ctx;
}