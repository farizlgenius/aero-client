import { useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { BaseTable } from "../UiElements/BaseTable";
import { ProcedureDto } from "../../model/Procedure/ProcedureDto";
import { BaseForm } from "../UiElements/BaseForm";
import { FormContent } from "../../model/Form/FormContent";
import RemoveModal from "../UiElements/RemoveModal";
import { send } from "../../api/api";
import { ProcedureEndpoint } from "../../endpoint/ProcedureEndpoint";
import Helper from "../../utility/Helper";
import { useToast } from "../../context/ToastContext";
import { useLocation } from "../../context/LocationContext";
import { TriggerIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { ProcedureForm } from "./ProcedureForm";
import { FormType } from "../../model/Form/FormProp";
import { ProcedureToast } from "../../model/ToastMessage";
import { usePopup } from "../../context/PopupContext";
import { usePagination } from "../../context/PaginationContext";


const HEADERS:string[] = ["Name","Action"];
const KEYS:string[] = ["name"];

export const Procedure = () => {

    const {toggleToast} = useToast();
    const {locationId} = useLocation();
    const { filterPermission } = useAuth();
    const [form,setForm] = useState<boolean>(false);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);
    const [selectedObject,setSelectedObjects] = useState<ProcedureDto[]>([]);
    const [procedureDtos,setProcedureDtos] = useState<ProcedureDto[]>([]);
    const { setRemove, setConfirmRemove,setConfirmCreate ,setCreate,setUpdate,setConfirmUpdate,setInfo,setMessage} = usePopup();
    const {setPagination} = usePagination();
    const [refresh,setRefresh] = useState<boolean>(false);
        const defaultDto:ProcedureDto = {
            name: "",
            Actions: [],
            componentId: 0,
            mac: "",
            locationId: locationId,
            isActive: false,
            hardwareName: ""
        }
    const [dto,setDto] = useState<ProcedureDto>(defaultDto);
    
    const toggleRefresh = () => setRefresh(prev => !prev)



   const handleRemove = (data: ProcedureDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(ProcedureEndpoint.DELETE(data.componentId))
        if (Helper.handleToastByResCode(res, ProcedureToast.DELETE, toggleToast)) {
            setRemove(false)
            toggleRefresh();
        }
        })
        setRemove(true);
    }


    {/* handle Table Action */ }
    const handleEdit = (data: ProcedureDto) => {
        setDto(data);
        setFormType(FormType.UPDATE)
        setForm(true);
    }

    const handleInfo = (data:ProcedureDto) => {
        setDto(data);
        setFormType(FormType.INFO)
        setForm(true);
    }

    const handleClick = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
       switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE)
                setForm(true);
                break;
            case "delete":
                if(selectedObject.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObject.map(async (a:ProcedureDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(ProcedureEndpoint.DLETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,ProcedureToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(ProcedureEndpoint.CREATE,dto);
                    if (Helper.handleToastByResCode(res, ProcedureToast.CREATE, toggleToast)) {
                        setForm(false)
                        setDto(defaultDto)
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(ProcedureEndpoint.UPDATE,dto)
                    if (Helper.handleToastByResCode(res, ProcedureToast.UPDATE, toggleToast)) {
                        setForm(false)
                        setDto(defaultDto)
                        toggleRefresh();
                    }
                });
                setUpdate(true)
                break;
            case "close":
            case "cancel":
                setDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }

   const fetchData = async (pageNumber: number, pageSize: number,locationId?:number,search?: string, startDate?: string, endDate?: string) => {
           const res = await send.get(ProcedureEndpoint.PAGINATION(pageNumber,pageSize,locationId,search, startDate, endDate));
           console.log(res?.data.data)
           if (res && res.data.data) {
               console.log(res.data.data)
               setProcedureDtos(res.data.data.data);
               setPagination(res.data.data.page);
           }
       }




    const tabContent:FormContent[] = [
        {
            label:"Procedure",
            icon:<TriggerIcon />,
            content:<ProcedureForm handleClick={handleClick} dto={dto} setDto={setDto} type={formType}  />
        }
    ]

    return (
    <>
    <PageBreadcrumb pageTitle="Procedure"/>
    
    {
       form ? 
        <BaseForm tabContent={tabContent}/>
        :
        <BaseTable<ProcedureDto> refresh={refresh} keys={KEYS} headers={HEADERS} data={procedureDtos} onInfo={handleInfo} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClick} select={selectedObject} setSelect={setSelectedObjects} permission={filterPermission(FeatureId.TRIGGER)} fetchData={fetchData} locationId={locationId} />

    }

    </>
)
}