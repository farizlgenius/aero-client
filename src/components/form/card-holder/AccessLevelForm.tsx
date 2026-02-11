import { PropsWithChildren, useEffect, useState } from "react";
import { FormProp } from "../../../model/Form/FormProp";
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto";
import { AccessLevelDto } from "../../../model/AccessGroup/AccessLevelDto";
import { useLocation } from "../../../context/LocationContext";
import { send } from "../../../api/api";
import { AccessLevelEndPoint } from "../../../endpoint/AccessLevelEndpoint";
import ListTransfer from "../list-transfer/ListTransfer";


export const AccessLevelForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({ dto, setDto, type, handleClick }) => {
    const { locationId } = useLocation();
    const [availableAccessLevels, setAvailableAccessLevels] = useState<AccessLevelDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    const handleListChange = (data: AccessLevelDto[]) => {
        setDto(prev => ({ ...prev, accessLevels: data }))
    }



    const fetchAccessLevel = async () => {
        const res = await send.get(AccessLevelEndPoint.GET(locationId))
        console.log(res.data.data);
        if (res && res.data.data) {
            setAvailableAccessLevels(res.data.data.filter((al: AccessLevelDto) => !dto.accessLevels.some(selected => selected.componentId === al.componentId)));
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAccessLevel();
    }, [])

    return (
        <div className="flex gap-5 justify-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className='flex flex-col w-3/4'>

                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                        Access Levels
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                            {dto.accessLevels.length}/32
                        </span>
                    </h3>
                </div>
                {loading ? (
                    <p>Loading access levels...</p>
                ) : (
                    <ListTransfer<AccessLevelDto>
                        
                        availableItems={availableAccessLevels}
                        selectedItems={dto.accessLevels}
                        onChange={handleListChange}
                    />
                )}

            </div>
        </div>

    )

}