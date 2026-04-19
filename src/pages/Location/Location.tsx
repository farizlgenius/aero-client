import {  useState } from "react"
import { BaseForm } from "../UiElements/BaseForm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { LocationDto } from "../../model/Location/LocationDto";
import { FormContent } from "../../model/Form/FormContent";
import { LocationIcon } from "../../icons";
import { LocationForm } from "../../components/form/location/LocationForm";
import { LocationEndpoint } from "../../endpoint/LocationEndpoint";
import { useToast } from "../../context/ToastContext";
import Helper from "../../utility/Helper";
import { LocationToast } from "../../model/ToastMessage";
import { BaseTable } from "../UiElements/BaseTable";
import api, { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { usePopup } from "../../context/PopupContext";
import { FeatureId } from "../../enum/FeatureId";
import { FormType } from "../../model/Form/FormProp";
import { usePagination } from "../../context/PaginationContext";
import { useLocation } from "../../context/LocationContext";

var removeTarget: number = 0;

const defaultDto: LocationDto = {
    id: 0,
    name: "",
    description: "",
    countryId: -1,
    country: ""
}

export const LOCATION_HEADER: string[] = ["Name", "Action"]
export const LOCATION_KEY: string[] = ["name"];

export const Location = () => {
    const {locationId} = useLocation();
    const { toggleToast } = useToast();
    const {setPagination} = usePagination();
    const {  filterPermission,fetchMeTrigger } = useAuth();
    const { setRemove, setConfirmRemove, setConfirmCreate, setInfo, setMessage, setCreate, setUpdate, setConfirmUpdate } = usePopup();
    const [form, setForm] = useState<boolean>(false);
     const [refresh, setRefresh] = useState<boolean>(false);
        const toggleRefresh = () => setRefresh(!refresh)
    const [locationDto, setLocationDto] = useState<LocationDto>(defaultDto);
    const [locationsDto, setLocationsDto] = useState<LocationDto[]>([]);
    const [select, setSelect] = useState<LocationDto[]>([])
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);
    

    const handleRemove = (data: LocationDto) => {
        removeTarget = data.id;
        setRemove(true);
        setConfirmRemove(() => async () => {
            const res = await api.delete(LocationEndpoint.DELETE(removeTarget));
            if (Helper.handleToastByResCode(res, LocationToast.DELETE, toggleToast)) {
                fetchMeTrigger();
                toggleRefresh();
                removeTarget = 0;
            }
        })
    }

    const handleInfo = (data: LocationDto) => {
        setFormType(FormType.INFO);
        setLocationDto(data);
        setForm(true);
    }

    {/* handle Table Action */ }
    const handleEdit = (data: LocationDto) => {
        setFormType(FormType.UPDATE);
        setLocationDto(data);
        setForm(true);
    }


    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE);
                setForm(true);
                break;
            case "delete":
                if (select.length == 0) {
                    setMessage("Please select object")
                    setInfo(true);
                } else {
                    setConfirmRemove(() => async () => {
                        var data: number[] = [];
                        select.map(async (a: LocationDto) => {
                            data.push(a.id)
                        })
                        var res = await send.post(LocationEndpoint.DELETE_RANGE, {
                            ids:data
                        })
                        if (Helper.handleToastByResCode(res, LocationToast.DELETE_RANGE, toggleToast)) {
                            fetchMeTrigger();
                            setRemove(false);
                            toggleRefresh();
                        }
                    })
                    setRemove(true);
                }

                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(LocationEndpoint.CREATE, locationDto);
                    if (Helper.handleToastByResCode(res, LocationToast.CREATE, toggleToast)) {
                        fetchMeTrigger();
                        setForm(false)
                        toggleRefresh();
                        setLocationDto(defaultDto)
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await api.put(LocationEndpoint.UPDATE, locationDto);
                    if (Helper.handleToastByResCode(res, LocationToast.UPDATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                    }

                })
                setUpdate(true);
                break;
            case "close":
            case "cancel":
                setLocationDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }


    const fetchData = async (pageNumber: number, pageSize: number,locationId?:number, search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(LocationEndpoint.PAGINATION(pageNumber, pageSize,locationId,search, startDate, endDate));
        console.log(res?.data)
        if (res && res.data) {
            console.log(res.data.data)
            setLocationsDto(res.data.items);
            setPagination(res.data);
        }
    }



    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <LocationIcon />,
            label: "Locations",
            content: <LocationForm type={formType} dto={locationDto} setDto={setLocationDto} handleClick={handleClickWithEvent} />
        }
    ];







    return (
        <>

            <PageBreadcrumb pageTitle="Locations" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<LocationDto> headers={LOCATION_HEADER} keys={LOCATION_KEY} data={locationsDto} select={select} setSelect={setSelect} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClickWithEvent} permission={filterPermission(FeatureId.location)} onInfo={handleInfo} fetchData={fetchData} refresh={refresh} locationId={locationId} />
                </div>

            }
        </>
    )
}