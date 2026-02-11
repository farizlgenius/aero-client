import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { AreaDto } from "../../model/Area/AreaDto";
import HttpRequest from "../../utility/HttpRequest";
import Helper from "../../utility/Helper";
import RemoveModal from "../UiElements/RemoveModal";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { AddIcon, AreaIcon } from "../../icons";
import { HttpMethod } from "../../enum/HttpMethod";
import { BaseForm } from "../UiElements/BaseForm";
import { FormContent } from "../../model/Form/FormContent";
import { AreaForm } from "../../components/form/area/AreaForm";
import { BaseTable } from "../UiElements/BaseTable";
import { OccupancyForm } from "../../components/form/area/OccupancyForm";
import { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { useLocation } from "../../context/LocationContext";
import { usePagination } from "../../context/PaginationContext";
import { FormType } from "../../model/Form/FormProp";
import { usePopup } from "../../context/PopupContext";
import { AccessAreaToast } from "../../model/ToastMessage";
import { AreaEndpoint } from "../../endpoint/AreaEndpoint";

var removeTarget: number;
var defaultDto: AreaDto = {
    // base
    name: "",
    multiOccupancy: -1,
    accessControl: -1,
    occControl: 0,
    occSet: 0,
    occMax: 0,
    occUp: 0,
    occDown: 0,
    areaFlag: 0x00,
    componentId: 0,
    locationId: 1,
    isActive: true
}
const AREA_HEADERS = ["Name", "Action"]
const AREA_KEY = ["name"]

export const Area = () => {
    const { toggleToast } = useToast();
    const {locationId} = useLocation();
    const {setPagination} = usePagination();
    const { setRemove, setConfirmRemove,setConfirmCreate ,setCreate,setUpdate,setConfirmUpdate,setInfo,setMessage} = usePopup();
    const { filterPermission } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [areaDto, setAreaDto] = useState<AreaDto>(defaultDto);
    {/* Modal */ }
    const [form,setForm] = useState<boolean>(false);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE)
                setForm(true);
                break;
            case "delete":
                if(selectedObjects.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObjects.map(async (a:AreaDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(AreaEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,AccessAreaToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(AreaEndpoint.CREATE,areaDto);
                    if (Helper.handleToastByResCode(res, AccessAreaToast.CREATE, toggleToast)) {
                        setForm(false)
                        setAreaDto(defaultDto)
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(AreaEndpoint.UPDATE,areaDto)
                    if (Helper.handleToastByResCode(res, AccessAreaToast.UPDATE, toggleToast)) {
                        setForm(false)
                        setAreaDto(defaultDto)
                        toggleRefresh();
                    }
                });
                setUpdate(true)
                break;
            case "close":
            case "cancel":
                setAreaDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }

    const handleRemove = (data: AreaDto) => {
        removeTarget = data.componentId;
        setConfirmRemove(() => async () => {
            const res = await send.delete(AreaEndpoint.DELETE(removeTarget))
        if (Helper.handleToastByResCode(res, AccessAreaToast.DELETE, toggleToast)) {
            setRemove(false)
            toggleRefresh();
            removeTarget = 0;
        }
        })
        setRemove(true);
    }


    {/* handle Table Action */ }
    const handleEdit = (data: AreaDto) => {
        setAreaDto(data);
        setFormType(FormType.UPDATE)
        setForm(true);
    }

    const handleInfo = (data:AreaDto) => {
        setAreaDto(data);
        setFormType(FormType.INFO)
        setForm(true);
    }

    {/* Group Data */ }
    const [areasDto, setAreasDto] = useState<AreaDto[]>([]);
    const fetchData = async (pageNumber: number, pageSize: number,locationId?:number,search?: string, startDate?: string, endDate?: string) => {
            const res = await send.get(AreaEndpoint.PAGINATION(pageNumber,pageSize,locationId,search, startDate, endDate));
            console.log(res?.data.data)
            if (res && res.data.data) {
                console.log(res.data.data)
                setAreasDto(res.data.data.data);
                setPagination(res.data.data.page);
            }
        }



    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<AreaDto[]>([]);
    

    {/* Form */ }
    const createContent: FormContent[] = [
        {
            icon: <AreaIcon />,
            label: "Area",
            content: <AreaForm dto={areaDto} setDto={setAreaDto} handleClick={handleClick} type={formType} />
        }, {
            icon: <AreaIcon />,
            label: "Occupancy",
            content: <OccupancyForm dto={areaDto} setDto={setAreaDto} handleClick={handleClick} type={formType} />
        }
    ];


    return (
        <>
            <PageBreadcrumb pageTitle="Access Area" />
            {form ?
                <BaseForm tabContent={createContent} />
                :
                <div className="space-y-6">
                    <BaseTable<AreaDto> headers={AREA_HEADERS} keys={AREA_KEY} data={areasDto} select={selectedObjects} setSelect={setSelectedObjects} onInfo={handleInfo} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClick} permission={filterPermission(FeatureId.ACCESSAREA)} fetchData={fetchData} locationId={locationId} />

                </div>
            }


        </>
    )
}