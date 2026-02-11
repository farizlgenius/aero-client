import {  useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { useToast } from "../../context/ToastContext";
import { BaseForm } from "../UiElements/BaseForm";
import { BaseTable } from "../UiElements/BaseTable";
import {  OperatorIcon } from "../../icons";
import { OperatorDto } from "../../model/Operator/OperatorDto";
import Helper from "../../utility/Helper";
import { OperatorToast } from "../../model/ToastMessage";
import { FormContent } from "../../model/Form/FormContent";
import { OperatorEndpoint } from "../../endpoint/OperatorEndpoint";
import { OperatorForm } from "../../components/form/operator/OperatorForm";
import { useLocation } from "../../context/LocationContext";
import { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { usePopup } from "../../context/PopupContext";
import { FormType } from "../../model/Form/FormProp";
import { usePagination } from "../../context/PaginationContext";


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
    const {setPagination} = usePagination();
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const {locationId} = useLocation();
    const { setRemove, setConfirmRemove,setConfirmCreate ,setCreate,setUpdate,setConfirmUpdate,setInfo,setMessage} = usePopup();
    const [form,setForm] = useState<boolean>(false);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [operatorDto, setOperatorDto] = useState<OperatorDto>(defaultDto);
    const [operatorsDto, setOperatorsDto] = useState<OperatorDto[]>([]);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: OperatorDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(OperatorEndpoint.DELETE(data.componentId))
        if (Helper.handleToastByResCode(res, OperatorToast.DELETE, toggleToast)) {
            setRemove(false)
            toggleRefresh();
        }
        })
        setRemove(true);
    }


    {/* handle Table Action */ }
    const handleEdit = (data: OperatorDto) => {
        setOperatorDto(data);
        setFormType(FormType.UPDATE)
        setForm(true);
    }

    const handleInfo = (data:OperatorDto) => {
        setOperatorDto(data);
        setFormType(FormType.INFO)
        setForm(true);
    }


    const handleClick = (e: React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
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
  
    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <OperatorIcon />,
            label: "Operator",
            content: <OperatorForm type={formType} dto={operatorDto} setDto={setOperatorDto} handleClick={handleClick} />
        }
    ];
    
    const fetchData = async (pageNumber: number, pageSize: number,locationId?:number,search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(OperatorEndpoint.PAGINATION(pageNumber,pageSize,locationId,search, startDate, endDate));
        console.log(res?.data.data)
        if (res && res.data.data) {
            console.log(res.data.data)
            setOperatorsDto(res.data.data.data);
            setPagination(res.data.data.page);
        }
    }


    return (

        <>
            <PageBreadcrumb pageTitle="Operators" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<OperatorDto> headers={HEADER} keys={KEY} data={operatorsDto} select={selectedObjects} onEdit={handleEdit} onRemove={handleRemove} onInfo={handleInfo} onClick={handleClick} permission={filterPermission(FeatureId.OPERATOR)} setSelect={setSelectedObjects} fetchData={fetchData} locationId={locationId}  />
                </div>

            }
        </>)
}