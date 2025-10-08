import React, { useEffect, useState } from 'react'
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import { Add } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import Modals from '../UiElements/Modals';
import { HolidayDto } from '../../constants/types';
import { HttpMethod, HolidayEndPoint, PopUpMsg, Hol_TABLE_HEAD, Hol_KEY } from '../../constants/constant';
import HttpRequest from '../../utility/HttpRequest';
import { usePopupActions } from '../../utility/PopupCalling';
import HolidayForm from './HolidayForm';
import Helper from '../../utility/Helper';

// Define Global Variable
let removeTarget: number;
const defaultDto: HolidayDto = {
    componentNo: -1,
    year: 0,
    month: 0,
    day: 0,
    typeMask: 0
}

const Holiday = () => {
    const { showPopup } = usePopupActions();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [holidatDto,setHolidayDto] = useState<HolidayDto>(defaultDto)
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreateModal(true);
                break;
            case "create":
                createHoliday(holidatDto)
                break;
            case "update":
                updateHoliday(holidatDto);
                break;
            case "close":
                setCreateModal(false);
                setUpdateModal(false);
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = (data:HolidayDto) => {
        setHolidayDto(data)
        setUpdateModal(true);
    }

    const handleOnClickRemove = (data: HolidayDto) => {
        console.log(data);
        removeTarget = data.componentNo;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        setIsRemoveModal(false);
        removeHoliday();
    }

    const createHoliday = async (data: HolidayDto) => {
        const res = await HttpRequest.send(HttpMethod.POST, HolidayEndPoint.POST_HOL, data)
        if(Helper.handlePopupByResCode(res,showPopup)) setCreateModal(false);
        toggleRefresh();
    }

    const updateHoliday = async (data:HolidayDto) => {
        const res = await HttpRequest.send(HttpMethod.PUT,HolidayEndPoint.PUT_HOL,data)
        if(Helper.handlePopupByResCode(res,showPopup)) setUpdateModal(false);
        toggleRefresh();
    }

    {/* Group Data */ }
    const [tableDatas, setTableDatas] = useState<HolidayDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, HolidayEndPoint.GET_HOL_LIST)
        if (res) {
            setTableDatas(res.data.data);
        }
    };

    const removeHoliday = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, HolidayEndPoint.DELETE_HOL + removeTarget)
        if (res) {
            if (res.data.code == 200) {
                showPopup(true, [PopUpMsg.DELETE_HOL]);
            } else {
                showPopup(false, res.data.errors);
            }
        } else {
            showPopup(false, [PopUpMsg.DELETE_HOL]);
        }
        toggleRefresh();


    }

    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<HolidayDto[]>([]);
    const handleCheckedAll = (data: HolidayDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: HolidayDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            {isRemoveModal && <DangerModal header='Remove Holiday' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {createModal && <Modals isWide={false} header='Add Holiday' body={<HolidayForm isUpdate={false} setHolidayDto={setHolidayDto} handleClickWithEvent={handleClick} data={holidatDto} />} handleClickWithEvent={handleClick} />}
            {updateModal && <Modals isWide={false} header='Update Holiday' body={<HolidayForm isUpdate={true} setHolidayDto={setHolidayDto} handleClickWithEvent={handleClick} data={holidatDto} />} handleClickWithEvent={handleClick} />}
            <PageBreadcrumb pageTitle="Holiday" />
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
                        <TableTemplate checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={Hol_TABLE_HEAD} tableDatas={tableDatas} tableKeys={Hol_KEY} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Holiday


