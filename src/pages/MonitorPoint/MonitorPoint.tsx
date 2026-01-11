import React, { JSX, useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { AddIcon, MaskIcon, MonitorIcon, UnmaskIcon } from '../../icons'
import HttpRequest from '../../utility/HttpRequest';
import Logger from '../../utility/Logger';
import MonitorPointForm from './MonitorPointForm';
import { MonitorPointDto } from '../../model/MonitorPoint/MonitorPointDto';
import { StatusDto } from '../../model/StatusDto';
import { MonitorPointToast } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import Helper from '../../utility/Helper';
import { HttpMethod } from '../../enum/HttpMethod';
import { MonitorPointEndpoint } from '../../endpoint/MonitorPointEndpoint';
import { useLocation } from '../../context/LocationContext';
import { send } from '../../api/api';
import { BaseTable } from '../UiElements/BaseTable';
import SignalRService from '../../services/SignalRService';
import { ActionButton } from '../../model/ActionButton';
import { TableCell } from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import { usePopup } from '../../context/PopupContext';
import { FormType } from '../../model/Form/FormProp';

// Define Global Variable
export const MP_TABLE_HEADER: string[] = ["Name", "Main Controller", "Module", "Mode","Input Mode", "Masked", "Status", "Action"]
export const MP_KEY: string[] = ["name", "hardwareName", "moduleDescription", "monitorPointModeDescription","inputModeDescription", "isMask"];

const MonitorPoint = () => {
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const { setCreate,setRemove,setUpdate,setConfirmCreate,setConfirmRemove,setConfirmUpdate,setInfo,setMessage } = usePopup();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [form,setForm] = useState<boolean>(false);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);

    {/* handle Table Action */ }
    const handleEdit = (data:MonitorPointDto) => {
        setMonitorPointDto(data);
        setFormType(FormType.UPDATE)
        setForm(true)
    }

    const handleInfo = (data:MonitorPointDto) => {
        setMonitorPointDto(data)
        setFormType(FormType.INFO)
        setForm(true);
    }

    const handleRemove = (data: MonitorPointDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(MonitorPointEndpoint.DELETE(data.componentId));
            if (Helper.handleToastByResCode(res, MonitorPointToast.DELETE, toggleToast)) {
                toggleRefresh();
            }
        })
        setRemove(true);
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        let res;
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
                    selectedObjects.map(async (a:MonitorPointDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(MonitorPointEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,MonitorPointToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(MonitorPointEndpoint.CREATE, monitorPointDto);
                    if (Helper.handleToastByResCode(res, MonitorPointToast.CREATE, toggleToast)) {
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setCreate(true)
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(MonitorPointEndpoint.UPDATE,monitorPointDto)
                    if(Helper.handleToastByResCode(res,MonitorPointToast.UPDATE,toggleToast)){
                        setForm(false)
                        toggleRefresh();
                    }
                })
                setUpdate(true)
                break;
            case "cancel":
            case "close":
                setMonitorPointDto(defaultDto)
                setForm(false);
                break;
            case "mask":
                selectedObjects.forEach(async (a: MonitorPointDto) => {
                    res = await send.post(MonitorPointEndpoint.MASK, a);
                    if (Helper.handleToastByResCode(res, MonitorPointToast.MASK, toggleToast)) {
                        toggleRefresh();
                    }
                })

                break;
            case "unmask":
                selectedObjects.forEach(async (a: MonitorPointDto) => {
                    res = await send.post(MonitorPointEndpoint.UNMASK, a)
                    if (Helper.handleToastByResCode(res, MonitorPointToast.UNMASK, toggleToast)) {
                        toggleRefresh();
                    }
                })
                break;
            default:
                break;
        }
    }

    {/* input Data */ }
    const defaultDto: MonitorPointDto = {
        name: '',
        moduleId: -1,
        inputNo: -1,
        inputMode: -1,
        debouce: -1,
        holdTime: -1,
        logFunction: -1,
        monitorPointMode: -1,
        delayEntry: 0,
        delayExit: 0,
        isMask: false,
        uuid: '',
        componentId: -1,
        mac: '',
        locationId: locationId,
        isActive: false,
        hardwareName: '',
        inputModeDescription: '',
        logFunctionDescription: '',
        monitorPointModeDescription: '',
        moduleDescription: ''
    }
    const [monitorPointsDto, setMonitorPointsDto] = useState<MonitorPointDto[]>([]);
    const [monitorPointDto, setMonitorPointDto] = useState<MonitorPointDto>(defaultDto);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(MonitorPointEndpoint.MPS(locationId));
        console.log(res)
        if (res?.data.data) {
            setMonitorPointsDto(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: MonitorPointDto) => ({
                macAddress: a.mac,
                componentId: a.componentId,
                status: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.data.forEach((a: MonitorPointDto) => {
                fetchStatus(a.mac, a.componentId);
            });
        }

    };
    const fetchStatus = async (scpMac: string, mpNo: number) => {
        const res = await send.get(MonitorPointEndpoint.GET_MP_STATUS(scpMac,mpNo));
        Logger.info(res);
    };



    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<MonitorPointDto[]>([]);

    {/* UseEffect */ }
    useEffect(() => {
        // Initialize SignalR as soon as app starts
        var connection = SignalRService.getConnection();
        connection.on("MpStatus",
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
        ]
    }

    const action: ActionButton[] = [
        {
            lable: "mask",
            buttonName: "Mask",
            icon: <MaskIcon />
        }, {
            lable: "unmask",
            buttonName: "Unmask",
            icon: <UnmaskIcon />
        }
    ];

    const tabContent: FormContent[] = [
        {
            label: "Monitor Point",
            icon: <MonitorIcon />,
            content: <MonitorPointForm handleClick={handleClick} dto={monitorPointDto} setDto={setMonitorPointDto} type={formType} />

        }
    ]

    return (
        <>
            <PageBreadcrumb pageTitle="Monitor Point" />
            {form ?
                <BaseForm tabContent={tabContent} />
                :
                <BaseTable<MonitorPointDto> headers={MP_TABLE_HEADER} keys={MP_KEY} data={monitorPointsDto} status={status}  onEdit={handleEdit} onRemove={handleRemove} onInfo={handleInfo} select={selectedObjects} setSelect={setSelectedObjects} onClick={handleClick} action={action} renderOptionalComponent={renderOptionalComponent} permission={filterPermission(FeatureId.MONITOR)} />

            }

        </>
    )
}

export default MonitorPoint