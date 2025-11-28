import { createContext, JSX, useContext, useState } from "react";
import Spinner from "../pages/UiElements/Spinner";

interface LoadingContextInterface {
    Loading: () => JSX.Element;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextInterface | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const Loading = () => {
        return (
            <>
                <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99998">
                    <div className="modal-close-btn fixed inset-0 h-full w-full bg-black-400/50 backdrop-blur-[32px]"></div>
                    <div className="loadingspinner" role="status" aria-label="Loading">
                        <div id="square1" className="square"></div>
                        <div id="square2" className="square"></div>
                        <div id="square3" className="square"></div>
                        <div id="square4" className="square"></div>
                        <div id="square5" className="square"></div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <LoadingContext.Provider value={{ Loading, loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
    return ctx;
}