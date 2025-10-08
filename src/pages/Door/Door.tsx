import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import { Add, Control, Disable, Locked, Moment, Unlock } from '../../icons';
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import DangerModal from '../UiElements/DangerModal';
import Modals from '../UiElements/Modals';
import * as signalR from '@microsoft/signalr';
import Label from '../../components/form/Label';
import { AcrDto, StatusDto } from '../../constants/types';
import { ACR_KEY, ACR_TABLE_HEADER, ACREndPoint, HttpMethod } from '../../constants/constant';
import HttpRequest from '../../utility/HttpRequest';
import { usePopupActions } from '../../utility/PopupCalling';
import Logger from '../../utility/Logger';
import DoorForm from './DoorForm';
import Helper from '../../utility/Helper';

// Define Global Variable
let removeTarget: AcrDto;

const defaultAcrDto: AcrDto = {
    name: '',
    mac: "",
    componentNo: -1,
    accessConfig: -1,
    pairACRNo: -1,
    rdrSio: -1,
    rdrNo: -1,
    rdrDataFormat: 0x01,
    keyPadMode: 2,
    isReaderOsdp: false,
    osdpBaudRate: 0x00,
    osdpNoDiscover: 0x00,
    osdpTracing: 0x00,
    osdpAddress: 0x00,
    osdpSecureChannel: 0x00,
    isAltRdrUsed: false,
    isAltRdrOsdp: false,
    altRdrSioNo: -1,
    altRdrNo: -1,
    altRdrConfig: -1,
    altRdrDataFormat: 0x01,
    altKeyPadMode: 2,
    altOsdpBaudRate: 0x00,
    altOsdpNoDiscover: 0x00,
    altOsdpTracing: 0x00,
    altOsdpAddress: 0x00,
    altOsdpSecureChannel: 0x00,
    isRex0Used: false,
    rex0SioNo: -1,
    rex0No: -1,
    rex0TZ: -1,
    rex0SensorMode: 0,
    isRex1Used: false,
    rex1SioNo: -1,
    rex1No: -1,
    rex1TZ: -1,
    rex1SensorMode: 0,
    strkSio: -1,
    strkNo: -1,
    strkMin: 1,
    strkMax: 5,
    strkMode: -1,
    strkRelayDriveMode: -1,
    strkRelayOfflineMode: -1,
    relayMode: -1,
    sensorSio: -1,
    sensorNo: -1,
    dcHeld: 0,
    sensorMode: -1,
    sensorDebounce: 4,
    sensorHoldTime: 2,
    antiPassbackMode: -1,
    offlineMode: 8,
    defaultMode: 8,
    // Notused
    rex0SensorDebounce: -1,
    rex0SensorHoldTime: -1,
    rex1SensorDebounce: -1,
    rex1SensorHoldTime: -1,
    cardFormat: -1,
    antiPassBackIn: -1,
    antiPassBackOut: -1,
    spareTags: -1,
    accessControlFlags: -1,
    defaultLEDMode: -1,
    preAlarm: -1,
    antiPassbackDelay: -1,
    strkT2: -1,
    dcHeld2: -1,
    strkFollowPulse: -1,
    strkFollowDelay: -1,
    nExtFeatureType: -1,
    ilPBSio: -1,
    ilPBNumber: -1,
    ilPBLongPress: -1,
    ilPBOutSio: -1,
    ilPBOutNum: -1,
    dfOfFilterTime: -1,
    rdrSioName: '',
    mode: -1,
    modeDesc: '',
    offlineModeDesc: '',
    defaultModeDesc: ''
}

const Door = () => {
    const { showPopup } = usePopupActions();
    const [acrDto, setAcrDto] = useState<AcrDto>(defaultAcrDto)
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
                setAcrDto(defaultAcrDto)
                break;
            case "detail":
                setUpdateModal(true)
                break;
            case "unlock":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentNo, 2);
                })
                break;
            case "lock":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentNo, 3);
                })
                break;
            case "moment":
                selectedObjects.map(a => {
                    unlockDoor(a.mac, a.componentNo);
                })
                break;
            case "secure":
                selectedObjects.map(a => {
                    console.log(a)
                    changeDoorMode(a.mac, a.componentNo, a.defaultMode);
                })
                break;
            case "disable":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentNo, 1);
                })
                break;
            default:
                break;
        }
    }

    const createAcr = async () => {
        const res = await HttpRequest.send(HttpMethod.POST, ACREndPoint.POST_ADD_ACR, acrDto);
        if (Helper.handlePopupByResCode(res, showPopup)) {
            setUpdateModal(false)
            setCreateModal(false)
            toggleRefresh()
        }
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = (data:AcrDto) => {
        setAcrDto(data)
        setUpdateModal(true);
    }

    const handleOnClickRemove = (data: AcrDto) => {
        console.log(data);
        removeTarget = data;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeDoors(removeTarget.mac, removeTarget.componentNo);

    }

    {/* Door Data */ }
    const [tableDatas, setTableDatas] = useState<AcrDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_ACR_LIST);
        Logger.info(res);
        if (res && res.data.data) {
            console.log(res.data.data)
            setTableDatas(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: AcrDto) => ({
                scpMac: a.mac,
                deviceNumber: a.componentNo,
                status: 0,
                tamper: a.modeDesc,
                ac: 0,
                batt: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            setTimeout(() => {
                res.data.data.forEach((a: AcrDto) => {
                    fetchStatus(a.mac, a.componentNo);
                });
            }, 1000);
        }

    };
    const fetchStatus = async (scpMac: string, acrNo: number) => {
        const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_ACR_STATUS + scpMac + "/" + acrNo)
        Logger.info(res)
    }
    const removeDoors = async (mac: string, AcrNo: number) => {
        const res = await HttpRequest.send(HttpMethod.DELETE, ACREndPoint.REMOVE_ACR + mac + "/" + AcrNo)
        Logger.info(res)
        if (res && res.data.data) {
            if (res.status == 200) {
                setIsRemoveModal(false);
                toggleRefresh();
            }
        }
    }
    const changeDoorMode = async (mac: string, componentNo: number, mode: number) => {
        const data = {
            mac, componentNo, mode
        }
        const res = await HttpRequest.send(HttpMethod.POST, ACREndPoint.POST_ACR_CHANGE_MODE, data)
        Logger.info(res)
    }
    const unlockDoor = async (ScpMac: string, AcrNo: number) => {
        const res = await HttpRequest.send(HttpMethod.POST, ACREndPoint.POST_ACR_UNLOCK + ScpMac + "/" + AcrNo)
        Logger.info(res)
    }
    {/* UseEffect */ }
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5031/acrHub")
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            console.log("Connected to SignalR event hub");
        });
        connection.on(
            "AcrStatus",
            (ScpMac: string, AcrNo: number, AcrMode: string, AccessPointStatus: string) => {
                console.log(ScpMac)
                console.log(AcrNo)
                console.log(AcrMode)
                console.log(AccessPointStatus)
                setStatus((prev) =>
                    prev.map((a) =>
                        a.scpMac == ScpMac && a.deviceNumber == AcrNo ? {
                            ...a,
                            status: AccessPointStatus == "" ? a.status : AccessPointStatus,
                            tamper: AcrMode == "" ? a.tamper : AcrMode
                        } : {
                            ...a
                        }
                    )
                )
            }
        );

        fetchData();

        return () => {
            connection.stop();
        };

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<AcrDto[]>([]);
    const handleCheckedAll = (data: AcrDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: AcrDto, e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(data)
        console.log(e.target.checked)
        if (setSelectedObjects) {
            if (e.target.checked) {
                setSelectedObjects((prev) => [...prev, data]);
            } else {
                setSelectedObjects((prev) =>
                    prev.filter((item) => item.componentNo !== data.componentNo)
                );
            }
        }
    }
    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Door' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {createModal && <Modals body={<DoorForm handleClick={handleClick} data={acrDto} setAcrDto={setAcrDto} />} isWide={true} handleClickWithEvent={handleClick} />}
            {updateModal && <Modals body={<DoorForm handleClick={handleClick} data={acrDto} setAcrDto={setAcrDto} />} isWide={true} handleClickWithEvent={handleClick} />}
            <PageBreadcrumb pageTitle="Doors" />
            <div className="space-y-6">
                <Label htmlFor='mode' >Action</Label>
                <div className="flex gap-4">
                    <Button
                        name='add'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
                    >
                        Create
                    </Button>
                    <Button
                        name='secure'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Moment className="size-5" />}
                    >
                        Secure (Default Mode)
                    </Button>
                    <Button
                        name='moment'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Control className="size-5" />}
                    >
                        Toggle Door
                    </Button>
                    <Button
                        name='unlock'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Unlock className="size-5" />}
                    >
                        Unlock
                    </Button>
                    <Button
                        name='lock'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Locked className="size-5" />}
                    >
                        Locked
                    </Button>
                    <Button
                        name='disable'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="danger"
                        startIcon={<Disable className="size-5" />}
                    >
                        Disable
                    </Button>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TableTemplate<AcrDto> deviceIndicate={5} statusDto={status} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={ACR_TABLE_HEADER} tableDatas={tableDatas} tableKeys={ACR_KEY} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={(data) => handleOnClickEdit(data)} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Door