import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import Button from '../../components/ui/button/Button';
import { AddIcon } from '../../icons';
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
import { ControlPointTable } from './ControlPointTable';
import { HttpMethod } from '../../enum/HttpMethod';
import { ControlPointEndpoint } from '../../endpoint/ControlPointEndpoint';

// Define Global Variable
let removeTarget: RemoveOutput;

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
    locationId: 1,
    locationName: 'Main Location',
    isActive: true
}



const ControlPoint = () => {
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [removeModal, setRemoveModal] = useState(false);
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const handleClickAddCpModal = () => {
        setCreate(true);
    }
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
    const [outputDto, setOutputDto] = useState<ControlPointDto>(defaultDto);
    const [outputsDto, setOutputsDto] = useState<ControlPointDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.GET_CP_LIST);
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
        const res = await HttpRequest.send(HttpMethod.POST, ControlPointEndpoint.POST_ADD_CP, outputDto);
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

    }, [refresh]);

    {/* Button Command */ }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name)
        switch (e.currentTarget.name) {
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
                        const res = await HttpRequest.send(HttpMethod.POST, ControlPointEndpoint.POST_CP_TRIGGER, data);
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
                        const res = await HttpRequest.send(HttpMethod.POST, ControlPointEndpoint.POST_CP_TRIGGER, data);
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
                        const res = await HttpRequest.send(HttpMethod.POST, ControlPointEndpoint.POST_CP_TRIGGER, data);
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


    return (
        <>
            {removeModal && <DangerModal header='Remove Control Point' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Control Point" />
            {
                create || update
                    ?
                    <ControlPointForm data={outputDto} setOutputDto={setOutputDto} handleClick={handleClick} />
                    :
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <Button
                                onClick={handleClickAddCpModal}
                                size="sm"
                                variant="primary"
                                startIcon={<AddIcon className="size-5" />}
                            >
                                Create
                            </Button>
                            <Button
                                name='on'
                                size="sm"
                                variant="primary"
                                onClickWithEvent={handleClick}
                            >
                                On
                            </Button>
                            <Button
                                name='off'
                                size="sm"
                                variant="danger"
                                onClickWithEvent={handleClick}
                            >
                                Off
                            </Button>
                            <Button
                                name='toggle'
                                size="sm"
                                variant="primary"
                                onClickWithEvent={handleClick}
                            >
                                Toggle
                            </Button>

                        </div>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <div className="max-w-full overflow-x-auto">
                                <ControlPointTable setStatus={setStatus} statusDto={status} data={outputsDto} handleEdit={handleEdit} handleRemove={handleRemove} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} selectedObject={selectedObjects} />
                            </div>
                        </div>

                    </div>

            }

        </>
    )
}

export default ControlPoint