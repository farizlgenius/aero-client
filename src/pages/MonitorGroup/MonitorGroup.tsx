import { SetStateAction, useEffect, useState } from "react"
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
import { ToastMessage } from "../../model/ToastMessage";
import { useToast } from "../../context/ToastContext";
import { ActionButton } from "../../model/ActionButton";
import { MonitorGroupCommandDto } from "../../model/MonitorGroup/MonitorGroupCommandDto";
import RemoveModal from "../UiElements/RemoveModal";

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
        macAddress: "",
        locationId: locationId,
        isActive: true
    }
    const { filterPermission } = useAuth();
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [remove, setRemove] = useState<boolean>(false);
    const [mpGroupsDto, setMpGroupsDto] = useState<MonitorGroupDto[]>([]);
    const [mpGroupDto, setMpGroupDto] = useState<MonitorGroupDto>(defaultDto);
    const [selectedObject, setSelectedObjects] = useState<MonitorGroupDto[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const toggleRefresh = () => setRefresh(prev => !prev);


    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
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
            case "remove-confirm":
                removeMonitorGroup();
                break;
            case "remove-cancel":
                setRemove(false);
                break;
            case "access":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.macAddress,
                        componentId: a.componentId,
                        command: 1,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.POST_COMMAND, object);
                    if (Helper.handleToastByResCode(res, ToastMessage.POST_MONITOR_GROUP_COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "override":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.macAddress,
                        componentId: a.componentId,
                        command: 2,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.POST_COMMAND, object);
                    if (Helper.handleToastByResCode(res, ToastMessage.POST_MONITOR_GROUP_COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "force":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.macAddress,
                        componentId: a.componentId,
                        command: 3,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.POST_COMMAND, object);
                    if (Helper.handleToastByResCode(res, ToastMessage.POST_MONITOR_GROUP_COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "arm":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.macAddress,
                        componentId: a.componentId,
                        command: 4,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.POST_COMMAND, object);
                    if (Helper.handleToastByResCode(res, ToastMessage.POST_MONITOR_GROUP_COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            case "override-arm":
                selectedObject.map(async (a: MonitorGroupDto) => {
                    let object: MonitorGroupCommandDto = {
                        macAddress: a.macAddress,
                        componentId: a.componentId,
                        command: 5,
                        arg: 0
                    };
                    var res = await send.post(MonitorGroupEndpoint.POST_COMMAND, object);
                    if (Helper.handleToastByResCode(res, ToastMessage.POST_MONITOR_GROUP_COMMAND, toggleToast)) { }
                })
                console.log(selectedObject)
                break;
            default:
                break;
        }
    }
    const handleEdit = (data: MonitorGroupDto) => {
        setMpGroupDto(data)
    }

    const handleRemove = (data: MonitorGroupDto) => {
        removeElement = {
            mac: data.macAddress,
            component: data.componentId
        };
        setRemove(true);
    }

    const handleCheck = (data: MonitorGroupDto, e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleCheckAll = (data: MonitorGroupDto[], e: React.ChangeEvent<HTMLInputElement>) => {
        if (setSelectedObjects) {
            if (e.target.checked) {
                setSelectedObjects(data);
            } else {
                setSelectedObjects([]);
            }
        }
    }

    const fetchData = async () => {
        const res = await send.get(MonitorGroupEndpoint.GET_MPG(locationId))
        if (res && res.data.data) {
            setMpGroupsDto(res.data.data)
        }
    }

    const createMpGroup = async () => {
        const res = await send.post(MonitorGroupEndpoint.POST_CREATE, mpGroupDto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP_GROUP, toggleToast)) {
            setCreate(false);
            setUpdate(false);
            toggleRefresh();
        }

    }

    const removeMonitorGroup = async () => {
        const res = await send.delete(MonitorGroupEndpoint.DELETE(removeElement.mac, removeElement.component))
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_MPG, toggleToast)) {
            setRemove(false);
            toggleRefresh();
        }
    }

    const tabContent: FormContent[] = [
        {
            label: "Monitor Point Group",
            icon: <MonitorIcon />,
            content: <MonitorGroupForm setDto={setMpGroupDto} dto={mpGroupDto} handleClick={handleClick} />
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
            buttonName: "Froce Arm",
            icon: <MonitorIcon />
        }, {
            lable: "arm",
            buttonName: "Arm",
            icon: <MonitorIcon />
        }, {
            lable: "override-arm",
            buttonName: "Override Arm",
            icon: <MonitorIcon />
        },
    ];

    useEffect(() => {
        fetchData();
    }, [refresh])

    return (
        <>
            {remove && <RemoveModal handleClick={handleClick} />}
            <PageBreadcrumb pageTitle="Monitor Point Group" />
            {update || create ?

                <BaseForm tabContent={tabContent} />
                :
                <BaseTable<MonitorGroupDto> headers={MP_GP_HEADER} keys={MP_GP_KEY} handleClick={handleClick} data={mpGroupsDto} handleCheck={handleCheck} handleCheckAll={handleCheckAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObject} permission={filterPermission(FeatureId.DEVICE)} action={action} />

            }
        </>

    )
}