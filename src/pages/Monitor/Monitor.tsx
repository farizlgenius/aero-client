import React, { useEffect, useState } from 'react'
import Button from '../../components/ui/button/Button'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { Add, Mask, Unmask } from '../../icons'
import ActionElement from '../UiElements/ActionElement';
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import Modals from '../UiElements/Modals';
import * as signalR from '@microsoft/signalr';
import DangerModal from '../UiElements/DangerModal';
import { DeleteMpDto, MpDto, StatusDto } from '../../constants/types';
import { HttpMethod, MP_KEY, MP_TABLE_HEADER, MPEndPoint, PopUpMsg } from '../../constants/constant';
import HttpRequest from '../../utility/HttpRequest';
import { usePopupActions } from '../../utility/PopupCalling';
import Logger from '../../utility/Logger';
import AddMpForm from '../../modals/AddMpForm';

// Define Global Variable
let removeTarget: DeleteMpDto;


const Monitor = () => {
    const { showPopup } = usePopupActions();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const closeModalToggle = () => {
        setIsAddModalOpen(false);
        toggleRefresh();
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = () => {

    }

    const handleOnClickRemove = (data: MpDto) => {
        console.log(data);
        removeTarget = { componentNo: data.componentNo, mac: data.mac };
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
                setIsAddModalOpen(true);
                break;
            case "mask":
                selectedObjects.forEach(async (a: MpDto) => {
                    res = await HttpRequest.send(HttpMethod.POST, MPEndPoint.POST_MASK, a);
                    console.log(res);
                    if (res) {
                        if (res.data.code == 200) {
                            showPopup(true, [PopUpMsg.MASK_MP]);
                        } else {
                            showPopup(false, res.data.errors);
                        }
                        toggleRefresh();
                    }
                })

                break;
            case "unmask":
                selectedObjects.forEach(async (a: MpDto) => {
                    res = await HttpRequest.send(HttpMethod.POST, MPEndPoint.POST_UNMASK, a);
                    console.log(res);
                    if (res) {
                        if (res.data.code == 200) {
                            showPopup(true, [PopUpMsg.UNMASK_MP]);
                        } else {
                            showPopup(false, res.data.errors);
                        }
                        toggleRefresh();
                    }
                })
                break;
        }
    }

    {/* input Data */ }
    const [tableDatas, setTableDatas] = useState<MpDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, MPEndPoint.GET_MP_LIST);
        console.log(res)
        if (res?.data.data) {
            setTableDatas(res.data.data);

            // Batch set state
            const newStatuses = res.data.data.map((a: MpDto) => ({
                scpMac: a.mac,
                deviceNumber: a.componentNo,
                status: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.data.forEach((a: MpDto) => {
                fetchStatus(a.mac, a.componentNo);
            });
        }

    };
    const fetchStatus = async (scpMac: string, mpNo: number) => {
        const res = await HttpRequest.send(HttpMethod.GET, MPEndPoint.GET_MP_STATUS + scpMac + "/" + mpNo);
        Logger.info(res);
    };

    const removeMonitorPoint = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, MPEndPoint.DELETE_MP + removeTarget.mac + "/" + removeTarget.componentNo);
        if (res) {
            if (res.status == 200) {
                setIsRemoveModal(false);
                toggleRefresh();
                showPopup(true, [PopUpMsg.DELETE_MP]);
            } else {
                setIsRemoveModal(false);
                toggleRefresh();
                showPopup(true, res.data.errors);
            }
            removeTarget = {
                componentNo: -1,
                mac: "",
            };
        }
    }


    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<MpDto[]>([]);
    const handleCheckedAll = (data: MpDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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



    const handleChecked = (data: MpDto, e: React.ChangeEvent<HTMLInputElement>) => {
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

    {/* UseEffect */ }
    useEffect(() => {

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5031/mpHub")
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            console.log("Connected to SignalR event hub");
        });
        connection.on(
            "MpStatus",
            (scpMac: string, first: number, status: string) => {
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
        }, 250);

        return () => {
            connection.stop();
        };
    }, [refresh]);

    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Monitor Point' body='Please Click Confirm if you want to remove this Monitor Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {isAddModalOpen && <Modals header='Add Monitor Point' body={<AddMpForm onSubmitHandle={closeModalToggle} />} closeToggle={closeModalToggle} />}
            <PageBreadcrumb pageTitle="Monitor Point" />
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
                        startIcon={<Mask/>}
                    >
                        Mask
                    </Button>
                    <Button
                        name='unmask'
                        size="sm"
                        variant="primary"
                        onClickWithEvent={handleClick}
                        startIcon={<Unmask/>}
                    >
                        Unmask
                    </Button>

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TableTemplate<MpDto> statusDto={status} deviceIndicate={4} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={MP_TABLE_HEADER} tableDatas={tableDatas} tableKeys={MP_KEY} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Monitor