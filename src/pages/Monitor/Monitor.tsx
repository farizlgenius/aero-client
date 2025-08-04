import React, { useEffect, useState } from 'react'
import Button from '../../components/ui/button/Button'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import { Add } from '../../icons'
import axios from 'axios';
import ActionElement from '../UiElements/ActionElement';
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import Modals from '../UiElements/Modals';
import AddMpForm from '../../components/form/form-elements/AddMpForm';
import * as signalR from '@microsoft/signalr';
import DangerModal from '../UiElements/DangerModal';

// Define Global Variable
const server = import.meta.env.VITE_SERVER_IP;
let removeTarget: Object;

// Interface 
interface Object {
    [key: string]: any;
}


interface StatusDto {
    scpIp: string;
    deviceNumber: number;
    status: number;
    tamper:number;
    ac:number;
    batt:number;
}

interface MpDto {
    no: number;
    name: string;
    sioNumber: number;
    sioName: string;
    sioModel: string;
    mpNumber: number;
    ipNumber: number;
    mode: number;
    scpIp: string;
    status: number;
}

// Define headers
const headers: string[] = [
    "Name", "Module Name", "Model","Input" ,"Mode", "Status", "Action"
]

// Define keys
const keys: string[] = [
    "name", "sioName", "sioModel","ipNumber","mode"
];

const Monitor = () => {
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal,setIsRemoveModal] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const closeModalToggle = () => {
        setIsAddModalOpen(false);
        toggleRefresh();
    }
    const handleClickAddMp = () => {
        setIsAddModalOpen(true);
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = () => {

    }

    const handleOnClickRemove = (data: Object) => {
        console.log(data);
        removeTarget = data;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeMonitorPoint();
        
    }

    {/* input Data */ }
    const [tableDatas, setTableDatas] = useState<MpDto[]>([]);
    const [status, setStatus] = useState<StatusDto[]>([]);
    const fetchData = async () => {
        try {
            const res = await axios.get(`${server}/api/v1/mp/all`);
            console.log(res.data.content)
            setTableDatas(res.data.content);

            // Batch set state
            const newStatuses = res.data.content.map((a: MpDto) => ({
                scpIp: a.scpIp,
                deviceNumber: a.mpNumber,
                status: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.content.forEach((a: MpDto) => {
                fetchStatus(a.scpIp, a.mpNumber);
            });

        } catch (e) {
            console.log(e);
        }
    };
    const fetchStatus = async (ScpIp: string, MpNo: number) => {
        const res = await axios.get(
            `${server}/api/v1/mp/status?ScpIp=${ScpIp}&MpNo=${MpNo}`
        );
        console.log(res);
    };

        const removeMonitorPoint = async () => {
        if (removeTarget != undefined) {
            try {
                console.log(removeTarget);

                const res = await axios.post(`${server}/api/v1/mp/remove?ScpIp=${removeTarget["scpIp"]}&MpNo=${removeTarget["mpNumber"]}`);
                if (res.status == 200) {
                    setIsRemoveModal(false);
                    toggleRefresh();
                }
                removeTarget = {};

            } catch (e) {
                console.log(e);
            }

        } else {
            console.log("undefined")
        }

    }


    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<Object[]>([]);
    const handleCheckedAll = (data: Object[], e: React.ChangeEvent<HTMLInputElement>) => {
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



    const handleChecked = (data: Object, e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(data)
        console.log(e.target.checked)
        if (setSelectedObjects) {
            if (e.target.checked) {
                setSelectedObjects((prev) => [...prev, data]);
            } else {
                setSelectedObjects((prev) =>
                    prev.filter((item) => item.no !== data.no)
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
            (ScpIp: string, first: number, count: number, status: number[]) => {
                console.log(first)
                console.log(status)
                setStatus((prev) =>
                    prev.map((a) =>
                        a.scpIp == ScpIp && a.deviceNumber == first
                            ? {
                                ...a,
                                status: status[0],
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
            {isAddModalOpen && <Modals header='Add Monitor Point' body={<AddMpForm onSubmitHandle={closeModalToggle} />}  closeToggle={closeModalToggle} />}
            <PageBreadcrumb pageTitle="Monitor Point" />
            <div className="space-y-6">
                <div className="flex gap-4">
                    <Button
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
                        onClick={handleClickAddMp}
                    >
                        Create
                    </Button>
                    <Button
                        name='on'
                        size="sm"
                        variant="primary"

                    >
                        Bypass
                    </Button>
                    <Button
                        name='off'
                        size="sm"
                        variant="primary"

                    >
                        Un Bypass
                    </Button>

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TableTemplate statusDto={status} deviceIndicate={4} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Monitor