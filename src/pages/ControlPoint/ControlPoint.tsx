import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { AddIcon, ControlIcon, OffIcon, OnIcon, ToggleIcon } from '../../icons';
import HttpRequest from '../../utility/HttpRequest';
import ControlPointForm from './ControlPointForm';
import Logger from '../../utility/Logger';
import { ControlPointDto } from '../../model/ControlPoint/ControlPointDto';
import { StatusDto } from '../../model/StatusDto';
import { OutputTrigger } from '../../model/ControlPoint/OutputTrigger';
import Helper from '../../utility/Helper';
import { useToast } from '../../context/ToastContext';
import { ControlPointToast, ToastMessage } from '../../model/ToastMessage';
import { HttpMethod } from '../../enum/HttpMethod';
import { ControlPointEndpoint } from '../../endpoint/ControlPointEndpoint';
import { send } from '../../api/api';
import { useLocation } from '../../context/LocationContext';
import { BaseTable } from '../UiElements/BaseTable';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';
import { TableCell } from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';
import { ActionButton } from '../../model/ActionButton';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import SignalRService from '../../services/SignalRService';
import { usePopup } from '../../context/PopupContext';
import { FormType } from '../../model/Form/FormProp';

// Define Global Variable



export const OUTPUT_TABLE_HEADER: string[] = ["Name", "Main Controller", "Module", "Mode","Offline","Pulse Time", "Status", "Action"]
export const OUTPUT_KEY: string[] = ["name", "macAddressDescription", "moduleDescription", "relayModeDescription","offlineModeDescription","defaultPulse"];

const ControlPoint = () => {
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const { setCreate,setRemove,setMessage,setUpdate,setInfo,setConfirmCreate,setConfirmRemove,setConfirmUpdate } = usePopup();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [form,setForm] = useState<boolean>(false);
    const [formType,setFormType] = useState<FormType>(FormType.Create)


    {/* handle Table Action */ }
    const handleEdit = (data: ControlPointDto) => {
        setControlPointDto(data)
        setFormType(FormType.Update)
        setForm(true)
    }

    const handleInfo = (data:ControlPointDto) => {
        console.log(data)
        setControlPointDto(data);
        setFormType(FormType.Info);
        setForm(true);
    }

    const handleRemove = (data: ControlPointDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(ControlPointEndpoint.DELETE(data.componentId))
            if(Helper.handleToastByResCode(res,ControlPointToast.DELETE,toggleToast)){
                toggleRefresh();
            }
        })
        setRemove(true);
    }


    {/* Output Data */ }
    const defaultDto: ControlPointDto = {
        name: "",
        moduleId: -1,
        outputNo: -1,
        relayMode: -1,
        offlineMode: -1,
        defaultPulse: 1,

        // base
        uuid: "",
        componentId: -1,
        macAddress: '',
        locationId: locationId,
        isActive: true,
        relayModeDescription: '',
        offlineModeDescription: '',
        macAddressDescription: '',
        moduleDescription: ''
    }
    const [controlPointDto, setControlPointDto] = useState<ControlPointDto>(defaultDto);
    const [outputsDto, setOutputsDto] = useState<ControlPointDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(ControlPointEndpoint.GET(locationId));
        if (res && res.data.data) {
            console.log(res.data.data)
            setOutputsDto(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: ControlPointDto) => ({
                macAddress: a.macAddress,
                componentId: a.componentId,
                status: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.data.forEach((a: ControlPointDto) => {
                fetchStatus(a.macAddress, a.componentId);
            });

        }
    };

    const fetchStatus = async (scpMac: string, cpNo: number) => {
        const res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.STATUS + scpMac + "/" + cpNo);
        Logger.info(res);
    };





    {/* UseEffect */ }
    useEffect(() => {
        // Initialize SignalR as soon as app starts
        var connection = SignalRService.getConnection();
        connection.on("CpStatus",
            (scpMac: string, first: number, status: string) => {
                console.log(scpMac)
                console.log(first)
                console.log(status)
                setStatus((prev) =>
                    prev.map((a) =>
                        a.macAddress == scpMac && a.componentId == first
                            ? {
                                ...a,
                                status: status,
                            }
                            : {
                                // scpIp:ScpIp,
                                // cpNumber:first,
                                // status:status[0]
                                ...a
                            }
                    )
                );
                toggleRefresh();
            });
        return () => {
            //SignalRService.stopConnection()
        };

    }, []);

    useEffect(() => {
        fetchData();
    }, [refresh])



    {/* Button Command */ }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name)
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.Create)
                setForm(true)
                break;
            case "delete":
                if(selectedObjects.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObjects.map(async (a:ControlPointDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(ControlPointEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,ControlPointToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(ControlPointEndpoint.CREATE, controlPointDto)
                    if (Helper.handleToastByResCode(res, ControlPointToast.CREATE, toggleToast)) {
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(ControlPointEndpoint.UPDATE,controlPointDto)
                    if(Helper.handleToastByResCode(res,ControlPointToast.UPDATE,toggleToast)){
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setUpdate(true);
                break;
            case "cancel":
            case "close":
                setControlPointDto(defaultDto)
                setForm(false);
                break;
            case "on":
                console.log(selectedObjects);
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a: ControlPointDto) => {
                        let data: OutputTrigger = {
                            macAddress: a.macAddress,
                            componentId: a.componentId,
                            command: 2
                        }
                        const res = await send.post(ControlPointEndpoint.TRIGGER, data);
                        Helper.handleToastByResCode(res, ToastMessage.TOGGLE_OUTPUT, toggleToast)
                    });
                }

                break;
            case "off":
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a: ControlPointDto) => {
                        let data: OutputTrigger = {
                            macAddress: a.macAddress,
                            componentId: a.componentId,
                            command: 1
                        }
                        const res = await send.post(ControlPointEndpoint.TRIGGER, data);
                        Helper.handleToastByResCode(res, ToastMessage.TOGGLE_OUTPUT, toggleToast)
                    });
                }
                break;
            case "toggle":
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a: ControlPointDto) => {
                        let data: OutputTrigger = {
                            macAddress: a.macAddress,
                            componentId: a.componentId,
                            command: 3
                        }
                        const res = await send.post(ControlPointEndpoint.TRIGGER, data);
                        Helper.handleToastByResCode(res, ToastMessage.TOGGLE_OUTPUT, toggleToast)
                    });
                }
                break;
            default:
                break;
        }
    };

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<ControlPointDto[]>([]);
   

    const action: ActionButton[] = [
        {
            lable: "on",
            buttonName: "On",
            icon: <OnIcon />
        },
        {
            lable: "off",
            buttonName: "Off",
            icon: <OffIcon />
        }, {
            lable: "toggle",
            buttonName: "Toggle",
            icon: <ToggleIcon />
        }
    ]

    const renderOptionalComponent = (data: any, statusDto: StatusDto[]) => {
        return [
            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <Badge
                    size="sm"
                    color={
                        statusDto.find(b => b.componentId == data.componentId)?.status == "Active"
                            ? "success"
                            : statusDto.find(b => b.componentId == data.componentId)?.status == "Inactive"
                                ? "error"
                                : "warning"
                    }
                >
                    {statusDto.find(b => b.componentId == data.componentId)?.status == "" ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.status}
                </Badge>
            </TableCell>
        ];
    }


    const formContent: FormContent[] = [
        {
            icon: <ControlIcon />,
            label: "Control Point",
            content: <ControlPointForm dto={controlPointDto} setDto={setControlPointDto} handleClick={handleClick} type={formType} />
        }
    ]


    return (
        <>
            <PageBreadcrumb pageTitle="Control Point" />
            {
                form
                    ?
                    <>
                        <BaseForm tabContent={formContent} />
                    </>

                    :
                    <BaseTable<ControlPointDto> headers={OUTPUT_TABLE_HEADER} keys={OUTPUT_KEY} status={status} data={outputsDto} onEdit={handleEdit} onRemove={handleRemove} select={selectedObjects} setSelect={setSelectedObjects} onClick={handleClick} permission={filterPermission(FeatureId.CONTROL)} renderOptionalComponent={renderOptionalComponent} action={action} onInfo={handleInfo} />


            }

        </>
    )
}

export default ControlPoint