import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import { AddIcon, ControlIcon, DisableIcon, DoorIcon, LockedIcon, LockIcon, MomentIcon, UnlockIcon } from '../../icons';
import RemoveModal from '../UiElements/RemoveModal';
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
import { DoorEndpoint } from '../../endpoint/DoorEndpoint';
import { useLocation } from '../../context/LocationContext';
import { send } from '../../api/api';
import { BaseTable } from '../UiElements/BaseTable';
import SignalRService from '../../services/SignalRService';
import { ActionButton } from '../../model/ActionButton';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import { TableCell } from '../../components/ui/table';
import Badge from '../../components/ui/badge/Badge';

// Define Global Variable
let removeTarget: DoorDto;


// ACR Page
export const DOOR_TABLE_HEADER: string[] = ["Name", "Mode", "Status", "Action"]
export const DOOR_KEY: string[] = ["name"];

const Door = () => {
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const defaultDto: DoorDto = {
        name: '',
        accessConfig: -1,
        pairDoorNo: -1,
        readers: [
            {
                // base 
                uuid: "",
                componentId: -1,
                mac: "",
                locationId: locationId,
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
                mac: "",
                locationId: locationId,
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
            mac: '',
            locationId: locationId,
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
            mac: '',
            locationId: locationId,
            isActive: true,
            debounce: 0,
            dcHeld: 0
        },
        requestExits: [{
            // base 
            uuid: "",
            componentId: -1,
            mac: "",
            locationId: locationId,
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
            mac: "",
            locationId: locationId,
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
        mac: '',
        locationId: locationId,
        isActive: true,
        strkComponentId: 0,
        sensorComponentId: 0
    }
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
                    changeDoorMode(a.mac, a.componentId, 2);
                })
                break;
            case "lock":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentId, 3);
                })
                break;
            case "moment":
                selectedObjects.map(a => {
                    unlockDoor(a.mac, a.componentId);
                })
                break;
            case "secure":
                selectedObjects.map(a => {
                    console.log(a)
                    changeDoorMode(a.mac, a.componentId, a.defaultMode);
                })
                break;
            case "disable":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentId, 1);
                })
                break;
            case "remove-confirm":
                removeDoors(removeTarget.mac, removeTarget.componentId);
                break;
            case "remove-cancel":
                setIsRemoveModal(false);
                break;
            default:
                break;
        }
    }

    const createAcr = async () => {
        const res = await send.post(DoorEndpoint.POST_ADD_ACR, doorDto)
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

    {/* Door Data */ }
    const [doorsDto, setDoorsDto] = useState<DoorDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(DoorEndpoint.GET_ACR_LIST(locationId))
        Logger.info(res);
        if (res && res.data.data) {
            console.log(res.data.data)
            setDoorsDto(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: DoorDto) => ({
                macAddress: a.mac,
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
                fetchStatus(a.mac, a.componentId);
            });
        }

    };
    const fetchStatus = async (scpMac: string, acrNo: number) => {
        const res = await send.get(DoorEndpoint.GET_ACR_STATUS(scpMac, acrNo));
        Logger.info(res)
    }
    const removeDoors = async (mac: string, AcrNo: number) => {
        const res = await send.delete(DoorEndpoint.REMOVE_ACR(mac, AcrNo))
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_DOOR, toggleToast)) {
            setIsRemoveModal(false);
        }
        toggleRefresh();
    }
    const changeDoorMode = async (macAddress: string, componentId: number, mode: number) => {
        const data = {
            macAddress, componentId, mode
        }
        const res = await send.post(DoorEndpoint.POST_ACR_CHANGE_MODE, data)
        Logger.info(res)
    }
    const unlockDoor = async (ScpMac: string, AcrNo: number) => {
        const res = await send.post(DoorEndpoint.POST_ACR_UNLOCK(ScpMac, AcrNo))
        Logger.info(res)
    }
    {/* UseEffect */ }
    useEffect(() => {
        var connection = SignalRService.getConnection();
        connection.on(
            "AcrStatus",
            (ScpMac: string, AcrNo: number, AcrMode: string, AccessPointStatus: string) => {
                console.log(ScpMac)
                console.log(AcrNo)
                console.log(AcrMode)
                console.log(AccessPointStatus)
                setStatus((prev) =>
                    prev.map((a) =>
                        a.macAddress == ScpMac && a.componentId == AcrNo ? {
                            ...a,
                            status: AccessPointStatus == "" ? a.status : AccessPointStatus,
                            tamper: AcrMode == "" ? a.tamper : AcrMode
                        } : {
                            ...a
                        }
                    )
                )
                toggleRefresh();
            }
        );

    }, []);

    useEffect(() => {
        fetchData();
    },[refresh])

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

    const action: ActionButton[] = [
        {
            lable: "secure",
            buttonName: "Secure (Default Mode)",
            icon: <MomentIcon />
        },
        {
            lable: "moment",
            buttonName: "Toggle Door",
            icon: <ControlIcon />
        }, {
            lable: "unlock",
            buttonName: "Unlock",
            icon: <UnlockIcon />
        }, {
            lable: "lock",
            buttonName: "Lock",
            icon: <LockIcon />
        }, {
            lable: "disable",
            buttonName: "Disable",
            icon: <DisableIcon />
        },
    ];

    const content: FormContent[] = [
        {
            label: "Door",
            content: <DoorForm handleClick={handleClick} data={doorDto} setDoorDto={setDoorDto} />,
            icon: <DoorIcon />
        }
    ]

    const filterComponet = (data:any,statusDto:StatusDto[]) => {
        return [
            <>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <>
                        <Badge size="sm" color="dark">{statusDto.find(b => b.componentId == data.componentId)?.tamper}</Badge>
                    </>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <>
                        {statusDto.find(b => b.componentId == data.componentId)?.status === "Secure" ? (
                            <Badge size="sm" color="success">{statusDto.find(b => b.componentId == data.componentId)?.status}</Badge>
                        ) : statusDto.find(b => b.componentId == data.componentId)?.status === "Forced Open" || statusDto.find(b => b.componentId == data.componentId)?.status === "Locked" ? (
                            <Badge size="sm" color="error">{statusDto.find(b => b.componentId == data.componentId)?.status}</Badge>
                        ) : (
                            <Badge size="sm" color="warning">{statusDto.find(b => b.componentId == data.componentId)?.status === 0 ? "Error" : statusDto.find(b => b.componentId == data.componentId)?.status}</Badge>
                        )}
                    </>
                </TableCell>
            </>
        ]
    }

    return (
        <>
            {isRemoveModal && <RemoveModal header='Remove Door' body='Please Click Confirm if you want to remove this Control Point' handleClick={handleClick} />}
            <PageBreadcrumb pageTitle="Doors" />
            {createModal || updateModal ?
                <BaseForm tabContent={content} />

                :
                <BaseTable<DoorDto> headers={DOOR_TABLE_HEADER} keys={DOOR_KEY} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} onClick={handleClick} onEdit={handleEdit} onRemove={handleRemove} data={doorsDto} status={status} action={action} permission={filterPermission(FeatureId.DOOR)} renderOptionalComponent={filterComponet}/>

            }

        </>
    )
}

export default Door