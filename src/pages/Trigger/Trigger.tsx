import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { FormContent } from "../../model/Form/FormContent";
import { BaseForm } from "../UiElements/BaseForm";
import { BaseTable } from "../UiElements/BaseTable";
import { TriggerDto } from "../../model/Trigger/TriggerDto";
import { useLocation } from "../../context/LocationContext";
import { TriggerIcon } from "../../icons";
import { TriggerForm } from "./TriggerForm";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { send } from "../../api/api";
import { TriggerEndpoint } from "../../endpoint/TriggerEndpoint";
import Helper from "../../utility/Helper";
import { ToastMessage } from "../../model/ToastMessage";
import { useToast } from "../../context/ToastContext";

const KEYS: string[] = ["Name", "Action"];
const HEADERS: string[] = ["name"];

export const Trigger = () => {
    const { locationId } = useLocation();
    const { toggleToast } = useToast();
    const { filterPermission } = useAuth();
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [selectedObject, setSelectedObjects] = useState<TriggerDto[]>([]);
    const [triggerDtos, setTriggerDtos] = useState<TriggerDto[]>([]);
    const defaultDto: TriggerDto = {
        command: -1,
        procedureId: -1,
        sourceType: -1,
        sourceNumber: -1,
        tranType: -1,
        codeMap: [],
        timeZone: -1,
        uuid: "",
        componentId: 0,
        macAddress: "",
        locationId: locationId,
        isActive: true
    }
    const [dto, setDto] = useState<TriggerDto>(defaultDto);


    const handleEdit = (data: TriggerDto) => {

    }

    const handleCheck = (data: TriggerDto, e: React.ChangeEvent<HTMLInputElement>) => {

    }

    const handleCheckAll = (data: TriggerDto[], e: React.ChangeEvent<HTMLInputElement>) => {

    }

    const handleRemove = (data: TriggerDto) => {

    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true)
                break;
            case "create":
                createTrigger();
                break;
            case "close":
                setCreate(false)
                setUpdate(false);
                break;
            default:
                break;
        }
    }

    const tabContent: FormContent[] = [
        {
            label: "Trigger",
            icon: <TriggerIcon />,
            content: <TriggerForm handleClick={handleClick} dto={dto} setDto={setDto} isUpdate={update} />
        }
    ]

    const createTrigger = async () => {
        var res = await send.post(TriggerEndpoint.CREATE,dto)
        if(Helper.handleToastByResCode(res,ToastMessage.CREATE_TRIGGER,toggleToast)){}
    }

    const fetchData = async () => {
        var res = await send.get(TriggerEndpoint.GET(locationId))
        if(res && res.data.data){
            setTriggerDtos(res.data.data)
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    return (
        <>
            <PageBreadcrumb pageTitle="Trigger" />
            {
                create || update ?
                    <BaseForm tabContent={tabContent} />
                    :
                    <BaseTable<TriggerDto> keys={KEYS} headers={HEADERS} data={triggerDtos} handleEdit={handleEdit} handleRemove={handleRemove} handleCheck={handleCheck} handleCheckAll={handleCheckAll} handleClick={handleClick} selectedObject={selectedObject} permission={filterPermission(FeatureId.TRIGGER)} />

            }

        </>
    )
}