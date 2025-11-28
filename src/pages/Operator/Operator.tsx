import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { useToast } from "../../context/ToastContext";
import DangerModal from "../UiElements/DangerModal";
import { BaseForm } from "../UiElements/BaseForm";
import Button from "../../components/ui/button/Button";
import { BaseTable } from "../UiElements/BaseTable";
import { AddIcon, OperatorIcon } from "../../icons";
import { OperatorDto } from "../../model/Operator/OperatorDto";
import { HttpMethod } from "../../enum/HttpMethod";
import HttpRequest from "../../utility/HttpRequest";
import Helper from "../../utility/Helper";
import { ToastMessage } from "../../model/ToastMessage";
import { FormContent } from "../../model/Form/FormContent";
import { RoleEndpoint } from "../../endpoint/RoleEndpoint";
import { OpearatorEndpoint } from "../../endpoint/OperatorEndpoint";
import { OperatorForm } from "../../components/form/operator/OperatorForm";
import { useLocation } from "../../context/LocationContext";
import api, { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";


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

export const LOCATION_HEADER: string[] = ["Username", "Action"]
export const LOCATION_KEY: string[] = ["username"];


export const Operator = () => {
    const { locationId } = useLocation();
    const { user } = useAuth();
    const { toggleToast } = useToast();
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [remove, setRemove] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [operatorDto, setOperatorDto] = useState<OperatorDto>(defaultDto);
    const [operatorsDto, setOperatorsDto] = useState<OperatorDto[]>([]);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: OperatorDto) => {
        removeTarget = data.componentId;
        setRemove(true);
    }
    const handleOnClickCloseRemove = () => {
        setRemove(false);
    }
    const handleOnClickConfirmRemove = () => {
        setRemove(false);
        removeLocation(removeTarget);
    }

    {/* handle Table Action */ }
    const handleEdit = (data: OperatorDto) => {
        setOperatorDto(data);
        setUpdate(true);
    }


    const handleClick = (e: React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true);
                break;
            case "create":
                createLocation(operatorDto);
                break;
            case "update":
                updateLocation(operatorDto)
                break;
            case "close":
            case "cancel":
                setOperatorDto(defaultDto)
                setCreate(false);
                setUpdate(false);
                break;
            default:
                break;
        }
    }

    const createLocation = async (dto: OperatorDto) => {
        const res = await HttpRequest.send(HttpMethod.POST, OpearatorEndpoint.CREATE_OPER,false,dto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }

    const updateLocation = async (dto: OperatorDto) => {
        const res = await HttpRequest.send(HttpMethod.PUT, OpearatorEndpoint.UPDATE_OPER,false,dto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }

    const removeLocation = async (id: number) => {
        const res = await HttpRequest.send(HttpMethod.DELETE, RoleEndpoint.DELETE_ROLE + id)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setRemove(false)
            toggleRefresh();
        }
    }

    const [selectedObjects, setSelectedObjects] = useState<OperatorDto[]>([]);
    const handleCheckedAll = (data: OperatorDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: OperatorDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
        const res = await send.get(OpearatorEndpoint.GET_OPER(String(locationId)));
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
            content: <OperatorForm isUpdate={update} dto={operatorDto} setDto={setOperatorDto} handleClick={handleClick} />
        }
    ];



    useEffect(() => {
        fetchDate();
    }, [refresh])


    return (

        <>
            <PageBreadcrumb pageTitle="Operators" />
            {remove && <DangerModal header='Remove Operator' body='Please Click Confirm if you want to remove operator' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {create || update ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<OperatorDto> headers={LOCATION_HEADER} keys={LOCATION_KEY} data={operatorsDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} handleClick={handleClick} />
                </div>

            }
        </>)
}