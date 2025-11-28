import { createContext, useContext, useState } from "react";
import { LocationDto } from "../model/Location/LocationDto";
interface LocationContextInterface {
    locationId: number;
    locationName: string;
    setLocationId: React.Dispatch<React.SetStateAction<number>>;
    setLocationName: React.Dispatch<React.SetStateAction<string>>;
    show:boolean;
    setShow:React.Dispatch<React.SetStateAction<boolean>>;
    locationList:LocationDto[];
    setLocationList:React.Dispatch<React.SetStateAction<LocationDto[]>>
}

const LocationContext = createContext<LocationContextInterface | null>(null);


export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [show,setShow] = useState<boolean>(false);
    const [locationId, setLocationId] = useState<number>(-1);
    const [locationName, setLocationName] = useState<string>("");
    const [locationList,setLocationList] = useState<LocationDto[]>([]);

    return (
        <LocationContext.Provider
            value={{
                locationId, setLocationId, locationName, setLocationName,show,setShow,locationList,setLocationList
            }}
        >
            {children}
        </LocationContext.Provider>
    )
}

export const useLocation = () => {
    const ctx = useContext(LocationContext);
    if (!ctx) throw new Error("useLocation must be used inside LocationProvider");
    return ctx;
}