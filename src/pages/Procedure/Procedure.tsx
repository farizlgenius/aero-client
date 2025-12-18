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
import { ToastMessage } from "../../model/ToastMessage";
import { useToast } from "../../context/ToastContext";
import { useLocation } from "../../context/LocationContext";
import { TriggerIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { ProcedureForm } from "./ProcedureForm";

let removeObject:number = 0;

const HEADERS:string[] = ["Name","Action"];
const KEYS:string[] = ["name"];

export const Procedure = () => {

    const {toggleToast} = useToast();
    const {locationId} = useLocation();
    const { filterPermission } = useAuth();
    const [create,setCreate] = useState<boolean>(false);
    const [update,setUpdate] = useState<boolean>(false);
    const [remove,setRemove] = useState<boolean>(false);
    const [selectedObject,setSelectedObjects] = useState<ProcedureDto[]>([]);
    const [procedureDtos,setProcedureDtos] = useState<ProcedureDto[]>([]);
    const [refresh,setRefresh] = useState<boolean>(false);
        const defaultDto:ProcedureDto = {
        name: "",
        Actions: [],
        uuid: "",
        componentId: 0,
        macAddress: "",
        locationId: locationId,
        isActive: false
    }
    const [dto,setDto] = useState<ProcedureDto>(defaultDto);
    
    const toggleRefresh = () => setRefresh(prev => !prev)

    const handleEdit = (data:ProcedureDto) => {

    }

    const handleCheck = (data: ProcedureDto) => {

    }

    const handleCheckAll = (data: ProcedureDto[]) => {

    }

    const handleRemove = (data:ProcedureDto) => {
        removeObject = data.componentId;
        setRemove(true);
    }

    const handleClick = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
        switch(e.currentTarget.name){
            case "add":
                setCreate(true)
                break;
            case "create":
                createProcedure();
                break;
            case "close":
                setDto(defaultDto)
                setUpdate(false)
                setCreate(false)
                break;
            case "remove-confirm":
                removeProcedure();
                break;
            case "remove-cancel":
                setRemove(false)
                removeObject=0;
                break;
            default:
                break;
        }
    }

    const fetchData = async () => {
        const res = await send.get(ProcedureEndpoint.GET(locationId))
        if(res && res.data.data){
            setProcedureDtos(res.data.data)
        }
    }

    const removeProcedure = async () => {
        const res = await send.delete(ProcedureEndpoint.DELETE)
        if(Helper.handleToastByResCode(res,ToastMessage.DELETE_PROCEDURE,toggleToast)){
            setRemove(false);
            toggleRefresh();
        }
    }

    const createProcedure = async () => {
        const res = await send.post(ProcedureEndpoint.CREATE,dto)
         if(Helper.handleToastByResCode(res,ToastMessage.DELETE_PROCEDURE,toggleToast)){
            setCreate(false);
            toggleRefresh();
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    const tabContent:FormContent[] = [
        {
            label:"Procedure",
            icon:<TriggerIcon />,
            content:<ProcedureForm handleClick={handleClick} dto={dto} setDto={setDto} isUpdate={update}  />
        }
    ]

    return (
    <>
    {remove && <RemoveModal header='Remove Procedure' body='Please Click Confirm if you want to remove this Procedure' handleClick={handleClick} />}
    <PageBreadcrumb pageTitle="Procedure"/>
    
    {
        create || update ? 
        <BaseForm tabContent={tabContent}/>
        :
        <BaseTable<ProcedureDto> keys={KEYS} headers={HEADERS} data={procedureDtos} onEdit={handleEdit} onRemove={handleRemove} handleCheck={handleCheck} handleCheckAll={handleCheckAll} onClick={handleClick} selectedObject={selectedObject} permission={filterPermission(FeatureId.TRIGGER)} />

    }

    </>
)
}