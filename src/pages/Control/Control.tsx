import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import Button from '../../components/ui/button/Button';
import { Add } from '../../icons';
import Modals from '../UiElements/Modals';
import AddCpForm from '../../components/form/form-elements/AddCpForm';
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

interface CpDto {
    no: number;
    name: string;
    sioNumber: number;
    sioName: string;
    sioModel: string;
    cpNumber: number;
    opNumber: number;
    mode: string;
    scpIp: string;
    status: number;
}

// Define Headers 

const headers: string[] = [
    "Name", "Module Name", "Module", "Mode", "Status", "Action"
]

const keys: string[] = [
    "name", "sioName", "sioModel", "mode"
];


const Control = () => {
    const [refresh,setRefresh] = useState(false);
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

    const handleOnClickRemove = (data: Object) => {
        console.log(data);
        removeTarget = data;
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
        try {
            const res = await axios.get(`${server}/api/v1/cp/all`);
            console.log(res.data.content)
            setTableDatas(res.data.content);

            // Batch set state
            const newStatuses = res.data.content.map((a: CpDto) => ({
                scpIp: a.scpIp,
                deviceNumber: a.cpNumber,
                status: 0
            }));

            console.log(newStatuses);

            setStatus((prev) => [...prev, ...newStatuses]);

            // Fetch status for each
            res.data.content.forEach((a: CpDto) => {
                fetchStatus(a.scpIp, a.cpNumber);
            });

        } catch (e) {
            console.log(e);
        }
    };
    const fetchStatus = async (ScpIp: string, CpNo: number) => {
        const res = await axios.get(
            `${server}/api/v1/cp/status?ScpIp=${ScpIp}&CpNo=${CpNo}`
        );
        console.log(res);
    };

    const removeControlPoint = async () => {
        if (removeTarget != undefined) {
            try {
                console.log(removeTarget);

                const res = await axios.post(`${server}/api/v1/cp/remove?ScpIp=${removeTarget["scpIp"]}&CpNo=${removeTarget["cpNumber"]}`);
                if (res.status == 200) {
                    setIsRemoveModal(false);
                    console.log("Here");
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
        fetchData();

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
                    selectedObjects.map(async (a) => {
                        const res = await axios.post(
                            `${server}/api/v1/cp/trigger?ScpIp=${a["scpIp"]}&CpNumber=${a["cpNumber"]}&Command=2`
                        );
                        console.log(res);
                        //fetchStatus(a["scpIp"], a["cpNumber"]);
                    });
                }

                break;
            case "off":
                console.log(selectedObjects);
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a) => {
                        const res = await axios.post(
                            `${server}/api/v1/cp/trigger?ScpIp=${a["scpIp"]}&CpNumber=${a["cpNumber"]}&Command=1`
                        );
                        console.log(res);
                        //fetchStatus(a["scpIp"], a["cpNumber"]);
                    });
                }
                break;
            case "toggle":
                console.log(selectedObjects);
                if (selectedObjects.length > 0) {
                    selectedObjects.map(async (a) => {
                        const res = await axios.post(
                            `http://localhost:5031/api/v1/cp/trigger?ScpIp=${a["scpIp"]}&CpNumber=${a["cpNumber"]}&Command=3`
                        );
                        console.log(res);
                        //fetchStatus(a["scpIp"],a["cpNumber"]);
                    });
                }
                break;
            default:
                break;
        }
    };

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
                        <TableTemplate deviceIndicate={3} statusDto={status} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Control