import Modals from "../../../pages/UiElements/Modals";
import { useLocation } from "../../../context/LocationContext";
import { LocationIcon } from "../../../icons";
import { LocationDto } from "../../../model/Location/LocationDto";

export const LocationModal = () => {
    const { show, setShow, locationList,setLocationId,setLocationName } = useLocation();
    const handleClickClose = () => {
        setShow(false)
    }

    const handleClick = (d:LocationDto) => {
        setLocationId(d.componentId);
        setLocationName(d.locationName);
        setShow(false)
    }

    return (
        <div className={`${show ? '' : 'hidden '} fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999`}>
            <div className="modal-close-btn fixed inset-0 h-full w-full bg-black-400/50 backdrop-blur-[32px]"></div>
            <Modals header="Locations" isWide={true} handleClickWithEvent={() => handleClickClose()} body={
                <div className="grid grid-cols-3 gap-4">
                    {locationList.map((a: LocationDto, i: number) => {
                        return (<>
                            <div onClick={() => handleClick(a)} key={i} className="cursor-pointer flex flex-col rounded-2xl border border-gray-200 hover:dark:bg-white/[0.01] hover:bg-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                                        <LocationIcon className="w-5 h-5" />
                                    </div>
                                    <h4 className="mt-2 font-bold text-gray-800 text-lg dark:text-white/90">{a.locationName}</h4>
                                </div>
                                <div className="flex items-start justify-between mt-5">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Description</span>
                                        <h4 className="mt-2 text-gray-800 text-sm dark:text-white/90">{a.description}</h4>
                                    </div>
                                </div>
                            </div>
                        </>)
                    })}

                </div>

            } />
        </div>
    )
}