import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { AddIcon, ControlIcon, OffIcon, OnIcon, ToggleIcon } from '../../icons';
import DangerModal from '../UiElements/DangerModal';
import HttpRequest from '../../utility/HttpRequest';
import ControlPointForm from './ControlPointForm';
import Logger from '../../utility/Logger';
import { ControlPointDto } from '../../model/ControlPoint/ControlPointDto';
import { StatusDto } from '../../model/StatusDto';
import { OutputTrigger } from '../../model/ControlPoint/OutputTrigger';
import { RemoveOutput } from '../../model/ControlPoint/RemoveOutput';
import Helper from '../../utility/Helper';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../../model/ToastMessage';
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

// Define Global Variable
let removeTarget: RemoveOutput;



export const OUTPUT_TABLE_HEADER: string[] = ["Name", "Main Controller", "Module", "Mode", "Status", "Action"]
export const OUTPUT_KEY: string[] = ["name", "macAddress", "componentId", "relayMode"];

const ControlPoint = () => {
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [removeModal, setRemoveModal] = useState(false);
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);

    {/* handle Table Action */ }
    const handleEdit = (data: ControlPointDto) => {
        console.log(data);
        setOutputDto(data)
        setUpdate(true)
    }

    const handleRemove = (data: ControlPointDto) => {
        console.log(data);
        removeTarget = {
            macAddress: data.macAddress,
            componentId: data.componentId
        };
        setRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeControlPoint();

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
        isActive: true
    }
    const [outputDto, setOutputDto] = useState<ControlPointDto>(defaultDto);
    const [outputsDto, setOutputsDto] = useState<ControlPointDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(ControlPointEndpoint.GET_CP(locationId));
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
        const res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.GET_CP_STATUS + scpMac + "/" + cpNo);
        Logger.info(res);
    };

    const createControlPoint = async () => {
        const res = await send.post(ControlPointEndpoint.CREATE_CP, outputDto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_CP, toggleToast)) {
            setUpdate(false);
            setCreate(false);
            toggleRefresh();
        }
    }

    const removeControlPoint = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, ControlPointEndpoint.DELETE_CP + removeTarget.macAddress + "/" + removeTarget.componentId);
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_CP, toggleToast)) {
            setRemoveModal(false);
            toggleRefresh();
        } else {
            setRemoveModal(false);
        }
        removeTarget = {
            macAddress: "",
            componentId: -1
        }

    }




    {/* UseEffect */ }
    useEffect(() => {
        fetchData();
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

    }, [refresh]);



    {/* Button Command */ }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name)
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true)
                break;
            case "create":
                createControlPoint();
                break;
            case "close":
                setOutputDto(defaultDto)
                setCreate(false);
                setUpdate(false);
                break;
            case "remove":
                console.log(status);
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
                        const res = await send.post(ControlPointEndpoint.CP_TRIGGER, data);
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
                        const res = await send.post(ControlPointEndpoint.CP_TRIGGER, data);
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
                        const res = await send.post(ControlPointEndpoint.CP_TRIGGER, data);
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
    const handleCheckedAll = (data: ControlPointDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: ControlPointDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            content: <ControlPointForm data={outputDto} setOutputDto={setOutputDto} handleClick={handleClick} />
        }
    ]


    return (
        <>
            {removeModal && <DangerModal header='Remove Control Point' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Control Point" />
            {
                create || update
                    ?
                    <>
                        <BaseForm tabContent={formContent} />
                    </>

                    :
                    <BaseTable<ControlPointDto> headers={OUTPUT_TABLE_HEADER} keys={OUTPUT_KEY} status={status} data={outputsDto} handleEdit={handleEdit} handleRemove={handleRemove} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} selectedObject={selectedObjects} handleClick={handleClick} permission={filterPermission(FeatureId.DEVICE)} renderOptionalComponent={renderOptionalComponent} action={action} />


            }

        </>
    )
}

export default ControlPoint