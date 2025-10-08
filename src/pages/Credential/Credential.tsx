import React, { useEffect, useState } from 'react'
import DangerModal from '../UiElements/DangerModal';
import Modals from '../UiElements/Modals';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { Add } from '../../icons';
import Button from '../../components/ui/button/Button';
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';

import { CardHolderDto, RemoveCardHolderDto } from '../../constants/types';
import { CREDENTIAL_KEY, CREDENTIAL_TABLE_HEAD, CredentialEndPoin } from '../../constants/constant';
import AddCredentialForm from '../../modals/AddCredentialForm';

// Define Global Variable
const server = import.meta.env.VITE_SERVER_IP;
let removeTarget: string;

const Credential = () => {
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const closeModalToggle = () => {
        setIsAddModalOpen(false);
        toggleRefresh();
    };
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        console.log(e.currentTarget.value)
        switch (e.currentTarget.name) {
            case "add":
                setIsAddModalOpen(true);
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = () => {

    }

    const handleOnClickRemove = (data: CardHolderDto) => {
        console.log(data);
        removeTarget = data.cardHolderReferenceNumber;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeCardHolder();

    }

    {/* Door Data */ }
    const [tableDatas, setTableDatas] = useState<CardHolderDto[]>([]);
    const fetchData = async () => {
        try {
            const res = await axios.get(server + CredentialEndPoin.GET_CREDENTIAL_LIST);
            console.log(res.data.content)
            setTableDatas(res.data.content);

            // // Batch set state
            // const newStatuses = res.data.content.map((a: CardHolderDto) => ({
            //     scpIp: a.scpIp,
            //     deviceNumber: a.acrNumber,
            //     status: 0,
            //     tamper: 0,
            //     ac: 0,
            //     batt: 0
            // }));

            // console.log(newStatuses);

            // setStatus((prev) => [...prev, ...newStatuses]);

            // // Fetch status for each
            // setTimeout(() => {
            //     res.data.content.forEach((a: DoorDto) => {
            //         fetchStatus(a.scpIp, a.acrNumber);
            //     });
            // }, 1000);


        } catch (e) {
            console.log(e);
        }
    };

    // const fetchStatus = async (ScpIp: string, AcrNumber: number) => {
    //     try {
    //         const res = await axios.get(`${server}/api/v1/acr/status?ScpIp=${ScpIp}&AcrNo=${AcrNumber}`);
    //         console.log(res);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
    const removeCardHolder = async () => {
        if (removeTarget != undefined) {
            try {
                console.log(removeTarget);
                const res = await axios.delete(server + CredentialEndPoin.POST_REMOVE_CREDENTIAL + removeTarget);
                if (res.status == 200) {
                    setIsRemoveModal(false);
                    console.log("Here");
                    toggleRefresh();
                }
                removeTarget ="";

            } catch (e) {
                console.log(e);
            }

        } else {
            console.log("undefined")
        }

    }



    {/* UseEffect */ }
    useEffect(() => {
        // const connection = new signalR.HubConnectionBuilder()
        //     .withUrl("http://localhost:5031/acrHub")
        //     .withAutomaticReconnect()
        //     .build();

        // connection.start().then(() => {
        //     console.log("Connected to SignalR event hub");
        // });
        // connection.on(
        //     "AcrStatus",
        //     (ScpMac: string, AcrNo: number, RelayStatus: string, AcrMode: string, AccessPointStatus: string) => {
        //         console.log(ScpMac)
        //         console.log(AcrNo)
        //         console.log(RelayStatus)
        //         console.log(AcrMode)
        //         console.log(AccessPointStatus)
        //         setStatus((prev) =>
        //             prev.map((a) =>
        //                 a.scpMac == ScpMac && a.deviceNumber == AcrNo ? {
        //                     ...a,
        //                     status: AccessPointStatus,
        //                     tamper: RelayStatus == "" ? a.tamper : RelayStatus,
        //                 } : {
        //                     ...a
        //                 }
        //             )
        //         )
        //     }
        // );

        fetchData();

        // return () => {
        //     connection.stop();
        // };

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<CardHolderDto[]>([]);
    const handleCheckedAll = (data: CardHolderDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: CardHolderDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            {isRemoveModal && <DangerModal header='Remove Credentials' body='Please Click Confirm if you want to remove this users' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {isAddModalOpen && <Modals header='Add Credentials' body={<AddCredentialForm onSubmitHandle={closeModalToggle} />} closeToggle={closeModalToggle} isWide={true} />}
            <PageBreadcrumb pageTitle="Credentials" />
            <div className="space-y-6">
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
                        name='deactivate'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
                    >
                        Deactivate
                    </Button>
                    <Button
                        name='activate'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
                    >
                        Activate
                    </Button>
                    <Button
                        name='reset'
                        onClickWithEvent={handleClick}
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
                    >
                        Reset Anti-Passback
                    </Button>

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TableTemplate<CardHolderDto> checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={CREDENTIAL_TABLE_HEAD} tableDatas={tableDatas} tableKeys={CREDENTIAL_KEY} status={false} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Credential