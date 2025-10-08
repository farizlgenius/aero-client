import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import * as signalR from '@microsoft/signalr';
import Button from '../../components/ui/button/Button';
import { Add } from '../../icons';
import Modals from '../UiElements/Modals';
import DangerModal from '../UiElements/DangerModal';
import { CpDto, CpTriggerDto, RemoveCpDto, StatusDto } from '../../constants/types';
import { CP_KEY, CP_TABLE_HEADER, CPEndPoint, HttpMethod, PopUpMsg } from '../../constants/constant';
import HttpRequest from '../../utility/HttpRequest';
import { usePopupActions } from '../../utility/PopupCalling';
import AddCpForm from '../../modals/AddCpForm';
import Logger from '../../utility/Logger';

// Define Global Variable
let removeTarget: RemoveCpDto;


const Control = () => {
    const {showPopup} = usePopupActions();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const closeModalToggle = () => {
        setIsAddModalOpen(false);
        toggleRefresh();
    };
    const handleClickAddCpModal = () => {
        setIsAddModalOpen(true);
    }
    {/* handle Table Action */ }
    const handleOnClickEdit = () => {

    }

    const handleOnClickRemove = (data: CpDto) => {
        console.log(data);
        removeTarget = {
            scpMac: data.mac,
            cpNo: data.componentNo
        };
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeControlPoint();

    }
    {/* Output Data */ }
    const [tableDatas, setTableDatas] = useState<CpDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET,CPEndPoint.GET_CP_LIST);
        if(res && res.data.data){
              console.log(res.data.data)
            setTableDatas(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: CpDto) => ({
                scpMac: a.mac,
                deviceNumber: a.componentNo,
                status: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.data.forEach((a: CpDto) => {
                fetchStatus(a.mac, a.componentNo);
            });

        }
    };

    const fetchStatus = async (scpMac: string, cpNo: number) => {
        const res = await HttpRequest.send(HttpMethod.GET,CPEndPoint.GET_CP_STATUS  + scpMac+"/"+cpNo);
        Logger.info(res);
    };

    const removeControlPoint = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, CPEndPoint.DELETE_CP + removeTarget.scpMac + "/" + removeTarget.cpNo);
        if (res) {
            if (res.data.code == 200) {
                setIsRemoveModal(false);
                toggleRefresh();
                showPopup(true, [PopUpMsg.DELETE_CP]);
                removeTarget = {
                    scpMac:"",
                    cpNo:-1
                }
            } else {
                setIsRemoveModal(false);
                toggleRefresh();
                showPopup(false, res.data.errors);
                                removeTarget = {
                    scpMac:"",
                    cpNo:-1
                }
            }
        }
    }




    {/* UseEffect */ }
    useEffect(() => {

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5031/cpHub")
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            console.log("Connected to SignalR event hub");
        });
        connection.on(
            "CpStatus",
            (scpMac: string, first: number, status: string) => {
                console.log(scpMac)
                console.log(first)
                console.log(status)
                setStatus((prev) =>
                    prev.map((a) =>
                        a.scpMac == scpMac && a.deviceNumber == first
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
            }
        );
        setTimeout(() => {
            fetchData();
        }, 150)


        return () => {
            connection.stop();
        };

    }, [refresh]);

    {/* Button Command */ }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name)
        switch (e.currentTarget.name) {
            case "create":
                break;
            case "delete":
                console.log(status);
                break;
            case "on":
                console.log(selectedObjects);
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a: CpDto) => {
                        let data: CpTriggerDto = {
                            scpMac: a.mac,
                            cpNo: a.componentNo,
                            command: 2
                        }
                        const res = await HttpRequest.send(HttpMethod.POST, CPEndPoint.POST_CP_TRIGGER, data);
                        if (res) {
                            if (res.data.code == 200) {
                                showPopup(true, [PopUpMsg.TRIGGER_CP]);
                            } else {
                                showPopup(false, res.data.errors);
                            }
                        }
                        //fetchStatus(a["scpIp"], a["cpNumber"]);
                    });
                }

                break;
            case "off":
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a: CpDto) => {
                        let data: CpTriggerDto = {
                            scpMac: a.mac,
                            cpNo: a.componentNo,
                            command: 1
                        }
                        const res = await HttpRequest.send(HttpMethod.POST, CPEndPoint.POST_CP_TRIGGER, data);
                        if (res) {
                            if (res.data.code == 200) {
                                showPopup(true, [PopUpMsg.TRIGGER_CP]);
                            } else {
                                showPopup(false, res.data.errors);
                            }
                        }
                        //fetchStatus(a["scpIp"], a["cpNumber"]);
                    });
                }
                break;
            case "toggle":
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a: CpDto) => {
                        let data: CpTriggerDto = {
                            scpMac: a.mac,
                            cpNo: a.componentNo,
                            command: 3
                        }
                        const res = await HttpRequest.send(HttpMethod.POST, CPEndPoint.POST_CP_TRIGGER, data);
                        if (res) {
                            if (res.data.code == 200) {
                                showPopup(true, [PopUpMsg.TRIGGER_CP]);
                            } else {
                                showPopup(false, res.data.errors);
                            }
                        }
                        //fetchStatus(a["scpIp"], a["cpNumber"]);
                    });
                }
                break;
            default:
                break;
        }
    };

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<CpDto[]>([]);
    const handleCheckedAll = (data: CpDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: CpDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            {isRemoveModal && <DangerModal header='Remove Control Point' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {isAddModalOpen && <Modals header='Add Control Point' body={<AddCpForm onSubmitHandle={closeModalToggle} />} closeToggle={closeModalToggle} />}
            <PageBreadcrumb pageTitle="Control Point" />
            <div className="space-y-6">
                <div className="flex gap-4">
                    <Button
                        onClick={handleClickAddCpModal}
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
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
                        <TableTemplate<CpDto> deviceIndicate={3} statusDto={status} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={CP_TABLE_HEADER} tableDatas={tableDatas} tableKeys={CP_KEY} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Control