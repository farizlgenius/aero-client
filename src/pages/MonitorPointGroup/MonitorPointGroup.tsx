import { useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { BaseForm } from "../UiElements/BaseForm";
import { BaseTable } from "../UiElements/BaseTable";
import { FormContent } from "../../model/Form/FormContent";
import { MonitorPointGroupDto } from "../../model/MonitorPointGroup/MonitorPointGroupDto";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { send } from "../../api/api";

export const MP_GP_HEADER: string[] = ["Name", "Main Controller", "Module", "Mode", "Masked", "Status", "Action"]
export const MP_GP_KEY: string[] = ["name", "macAddress", "moduleId", "monitorPointMode", "isMask"];

export const MonitorPointGroup = () => {
    const {filterPermission} = useAuth();
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [mpGroupsDto,setMpGroupsDto] = useState<MonitorPointGroupDto[]>([]);
    const [mpGroupDto,setMpGroupDto] = useState<MonitorPointGroupDto>();
    const [selectedObject,setSelectedObjects] = useState<MonitorPointGroupDto[]>([]);
    
    const tabContent:FormContent[] = [
        {
            label:"Monitor Point Group",
            icon:<MonitorPointGroup/>,
            content:<h1>123</h1>
        }
    ]

    const handleClick = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
        switch(e.currentTarget.name){
            case "add":
                setCreate(true);
            break;
            case "create":
                createMpGroup();
                break;
            case "edit":
                setUpdate(true)
                break;
            case "close":
                setCreate(false)
                setUpdate(false)
                break;
            default:
                break;
        }
    }

    const handleEdit = (data:MonitorPointGroupDto) => {}

    const handleRemove = (data:MonitorPointGroupDto) => {}

    const handleCheck = (data: MonitorPointGroupDto, e: React.ChangeEvent<HTMLInputElement>) => {

    }

    const handleCheckAll = (data: MonitorPointGroupDto[], e: React.ChangeEvent<HTMLInputElement>) => {

    }

    const fetchData = async () => {

    }

    const createMpGroup = async () => {

    }

    useEffect(() => {
        fetchData();
    },[])

    return (
        <>
            <PageBreadcrumb pageTitle="Monitor Point Group" />
            {update || create ?

                <BaseForm tabContent={tabContent} />
                :

                <BaseTable<MonitorPointGroupDto> headers={MP_GP_HEADER} keys={MP_GP_KEY} handleClick={handleClick} data={mpGroupsDto} handleCheck={handleCheck} handleCheckAll={handleCheckAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObject}  permission={filterPermission(FeatureId.DEVICE)} />

            }
        </>

    )
}