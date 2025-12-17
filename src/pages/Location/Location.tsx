import { useEffect, useState } from "react"
import { BaseForm } from "../UiElements/BaseForm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { LocationDto } from "../../model/Location/LocationDto";
import { FormContent } from "../../model/Form/FormContent";
import { AddIcon, LocationIcon } from "../../icons";
import { LocationForm } from "../../components/form/location/LocationForm";
import HttpRequest from "../../utility/HttpRequest";
import { HttpMethod } from "../../enum/HttpMethod";
import { LocationEndpoint } from "../../endpoint/LocationEndpoint";
import { useToast } from "../../context/ToastContext";
import Helper from "../../utility/Helper";
import { ToastMessage } from "../../model/ToastMessage";
import { BaseTable } from "../UiElements/BaseTable";
import { send } from "../../api/api";
import { FeatureEndpoint } from "../../endpoint/FeatureEndpoint";
import { useAuth } from "../../context/AuthContext";
import { FeatureDto } from "../../model/Role/FeatureDto";
import { usePopup } from "../../context/PopupContext";

var removeTarget: number = 0;

const defaultDto: LocationDto = {
    uuid: "",
    componentId: 0,
    locationName: "",
    description: "",
    isActive: true
}

export const LOCATION_HEADER: string[] = ["Name", "Action"]
export const LOCATION_KEY: string[] = ["locationName"];

export const Location = () => {
    const { toggleToast } = useToast();
    const { user } = useAuth();
    const { setRemove, setConfirmRemove,setConfirmCreate ,setCreate,setUpdate,setConfirmUpdate,edit,setEdit} = usePopup();
    const [form, setForm] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [locationDto, setLocationDto] = useState<LocationDto>(defaultDto);
    const [locationsDto, setLocationsDto] = useState<LocationDto[]>([]);
    const [permission, setPermission] = useState<FeatureDto | undefined>(undefined);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: LocationDto) => {
        removeTarget = data.componentId;
        setRemove(true);
        setConfirmRemove(() => async () => {
            const res = await HttpRequest.send(HttpMethod.DELETE, LocationEndpoint.DELETE_LOC(removeTarget))
            if (Helper.handleToastByResCode(res, ToastMessage.DELETE_LOCATION, toggleToast)) {
                toggleRefresh();
                removeTarget = 0;
            }
        })
    }

    {/* handle Table Action */ }
    const handleEdit = (data: LocationDto) => {
        setLocationDto(data);
        setForm(true);
        setEdit(true);
    }


    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setForm(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(LocationEndpoint.CREATE_LOC, locationDto);
                    if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await HttpRequest.send(HttpMethod.PUT, LocationEndpoint.UPDATE_LOC, true, locationDto)
                    if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                        setEdit(false);
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


    const [selectedObjects, setSelectedObjects] = useState<LocationDto[]>([]);
    const handleCheckedAll = (data: LocationDto[], e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(data)
        console.log(e.target.checked)
        if (setSelectedObjects) {
            if (e.target.checked) {
                setSelectedObjects(data);
            } else {
                setSelectedObjects([]);
            }
        }
    }

    const handleChecked = (data: LocationDto, e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(data)
        console.log(e.target.checked)
        if (setSelectedObjects) {
            if (e.target.checked) {
                setSelectedObjects((prev) => [...prev, data]);
            } else {
                setSelectedObjects((prev) =>
                    prev.filter((item) => item.componentId !== data.componentId)
                );
            }
        }
    }

    const fetchDate = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, LocationEndpoint.GET_LOC)
        console.log(res?.data.data)
        if (res && res.data.data) {
            setLocationsDto(res.data.data);
        }
    }

    const fetchPermission = async () => {
        if (user?.role?.roleNo) {
            const res = await send.get(FeatureEndpoint.GET_BY_ROLE_FEATURE(user.role.roleNo, 3))
            setPermission(res.data.data)
        }

    }


    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <LocationIcon />,
            label: "Intevals",
            content: <LocationForm isUpdate={edit} dto={locationDto} setDto={setLocationDto} handleClick={handleClickWithEvent} />
        }
    ];




    useEffect(() => {
        fetchPermission();
        fetchDate();
    }, [refresh])


    return (
        <>

            <PageBreadcrumb pageTitle="Locations" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<LocationDto> headers={LOCATION_HEADER} keys={LOCATION_KEY} data={locationsDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} handleClick={handleClickWithEvent} permission={permission} />
                </div>

            }
        </>
    )
}