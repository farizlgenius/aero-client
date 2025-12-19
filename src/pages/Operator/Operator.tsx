import { SetStateAction, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { useToast } from "../../context/ToastContext";
import RemoveModal from "../UiElements/RemoveModal";
import { BaseForm } from "../UiElements/BaseForm";
import Button from "../../components/ui/button/Button";
import { BaseTable } from "../UiElements/BaseTable";
import { AddIcon, OperatorIcon } from "../../icons";
import { OperatorDto } from "../../model/Operator/OperatorDto";
import { HttpMethod } from "../../enum/HttpMethod";
import HttpRequest from "../../utility/HttpRequest";
import Helper from "../../utility/Helper";
import { OperatorToast, ToastMessage } from "../../model/ToastMessage";
import { FormContent } from "../../model/Form/FormContent";
import { RoleEndpoint } from "../../endpoint/RoleEndpoint";
import { OperatorEndpoint } from "../../endpoint/OperatorEndpoint";
import { OperatorForm } from "../../components/form/operator/OperatorForm";
import { useLocation } from "../../context/LocationContext";
import api, { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { usePopup } from "../../context/PopupContext";
import { FormType } from "../../model/Form/FormProp";


var removeTarget: number = 0;

const defaultDto: OperatorDto = {
    componentId: 0,
    username: "",
    password: "",
    email: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    imagePath: "",
    roleId: -1,
    locationIds:[],
}

export const HEADER: string[] = ["Username", "Action"]
export const KEY: string[] = ["username"];

export const Operator = () => {
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const { setRemove, setConfirmRemove,setConfirmCreate ,setCreate,setUpdate,setConfirmUpdate,setInfo,setMessage} = usePopup();
    const [form,setForm] = useState<boolean>(false);
    const [formType,setFormType] = useState<FormType>(FormType.Create);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [operatorDto, setOperatorDto] = useState<OperatorDto>(defaultDto);
    const [operatorsDto, setOperatorsDto] = useState<OperatorDto[]>([]);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: OperatorDto) => {
        removeTarget = data.componentId;
        setConfirmRemove(() => async () => {
            const res = await send.delete(OperatorEndpoint.DELETE(removeTarget))
        if (Helper.handleToastByResCode(res, OperatorToast.DELETE, toggleToast)) {
            setRemove(false)
            toggleRefresh();
            removeTarget = 0;
        }
        })
        setRemove(true);
    }


    {/* handle Table Action */ }
    const handleEdit = (data: OperatorDto) => {
        setOperatorDto(data);
        setFormType(FormType.Update)
        setForm(true);
    }

    const handleInfo = (data:OperatorDto) => {
        setOperatorDto(data);
        setFormType(FormType.Info)
        setForm(true);
    }


    const handleClick = (e: React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.Create)
                setForm(true);
                break;
            case "delete":
                if(selectedObjects.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObjects.map(async (a:OperatorDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(OperatorEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,OperatorToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(OperatorEndpoint.CREATE,operatorDto);
                    if (Helper.handleToastByResCode(res, OperatorToast.CREATE, toggleToast)) {
                        setForm(false)
                        setOperatorDto(defaultDto)
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(OperatorEndpoint.UPDATE,operatorDto)
                    if (Helper.handleToastByResCode(res, OperatorToast.UPDATE, toggleToast)) {
                        setForm(false)
                        setOperatorDto(defaultDto)
                        toggleRefresh();
                    }
                });
                setUpdate(true)
                break;
            case "close":
            case "cancel":
                setOperatorDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }


    const [selectedObjects, setSelectedObjects] = useState<OperatorDto[]>([]);
  
    const fetchDate = async () => {
        const res = await send.get(OperatorEndpoint.GET(String(locationId)));
        console.log(res?.data.data)
        if (res && res.data.data) {
            setOperatorsDto(res.data.data);
        }
    }

    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <OperatorIcon />,
            label: "Operator",
            content: <OperatorForm type={formType} dto={operatorDto} setDto={setOperatorDto} handleClick={handleClick} />
        }
    ];
    useEffect(() => {
        fetchDate();
    }, [refresh])


    return (

        <>
            <PageBreadcrumb pageTitle="Operators" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<OperatorDto> headers={HEADER} keys={KEY} data={operatorsDto} select={selectedObjects} onEdit={handleEdit} onRemove={handleRemove} onInfo={handleInfo} onClick={handleClick} permission={filterPermission(FeatureId.OPERATOR)} setSelect={setSelectedObjects} />
                </div>

            }
        </>)
}