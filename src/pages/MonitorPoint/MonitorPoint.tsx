import React, { JSX, useEffect, useState } from 'react'
import Button from '../../components/ui/button/Button'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { AddIcon, MaskIcon, MonitorIcon, UnmaskIcon } from '../../icons'
import RemoveModal from '../UiElements/RemoveModal';
import HttpRequest from '../../utility/HttpRequest';
import Logger from '../../utility/Logger';
import MonitorPointForm from './MonitorPointForm';
import { MonitorPointDto } from '../../model/MonitorPoint/MonitorPointDto';
import { StatusDto } from '../../model/StatusDto';
import { RemoveInput } from '../../model/MonitorPoint/RemoveInput';
import { ToastMessage } from '../../model/ToastMessage';
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

// Define Global Variable
let removeTarget: RemoveInput;
export const MP_TABLE_HEADER: string[] = ["Name", "Main Controller", "Module", "Mode", "Masked", "Status", "Action"]
export const MP_KEY: string[] = ["name", "macAddress", "moduleId", "monitorPointMode", "isMask"];

const MonitorPoint = () => {
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState<boolean>(false);
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);

    {/* handle Table Action */ }
    const handleEdit = () => {

    }

    const handleRemove = (data: MonitorPointDto) => {
        console.log(data);
        removeTarget = { componentId: data.componentId, macAddress: data.macAddress };
        setIsRemoveModal(true);
    }

    const handleOnClickConfirmRemove = () => {

    }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        let res;
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true);
                break;
            case "create":
                createMonitorPoint();
                break;
            case "cancle":
                setCreate(false);
                setUpdate(false);
                break;
            case "remove":

                break;
            case "mask":
                selectedObjects.forEach(async (a: MonitorPointDto) => {
                    res = await send.post(MonitorPointEndpoint.POST_MASK, a);
                    if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP, toggleToast)) {
                        toggleRefresh();
                    }
                })

                break;
            case "unmask":
                selectedObjects.forEach(async (a: MonitorPointDto) => {
                    res = await send.post(MonitorPointEndpoint.POST_UNMASK, a)
                    if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP, toggleToast)) {
                        toggleRefresh();
                    }
                })
                break;
            case "remove-confirm":
                removeMonitorPoint();
                toggleRefresh();
                break;
            case "remove-cancel":
                setIsRemoveModal(false);
                break;
            default:
                break;
        }
    }

    const createMonitorPoint = async () => {
        const res = await send.post(MonitorPointEndpoint.POST_ADD_MP, monitorPointDto);
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP, toggleToast)) {
            setUpdate(false);
            setCreate(false);
            toggleRefresh();
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
        macAddress: '',
        locationId: locationId,
        isActive: false
    }
    const [monitorPointsDto, setMonitorPointsDto] = useState<MonitorPointDto[]>([]);
    const [monitorPointDto, setMonitorPointDto] = useState<MonitorPointDto>(defaultDto);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(MonitorPointEndpoint.GET_MP_LIST(locationId));
        console.log(res)
        if (res?.data.data) {
            setMonitorPointsDto(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: MonitorPointDto) => ({
                macAddress: a.macAddress,
                componentId: a.componentId,
                status: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.data.forEach((a: MonitorPointDto) => {
                fetchStatus(a.macAddress, a.componentId);
            });
        }

    };
    const fetchStatus = async (scpMac: string, mpNo: number) => {
        const res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_MP_STATUS + scpMac + "/" + mpNo);
        Logger.info(res);
    };

    const removeMonitorPoint = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, MonitorPointEndpoint.DELETE_MP + removeTarget.macAddress + "/" + removeTarget.componentId);
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP, toggleToast)) {
            setIsRemoveModal(false);
            toggleRefresh();
        }
        removeTarget = {
            componentId: -1,
            macAddress: "",
        };

    }


    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<MonitorPointDto[]>([]);
    const handleCheckedAll = (data: MonitorPointDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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



    const handleChecked = (data: MonitorPointDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            content: <MonitorPointForm handleClick={handleClick} data={monitorPointDto} setMonitorPointDto={setMonitorPointDto} />

        }
    ]

    return (
        <>
            {isRemoveModal && <RemoveModal handleClick={handleClick} />}
            <PageBreadcrumb pageTitle="Monitor Point" />
            {create || update ?
                <BaseForm tabContent={tabContent} />
                :
                <BaseTable<MonitorPointDto> headers={MP_TABLE_HEADER} keys={MP_KEY} data={monitorPointsDto} status={status} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} onEdit={handleEdit} onRemove={handleRemove} selectedObject={selectedObjects} onClick={handleClick} action={action} renderOptionalComponent={renderOptionalComponent} permission={filterPermission(FeatureId.DEVICE)} />

            }

        </>
    )
}

export default MonitorPoint