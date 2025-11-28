import { useEffect, useState } from "react"
import { BaseForm } from "../UiElements/BaseForm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DangerModal from "../UiElements/DangerModal";
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
    const {user} = useAuth();
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [locationDto, setLocationDto] = useState<LocationDto>(defaultDto);
    const [locationsDto, setLocationsDto] = useState<LocationDto[]>([]);
    const [permission,setPermission] = useState<FeatureDto | undefined>(undefined);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: LocationDto) => {
        removeTarget = data.componentId;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        setIsRemoveModal(false);
        removeLocation(removeTarget);
    }

    {/* handle Table Action */ }
    const handleEdit = (data: LocationDto) => {
        setLocationDto(data);
        setUpdate(true);
    }


    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true);
                break;
            case "create":
                createLocation(locationDto);
                break;
            case "update":
                updateLocation(locationDto)
                break;
            case "close":
            case "cancel":
                setLocationDto(defaultDto)
                setCreate(false);
                setUpdate(false);
                break;
            default:
                break;
        }
    }

    const createLocation = async (dto: LocationDto) => {
        const res = await send.post(LocationEndpoint.CREATE_LOC,dto);
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }

    const updateLocation = async (dto: LocationDto) => {
        const res = await HttpRequest.send(HttpMethod.PUT, LocationEndpoint.UPDATE_LOC,true,dto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }

    const removeLocation = async (id: number) => {
        const res = await HttpRequest.send(HttpMethod.DELETE, LocationEndpoint.DELETE_LOC + id)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setIsRemoveModal(false)
            toggleRefresh();
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
        if(user?.role?.roleNo){
            const res = await send.get(FeatureEndpoint.GET_BY_ROLE_FEATURE(user.role.roleNo,3))
            setPermission(res.data.data)
        }
        
    }


    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <LocationIcon />,
            label: "Intevals",
            content: <LocationForm dto={locationDto} setDto={setLocationDto} handleClick={handleClickWithEvent} />
        }
    ];



    useEffect(() => {
        fetchPermission();
        fetchDate();
    }, [refresh])


    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Location' body='Please Click Confirm if you want to remove location' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Locations" />
            {create || update ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                      <BaseTable<LocationDto> headers={LOCATION_HEADER} keys={LOCATION_KEY} data={locationsDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} handleClick={handleClickWithEvent} permission={permission} />
                </div>

            }
        </>
    )
}