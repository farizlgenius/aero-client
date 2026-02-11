import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import {  ControlIcon, DisableIcon, DoorIcon,  LockIcon, MomentIcon, UnlockIcon } from '../../icons';
import Logger from '../../utility/Logger';
import DoorForm from './DoorForm';
import Helper from '../../utility/Helper';
import { DoorDto } from '../../model/Door/DoorDto';
import { StatusDto } from '../../model/StatusDto';
import { useToast } from '../../context/ToastContext';
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
import { DoorToast } from '../../model/ToastMessage';
import { usePagination } from '../../context/PaginationContext';
import { FormType } from '../../model/Form/FormProp';
import { usePopup } from '../../context/PopupContext';
import { AcrStatus as AcrStatus } from '../../model/Door/AcrStatus';



// ACR Page
export const DOOR_TABLE_HEADER: string[] = ["Name", "Mode", "Status", "Action"]
export const DOOR_KEY: string[] = ["name"];

const Door = () => {
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const {setPagination} = usePagination();
    const { setRemove, setConfirmRemove,setConfirmCreate ,setCreate,setUpdate,setConfirmUpdate,setInfo,setMessage} = usePopup();
    const defaultDto: DoorDto = {
        name: '',
        acrId:-1,
        accessConfig: -1,
        pairDoorNo: -1,
        readers: [
            {
                // base 
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
                osdpSecureChannel: 0x00,
                hardwareName: ''
            },
            {
                // base 
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
                osdpSecureChannel: 0x00,
                hardwareName: ''
            }
        ],
        strk: {
            moduleId: -1,
            outputNo: -1,
            relayMode: -1,
            offlineMode: -1,

            // base
            componentId: -1,
            mac: '',
            locationId: locationId,
            isActive: true,
            strkMax: 5,
            strkMin: 1,
            strkMode: -1,
            hardwareName: ''
        },
        sensor: {
            moduleId: -1,
            inputNo: -1,
            inputMode: -1,
            holdTime: 0,

            // base
            componentId: -1,
            mac: '',
            locationId: locationId,
            isActive: true,
            debounce: 0,
            dcHeld: 0,
            hardwareName: ''
        },
        requestExits: [{
            // base 
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
            maskTimeZone: -1,
            hardwareName: ''
        }, {
            // base 
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
            maskTimeZone: -1,
            hardwareName: ''
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
        componentId: -1,
        mac: '',
        locationId: locationId,
        isActive: true,
        strkComponentId: 0,
        sensorComponentId: 0,
        hardwareName: ''
    }
    const [doorDto, setDoorDto] = useState<DoorDto>(defaultDto)
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [form,setForm] = useState<boolean>(false);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        console.log(e.currentTarget.value)
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
                    selectedObjects.map(async (a:DoorDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(DoorEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,DoorToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(DoorEndpoint.CREATE,doorDto);
                    if (Helper.handleToastByResCode(res, DoorToast.CREATE, toggleToast)) {
                        setForm(false)
                        setDoorDto(defaultDto)
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(DoorEndpoint.UPDATE,doorDto)
                    if (Helper.handleToastByResCode(res, DoorToast.UPDATE, toggleToast)) {
                        setForm(false)
                        setDoorDto(defaultDto)
                        toggleRefresh();
                    }
                });
                setUpdate(true)
                break;
            case "close":
            case "cancel":
                setDoorDto(defaultDto)
                setForm(false);
                break;
           case "unlock":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentId, 2,a.acrId);
                })
                break;
            case "lock":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentId, 3,a.acrId);
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
                    changeDoorMode(a.mac, a.componentId, a.defaultMode,a.acrId);
                })
                break;
            case "disable":
                selectedObjects.map(a => {
                    changeDoorMode(a.mac, a.componentId, 1,a.acrId);
                })
                break;
            default:
                break;
        }
    }



     const handleRemove = (data: DoorDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(DoorEndpoint.DELETE(data.componentId))
        if (Helper.handleToastByResCode(res, DoorToast.DELETE, toggleToast)) {
            setRemove(false)
            toggleRefresh();
        }
        })
        setRemove(true);
    }


    {/* handle Table Action */ }
    const handleEdit = (data: DoorDto) => {
        setDoorDto(data);
        setFormType(FormType.UPDATE)
        setForm(true);
    }

    const handleInfo = (data:DoorDto) => {
        setDoorDto(data);
        setFormType(FormType.INFO)
        setForm(true);
    }

    {/* Door Data */ }
    const [doorsDto, setDoorsDto] = useState<DoorDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async (pageNumber: number, pageSize: number,locationId?:number,search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(DoorEndpoint.PAGINATION(pageNumber,pageSize,locationId,search, startDate, endDate));
        Logger.info(res);
        if (res && res.data.data) {
            console.log(res.data.data)
            setDoorsDto(res.data.data.data);
            setPagination(res.data.data.page);

            // Batch set state
            const newStatuses = res.data.data.data.map((a: DoorDto) => ({
                macAddress: a.mac,
                componentId: a.componentId,
                status: 0,
                tamper: a.modeDesc,
                ac: 0,
                batt: 0
            }));

            console.log(">>>>>>>>>." + JSON.stringify(newStatuses));

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.data.data.forEach((a: DoorDto) => {
                fetchStatus(a.mac, a.componentId);
            });
        }

    };
    const fetchStatus = async (scpMac: string, acrNo: number) => {
        const res = await send.get(DoorEndpoint.GET_ACR_STATUS(scpMac, acrNo));
        Logger.info(res)
    }

    const changeDoorMode = async (mac: string, componentId: number, mode: number,acrId:number) => {
        const data = {
            mac, componentId, mode,acrId
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
            "ACR.STATUS",
            (status: AcrStatus) => {
                setStatus((prev) =>
                    prev.map((a) =>
                        a.macAddress == status.mac && a.componentId == status.number ? {
                            ...a,
                            status: status.status == "" ? a.status : status.status,
                            tamper: status.mode == "" ? a.tamper : status.mode
                        } : {
                            ...a
                        }
                    )
                )
                toggleRefresh();
            }
        );

    }, []);



    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<DoorDto[]>([]);
  
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
            content: <DoorForm handleClick={handleClick} dto={doorDto} setDto={setDoorDto} type={formType} />,
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
            <PageBreadcrumb pageTitle="Doors" />
            {form ?
                <BaseForm tabContent={content} />

                :
                <BaseTable<DoorDto> headers={DOOR_TABLE_HEADER} keys={DOOR_KEY} select={selectedObjects} setSelect={setSelectedObjects} onInfo={handleInfo} onClick={handleClick} onEdit={handleEdit} onRemove={handleRemove} data={doorsDto} status={status} action={action} permission={filterPermission(FeatureId.DOOR)} renderOptionalComponent={filterComponet} fetchData={fetchData} locationId={locationId} refresh={refresh}/>

            }

        </>
    )
}

export default Door