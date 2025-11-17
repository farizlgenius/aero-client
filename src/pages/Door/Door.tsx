import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import { AddIcon, ControlIcon, DisableIcon, LockedIcon, MomentIcon, UnlockIcon } from '../../icons';
import DangerModal from '../UiElements/DangerModal';
import HttpRequest from '../../utility/HttpRequest';
import Logger from '../../utility/Logger';
import DoorForm from './DoorForm';
import Helper from '../../utility/Helper';
import { DoorDto } from '../../model/Door/DoorDto';
import { StatusDto } from '../../model/StatusDto';
import { DoorTable } from './DoorTable';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../../model/ToastMessage';
import { HttpMethod } from '../../enum/HttpMethod';
import { DoorEndpoint } from '../../enum/endpoint/DoorEndpoint';

// Define Global Variable
let removeTarget: DoorDto;

const defaultDto: DoorDto = {
    name: '',
    accessConfig: -1,
    pairDoorNo: -1,
    readers: [
        {
            // base 
            uuid: "",
            componentId: -1,
            macAddress: "",
            locationId: 1,
            locationName: "Main Location",
            isActive: true,

            // Detail
            moduleId: -1,
            readerNo: -1,
            dataFormat: 1,
            keypadMode: 0,
            ledDriveMode: -1,
            osdpFlag: false,
            osdpAddress: 0x00,
            osdpDiscover: 0x00,
            osdpTracing: 0x00,
            osdpBaudrate: 0x00,
            osdpSecureChannel: 0x00
        },
        {
            // base 
            uuid: "",
            componentId: -1,
            macAddress: "",
            locationId: 1,
            locationName: "Main Location",
            isActive: true,

            // Detail
            moduleId: -1,
            readerNo: -1,
            dataFormat: -1,
            keypadMode: -1,
            ledDriveMode: -1,
            osdpFlag: false,
            osdpAddress: 0x00,
            osdpDiscover: 0x00,
            osdpTracing: 0x00,
            osdpBaudrate: 0x00,
            osdpSecureChannel: 0x00
        }
    ],
    strk: {
        moduleId: -1,
        outputNo: -1,
        relayMode: -1,
        offlineMode: -1,

        // base
        uuid: "",
        componentId: -1,
        macAddress: '',
        locationId: 1,
        locationName: 'Main Location',
        isActive: true,
        strkMax: 5,
        strkMin: 1,
        strkMode: 0
    },
    sensor: {
        moduleId: -1,
        inputNo: -1,
        inputMode: -1,
        holdTime: 0,

        // base
        uuid: "",
        componentId: -1,
        macAddress: '',
        locationId: 1,
        locationName: 'Main Location',
        isActive: true,
        debounce: 0,
        dcHeld: 0
    },
    requestExits: [{
        // base 
        uuid: "",
        componentId: -1,
        macAddress: "",
        locationId: 1,
        locationName: "Main Location",
        isActive: true,

        // Detail
        moduleId: -1,
        inputNo: -1,
        inputMode: -1,
        debounce: 0,
        holdTime: 0,
        maskTimeZone: 0
    }, {
        // base 
        uuid: "",
        componentId: -1,
        macAddress: "",
        locationId: 1,
        locationName: "Main Location",
        isActive: true,

        // Detail
        moduleId: -1,
        inputNo: -1,
        inputMode: -1,
        debounce: 0,
        holdTime: 0,
        maskTimeZone: 0
    }],
    readerOutConfiguration: 1,
    // Notused
    cardFormat: 255,
    antiPassBackIn: -1,
    antiPassBackOut: -1,
    spareTags: -1,
    accessControlFlags: -1,
    mode: -1,
    modeDesc: '',
    offlineModeDesc: '',
    defaultModeDesc: '',
    defaultLEDMode: 0,
    preAlarm: 0,
    antiPassbackDelay: 0,
    strkT2: 0,
    dcHeld2: 0,
    strkFollowPulse: -1,
    strkFollowDelay: -1,
    nExtFeatureType: -1,
    ilPBSio: -1,
    ilPBNumber: -1,
    ilPBLongPress: -1,
    ilPBOutSio: -1,
    ilPBOutNum: -1,
    dfOfFilterTime: 0,
    antiPassbackMode: -1,
    offlineMode: -1,
    defaultMode: -1,
    maskForceOpen: false,
    maskHeldOpen: false,
    // base
    uuid: "",
    componentId: -1,
    macAddress: '',
    locationId: 1,
    locationName: 'Main Location',
    isActive: true,
    strkComponentId: 0,
    sensorComponentId: 0
}

const Door = () => {
    const { toggleToast } = useToast();
    const [doorDto, setDoorDto] = useState<DoorDto>(defaultDto)
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        console.log(e.currentTarget.value)
        switch (e.currentTarget.name) {
            case "add":
                setCreateModal(true);
                break;
            case "create":
                createAcr();
                break;
            case "close":
                setUpdateModal(false)
                setCreateModal(false)
                setDoorDto(defaultDto)
                break;
            case "detail":
                setUpdateModal(true)
                break;
            case "unlock":
                selectedObjects.map(a => {
                    changeDoorMode(a.macAddress, a.componentId, 2);
                })
                break;
            case "lock":
                selectedObjects.map(a => {
                    changeDoorMode(a.macAddress, a.componentId, 3);
                })
                break;
            case "moment":
                selectedObjects.map(a => {
                    unlockDoor(a.macAddress, a.componentId);
                })
                break;
            case "secure":
                selectedObjects.map(a => {
                    console.log(a)
                    changeDoorMode(a.macAddress, a.componentId, a.defaultMode);
                })
                break;
            case "disable":
                selectedObjects.map(a => {
                    changeDoorMode(a.macAddress, a.componentId, 1);
                })
                break;
            default:
                break;
        }
    }

    const createAcr = async () => {
        const res = await HttpRequest.send(HttpMethod.POST, DoorEndpoint.POST_ADD_ACR, doorDto);
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_ACR, toggleToast)) {
            setUpdateModal(false)
            setCreateModal(false)
            toggleRefresh()
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: DoorDto) => {
        setDoorDto(data)
        setUpdateModal(true);
    }

    const handleRemove = (data: DoorDto) => {
        console.log(data);
        removeTarget = data;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeDoors(removeTarget.macAddress, removeTarget.componentId);

    }

    {/* Door Data */ }
    const [doorsDto, setDoorsDto] = useState<DoorDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACR_LIST);
        Logger.info(res);
        if (res && res.data.data) {
            console.log(res.data.data)
            setDoorsDto(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: DoorDto) => ({
                macAddress: a.macAddress,
                componentId: a.componentId,
                status: 0,
                tamper: a.modeDesc,
                ac: 0,
                batt: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
                            res.data.data.forEach((a: DoorDto) => {
                    fetchStatus(a.macAddress, a.componentId);
                });
        }

    };
    const fetchStatus = async (scpMac: string, acrNo: number) => {
        const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACR_STATUS + scpMac + "/" + acrNo)
        Logger.info(res)
    }
    const removeDoors = async (mac: string, AcrNo: number) => {
        const res = await HttpRequest.send(HttpMethod.DELETE, DoorEndpoint.REMOVE_ACR + mac + "/" + AcrNo)
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_DOOR, toggleToast)) {
            setIsRemoveModal(false);
        }
        toggleRefresh();
    }
    const changeDoorMode = async (macAddress: string, componentId: number, mode: number) => {
        const data = {
            macAddress, componentId, mode
        }
        const res = await HttpRequest.send(HttpMethod.POST, DoorEndpoint.POST_ACR_CHANGE_MODE, data)
        Logger.info(res)
    }
    const unlockDoor = async (ScpMac: string, AcrNo: number) => {
        const res = await HttpRequest.send(HttpMethod.POST, DoorEndpoint.POST_ACR_UNLOCK + ScpMac + "/" + AcrNo)
        Logger.info(res)
    }
    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<DoorDto[]>([]);
    const handleCheckedAll = (data: DoorDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: DoorDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            {isRemoveModal && <DangerModal header='Remove Door' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Doors" />
            {createModal || updateModal ?
                <DoorForm handleClick={handleClick} data={doorDto} setDoorDto={setDoorDto} />
                :
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button
                            name='add'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<AddIcon className="size-5" />}
                        >
                            Create
                        </Button>
                        <Button
                            name='secure'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<MomentIcon className="size-5" />}
                        >
                            Secure (Default Mode)
                        </Button>
                        <Button
                            name='moment'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<ControlIcon className="size-5" />}
                        >
                            Toggle Door
                        </Button>
                        <Button
                            name='unlock'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<UnlockIcon className="size-5" />}
                        >
                            Unlock
                        </Button>
                        <Button
                            name='lock'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<LockedIcon className="size-5" />}
                        >
                            Locked
                        </Button>
                        <Button
                            name='disable'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="danger"
                            startIcon={<DisableIcon className="size-5" />}
                        >
                            Disable
                        </Button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <DoorTable data={doorsDto} statusDto={status} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} selectedObject={selectedObjects} handleEdit={handleEdit} handleRemove={handleRemove} setStatus={setStatus} />

                        </div>
                    </div>

                </div>
            }

        </>
    )
}

export default Door