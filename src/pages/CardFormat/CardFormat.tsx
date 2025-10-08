import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from '../../components/ui/button/Button';
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import { Add } from '../../icons';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { CardFormatDto, TimeZoneDto } from '../../constants/types';
import { CARDFORMAT_KEY, CARDFORMAT_TABLE_HEAD, CardFormatEndPoint } from '../../constants/constant';
import Modals from '../UiElements/Modals';
import DangerModal from '../UiElements/DangerModal';
import AddCardFormatForm from '../../modals/AddCardFormatForm';


// Define Global Variable
const server = import.meta.env.VITE_SERVER_IP;
let removeTarget:number = -1;

const CardFormat = () => {
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const closeModalToggle = () => {
        setIsAddModalOpen(false);
        toggleRefresh();
    };

    const handleClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch(e.currentTarget.name){
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

    const handleOnClickRemove = (data: CardFormatDto) => {
        console.log(data);
        setIsRemoveModal(true);
        removeTarget = data.elementNo
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeCardFormat(removeTarget);

    }

    {/* Group Data */ }
    const [tableDatas, setTableDatas] = useState<CardFormatDto[]>([]);
    const fetchData = async () => {
        try {
            const res = await axios.get(server+CardFormatEndPoint.GET_ALL_CARDFORMAT);
            console.log(res.data.content)
            setTableDatas(res.data.content);

        } catch (e) {
            console.log(e);
        }
    };
    const removeCardFormat = async (cardFormatNo:number) => {
            try {
                const res = await axios.delete(server + CardFormatEndPoint.DELETE_CARDFORMAT + cardFormatNo);
                if (res.status == 200) {
                    setIsRemoveModal(false);
                    console.log("Here");
                    toggleRefresh();
                }
                removeTarget = -1;

            } catch (e) {
                console.log(e);
            }

    }


    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<CardFormatDto[]>([]);
    const handleCheckedAll = (data: CardFormatDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: CardFormatDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            {isRemoveModal && <DangerModal header='Remove Card Format' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {isAddModalOpen && <Modals isWide={false} header='Add Card Format' body={<AddCardFormatForm onSubmitHandle={closeModalToggle} />} closeToggle={closeModalToggle} />}
            <PageBreadcrumb pageTitle="Card Format Configuration" />
            <div className="space-y-6">
                <div className="flex gap-4">
                    <Button
                        name='add'
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
                        onClickWithEvent={handleClick}
                    >
                        Add  
                    </Button>

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TableTemplate<CardFormatDto> checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={CARDFORMAT_TABLE_HEAD} tableDatas={tableDatas} tableKeys={CARDFORMAT_KEY} status={false} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default CardFormat