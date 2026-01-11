import {  useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { BaseForm } from "../UiElements/BaseForm";
import { BaseTable } from "../UiElements/BaseTable";
import { FormContent } from "../../model/Form/FormContent";
import { MonitorGroupDto } from "../../model/MonitorGroup/MonitorGroupDto";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { send } from "../../api/api";
import { MonitorIcon } from "../../icons";
import { MonitorGroupForm } from "../../components/form/monitor-group/MonitorGroupForm";
import { useLocation } from "../../context/LocationContext";
import { MonitorGroupEndpoint } from "../../endpoint/MonitorGroupEndpoint";
import Helper from "../../utility/Helper";
import { useToast } from "../../context/ToastContext";
import { ActionButton } from "../../model/ActionButton";
import { MonitorGroupCommandDto } from "../../model/MonitorGroup/MonitorGroupCommandDto";
import { FormType } from "../../model/Form/FormProp";
import { usePopup } from "../../context/PopupContext";
import { MonitorGroupToast } from "../../model/ToastMessage";

export const MP_GP_HEADER: string[] = ["Name", "Main Controller", "Action"]
export const MP_GP_KEY: string[] = ["name", "macAddress",];
var removeElement = {
    mac: "",
    component: 0
};

export const MonitorGroup = () => {
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const defaultDto: MonitorGroupDto = {
        name: "",
        nMpCount: 0,
        nMpList: [],
        uuid: "",
        componentId: 0,
        mac: "",
        locationId: locationId,
        isActive: true,
        hardwareName: ""
    }
    const { filterPermission } = useAuth();
    const [form,setForm] = useState<boolean>(false);
    const { setConfirmCreate,setConfirmRemove,setConfirmUpdate,setCreate,setRemove,setUpdate,setMessage,setInfo } = usePopup();
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);
    const [mpGroupsDto, setMpGroupsDto] = useState<MonitorGroupDto[]>([]);
    const [mpGroupDto, setMpGroupDto] = useState<MonitorGroupDto>(defaultDto);
    const [selectedObject, setSelectedObjects] = useState<MonitorGroupDto[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const toggleRefresh = () => setRefresh(prev => !prev);


    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE);
                setMpGroupDto(defaultDto);
                setForm(true);
                break;
            case "delete":
                if(selectedObject.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObject.map(async (a:MonitorGroupDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(MonitorGroupEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,MonitorGroupToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(MonitorGroupEndpoint.CREATE, mpGroupDto)
                    if (Helper.handleToastByResCode(res, MonitorGroupToast.CREATE, toggleToast)) {
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setCreate(true)
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(MonitorGroupEndpoint.UPDATE, mpGroupDto)
                    if (Helper.handleToastByResCode(res, MonitorGroupToast.UPDATE, toggleToast)) {
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setUpdate(true)
                break;
            case "cancel":
            case "close":
                setMpGroupDto(defaultDto)
                setForm(false)
                break;
            case "access":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.mac,
                        componentId: a.componentId,
                        command: 1,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.COMMAND, object);
                    if (Helper.handleToastByResCode(res, MonitorGroupToast.COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "override":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.mac,
                        componentId: a.componentId,
                        command: 2,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.COMMAND, object);
                    if (Helper.handleToastByResCode(res, MonitorGroupToast.COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "force":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.mac,
                        componentId: a.componentId,
                        command: 3,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.COMMAND, object);
                    if (Helper.handleToastByResCode(res, MonitorGroupToast.COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "arm":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.mac,
                        componentId: a.componentId,
                        command: 4,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.COMMAND, object);
                    if (Helper.handleToastByResCode(res, MonitorGroupToast.COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "override-arm":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.mac,
                        componentId: a.componentId,
                        command: 5,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.COMMAND, object);
                    if (Helper.handleToastByResCode(res, MonitorGroupToast.COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            default:
                break;
        }
    }
    const handleEdit = (data: MonitorGroupDto) => {
        setMpGroupDto(data)
        setFormType(FormType.UPDATE)
        setForm(true)
    }

    const handleRemove = (data: MonitorGroupDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(MonitorGroupEndpoint.DELETE(data.mac, data.componentId))
            if (Helper.handleToastByResCode(res, MonitorGroupToast.DELETE, toggleToast)) {
                setRemove(false);
                toggleRefresh();
            }
        })
        setRemove(true);
    }

    const handleInfo = (data: MonitorGroupDto) => {
        setMpGroupDto(data);
        setFormType(FormType.INFO);
        setForm(true);
    }

    const fetchData = async () => {
        const res = await send.get(MonitorGroupEndpoint.GET(locationId))
        if (res && res.data.data) {
            setMpGroupsDto(res.data.data)
        }
    }



    const tabContent: FormContent[] = [
        {
            label: "Monitor Group",
            icon: <MonitorIcon />,
            content: <MonitorGroupForm setDto={setMpGroupDto} dto={mpGroupDto} handleClick={handleClick} type={formType} />
        }
    ]
    const action: ActionButton[] = [
        {
            lable: "access",
            buttonName: "Access",
            icon: <MonitorIcon />
        },
        {
            lable: "override",
            buttonName: "Override",
            icon: <MonitorIcon />
        }, {
            lable: "force",
            buttonName: "Froce",
            icon: <MonitorIcon />
        }, {
            lable: "arm",
            buttonName: "Arm",
            icon: <MonitorIcon />
        }, {
            lable: "override-arm",
            buttonName: "Override",
            icon: <MonitorIcon />
        },
    ];

    useEffect(() => {
        fetchData();
    }, [refresh])

    return (
        <>
            <PageBreadcrumb pageTitle="Monitor Group" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <BaseTable<MonitorGroupDto> headers={MP_GP_HEADER} keys={MP_GP_KEY} onClick={handleClick} data={mpGroupsDto} onInfo={handleInfo} onEdit={handleEdit} onRemove={handleRemove} select={selectedObject} setSelect={setSelectedObjects} permission={filterPermission(FeatureId.DEVICE)} action={action} />

            }
        </>

    )
}