import React, { useEffect, useState } from 'react'
import Button from '../../components/ui/button/Button'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { Add, Mask, Unmask } from '../../icons'
import DangerModal from '../UiElements/DangerModal';
import HttpRequest from '../../utility/HttpRequest';
import Logger from '../../utility/Logger';
import MonitorPointForm from './MonitorPointForm';
import { MonitorPointTable } from './MonitorPointTable';
import { MonitorPointDto } from '../../model/MonitorPoint/MonitorPointDto';
import { StatusDto } from '../../model/StatusDto';
import { RemoveInput } from '../../model/MonitorPoint/RemoveInput';
import { ToastMessage } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import Helper from '../../utility/Helper';
import { HttpMethod } from '../../enum/HttpMethod';
import { MonitorPointEndpoint } from '../../enum/endpoint/MonitorPointEndpoint';

// Define Global Variable
let removeTarget: RemoveInput;
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
    locationId: 1,
    locationName: 'Main Location',
    isActive: false
}

const MonitorPoint = () => {
    const { toggleToast } = useToast();
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
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeMonitorPoint();
        toggleRefresh();
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
                    res = await HttpRequest.send(HttpMethod.POST, MonitorPointEndpoint.POST_MASK, a);
                    if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP, toggleToast)) {
                        toggleRefresh();
                    }
                })

                break;
            case "unmask":
                selectedObjects.forEach(async (a: MonitorPointDto) => {
                    res = await HttpRequest.send(HttpMethod.POST, MonitorPointEndpoint.POST_UNMASK, a);
                    if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP, toggleToast)) {
                        toggleRefresh();
                    }
                })
                break;
        }
    }

    const createMonitorPoint = async () => {
        const res = await HttpRequest.send(HttpMethod.POST, MonitorPointEndpoint.POST_ADD_MP, monitorPointDto);
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_MP, toggleToast)) {
            setUpdate(false);
            setCreate(false);
            toggleRefresh();
        }
    }

    {/* input Data */ }
    const [monitorPointsDto, setMonitorPointsDto] = useState<MonitorPointDto[]>([]);
    const [monitorPointDto, setMonitorPointDto] = useState<MonitorPointDto>(defaultDto);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_MP_LIST);
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
        fetchData();
    }, [refresh]);

    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Monitor Point' body='Please Click Confirm if you want to remove this Monitor Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Monitor Point" />
            {create || update ?
                <MonitorPointForm handleClick={handleClick} data={monitorPointDto} setMonitorPointDto={setMonitorPointDto} />
                :
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button
                            name='add'
                            size="sm"
                            variant="primary"
                            startIcon={<Add className="size-5" />}
                            onClickWithEvent={handleClick}
                        >
                            Create
                        </Button>
                        <Button
                            name='mask'
                            size="sm"
                            variant="primary"
                            onClickWithEvent={handleClick}
                            startIcon={<Mask />}
                        >
                            Mask
                        </Button>
                        <Button
                            name='unmask'
                            size="sm"
                            variant="primary"
                            onClickWithEvent={handleClick}
                            startIcon={<Unmask />}
                        >
                            Unmask
                        </Button>

                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <MonitorPointTable data={monitorPointsDto} statusDto={status} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} selectedObject={selectedObjects} setStatus={setStatus} handleEdit={handleEdit} handleRemove={handleRemove} />

                        </div>
                    </div>

                </div>
            }

        </>
    )
}

export default MonitorPoint