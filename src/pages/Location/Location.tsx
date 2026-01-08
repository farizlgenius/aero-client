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
import { LocationToast } from "../../model/ToastMessage";
import { BaseTable } from "../UiElements/BaseTable";
import { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { usePopup } from "../../context/PopupContext";
import { FeatureId } from "../../enum/FeatureId";
import { FormType } from "../../model/Form/FormProp";

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
    const { user,filterPermission } = useAuth();
    const { setRemove, setConfirmRemove,setConfirmCreate,setInfo,setMessage ,setCreate,setUpdate,setConfirmUpdate} = usePopup();
    const [form, setForm] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [locationDto, setLocationDto] = useState<LocationDto>(defaultDto);
    const [locationsDto, setLocationsDto] = useState<LocationDto[]>([]);
    const [select,setSelect] = useState<LocationDto[]>([])
    const [formType,setFormType] = useState<FormType>(FormType.Create);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: LocationDto) => {
        removeTarget = data.componentId;
        setRemove(true);
        setConfirmRemove(() => async () => {
            const res = await HttpRequest.send(HttpMethod.DELETE, LocationEndpoint.DELETE(removeTarget))
            if (Helper.handleToastByResCode(res, LocationToast.DELETE, toggleToast)) {
                toggleRefresh();
                removeTarget = 0;
            }
        })
    }

    const handleInfo = (data:LocationDto) => {
        setFormType(FormType.Info);
        setLocationDto(data);
        setForm(true);
    }

    {/* handle Table Action */ }
    const handleEdit = (data: LocationDto) => {
        setFormType(FormType.Update);
        setLocationDto(data);
        setForm(true);
    }


    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.Create);
                setForm(true);
                break;
            case "delete":
                if(select.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }else{
                    setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    select.map(async (a:LocationDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(LocationEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,LocationToast.DELETE_RANGE,toggleToast)){
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
                        setForm(false)
                        toggleRefresh();
                        setLocationDto(defaultDto)
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await HttpRequest.send(HttpMethod.PUT, LocationEndpoint.UPDATE, true, locationDto)
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


    const fetchDate = async () => {
        const res = await send.get(LocationEndpoint.GET);
        console.log(res?.data.data)
        if (res && res.data.data) {
            setLocationsDto(res.data.data);
        }
    }



    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <LocationIcon />,
            label: "Intevals",
            content: <LocationForm type={formType} dto={locationDto} setDto={setLocationDto} handleClick={handleClickWithEvent} />
        }
    ];




    useEffect(() => {
        fetchDate();
    }, [refresh])


    return (
        <>

            <PageBreadcrumb pageTitle="Locations" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<LocationDto> headers={LOCATION_HEADER} keys={LOCATION_KEY} data={locationsDto} select={select} setSelect={setSelect} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClickWithEvent} permission={filterPermission(FeatureId.LOCATION)} onInfo={handleInfo} />
                </div>

            }
        </>
    )
}