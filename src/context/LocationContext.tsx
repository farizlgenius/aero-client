import { createContext, useContext, useState } from "react";
import { LocationDto } from "../model/Location/LocationDto";
import { Options } from "../model/Options";
interface LocationContextInterface {
    locationId: number;
    locationName: string;
    setLocationId: React.Dispatch<React.SetStateAction<number>>;
    setLocationName: React.Dispatch<React.SetStateAction<string>>;
    locationList:LocationDto[];
    locationOption:Options[];
    SetLocationOption:React.Dispatch<React.SetStateAction<Options[]>>
    setLocationList:React.Dispatch<React.SetStateAction<LocationDto[]>>
}

const LocationContext = createContext<LocationContextInterface | null>(null);


export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [show,setShow] = useState<boolean>(false);
    const [locationId, setLocationId] = useState<number>(-1);
    const [locationName, setLocationName] = useState<string>("");
    const [locationList,setLocationList] = useState<LocationDto[]>([]);
    const [locationOption,SetLocationOption] = useState<Options[]>([]);

    return (
        <LocationContext.Provider
            value={{
                locationOption,SetLocationOption,locationId, setLocationId, locationName, setLocationName,locationList,setLocationList
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