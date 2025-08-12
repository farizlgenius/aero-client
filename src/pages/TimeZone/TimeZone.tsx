import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import { Add } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import Modals from '../UiElements/Modals';
import AddTimeZoneForm from '../../components/form/form-elements/AddTimeZoneForm';

// Define Global Variable
const server = import.meta.env.VITE_SERVER_IP;
let removeTarget: Object;

// Interface 
interface Object {
    [key: string]: any;
}

interface TimeZoneDtp {
    no:number;
    name:string;
    scpIp:string;
    tzNumber:number;
    mode:number;
    activeDate:string;
    deactiveDate:string;
    intervals:number;
}

// Define Headers 

const headers: string[] = [
    "Name", "Active Date","Deactive Date", "Action"
]

const keys: string[] = [
    "name", "activeDate","deactiveDate"
];

const TimeZone = () => {
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

    const handleOnClickRemove = (data: Object) => {
        console.log(data);
        removeTarget = data;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeAccessGroup();

    }

    {/* Group Data */ }
    const [tableDatas, setTableDatas] = useState<TimeZoneDtp[]>([]);
    const fetchData = async () => {
        try {
            const res = await axios.get(`${server}/api/v1/tz/all`);
            console.log(res.data.content)
            setTableDatas(res.data.content);

        } catch (e) {
            console.log(e);
        }
    };
    const removeAccessGroup = async () => {
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

        fetchData();

    }, []);

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
            {isRemoveModal && <DangerModal header='Remove Time Zone' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {isAddModalOpen && <Modals isWide={false} header='Add Time Zone' body={<AddTimeZoneForm onSubmitHandle={closeModalToggle} />} closeToggle={closeModalToggle} />}
            <PageBreadcrumb pageTitle="Time Zone" />
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

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TableTemplate checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={headers} tableDatas={tableDatas} tableKeys={keys} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default TimeZone