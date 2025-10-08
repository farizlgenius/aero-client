import React, {  useEffect, useState } from 'react'
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import { Add } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import Modals from '../UiElements/Modals';
import { TimeZoneDto } from '../../constants/types';
import { TIMEZONE_TABLE_HEAD, TIMEZONE_KEY, HttpMethod, TimeZoneEndPoint } from '../../constants/constant';
import HttpRequest from '../../utility/HttpRequest';
import { usePopupActions } from '../../utility/PopupCalling';
import TimeZoneForm from './TimeZoneForm';
import Helper from '../../utility/Helper';

// Define Global Variable
let removeTarget: Number;


const defaultDto: TimeZoneDto = {
    componentNo: -1,
    name: "",
    mode: -1,
    activeTime: "",
    deactiveTime: "",
    intervals: []
}


const TimeZone = () => {
    const { showPopup } = usePopupActions();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [removeModal, setRemoveModal] = useState<boolean>(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);
    {/* Data */ }
    const [timeZoneDto, setTimeZoneDto] = useState<TimeZoneDto>(defaultDto);


    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget)
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreateModal(true);
                break;
            case "create":
                createTimeZone(timeZoneDto);
                break;
            case "close":
                setCreateModal(false);
                setUpdateModal(false);
                setTimeZoneDto(defaultDto)
                break;
            case "update":
                break;
            default:
                break;
        }
    }

    const createTimeZone = async (data: TimeZoneDto) => {
        const res = await HttpRequest.send(HttpMethod.POST, TimeZoneEndPoint.POST_ADD_TZ, data)
        if(Helper.handlePopupByResCode(res, showPopup)){
            setUpdateModal(false);
            setCreateModal(false);
            toggleRefresh();
        }
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = (data:TimeZoneDto) => {
        console.log(data)
        setTimeZoneDto(data)
        setUpdateModal(true)
    }

    const handleOnClickRemove = (data:TimeZoneDto) => {
        console.log(data);
        removeTarget = data.componentNo;
        setRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeTimeZone();

    }

    {/* Group Data */ }
    const [tableDatas, setTableDatas] = useState<TimeZoneDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, TimeZoneEndPoint.GET_TZ_LIST)
        if (res) {
            setTableDatas(res.data.data);
            console.log(res.data.data)
        }
    };

    const removeTimeZone = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, TimeZoneEndPoint.DELETE_TZ  + removeTarget);
        console.log(res)
        if (Helper.handlePopupByResCode(res, showPopup)){
            setRemoveModal(false);
            toggleRefresh();
        }

    }


    {/* UseEffect */ }
    useEffect(() => {
        fetchData();
    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<TimeZoneDto[]>([]);
    const handleCheckedAll = (data: TimeZoneDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: TimeZoneDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            {removeModal && <DangerModal header='Remove Time Zone' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {createModal && <Modals isWide={true} body={<TimeZoneForm handleClick={handleClick} data={timeZoneDto}  setTimeZoneDto={setTimeZoneDto} />} handleClickWithEvent={handleClick} />}
            {updateModal && <Modals isWide={true} body={<TimeZoneForm handleClick={handleClick}  data={timeZoneDto} setTimeZoneDto={setTimeZoneDto} />} handleClickWithEvent={handleClick} />}
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
                        <TableTemplate<TimeZoneDto> checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={TIMEZONE_TABLE_HEAD} tableDatas={tableDatas} tableKeys={TIMEZONE_KEY} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            row.componentNo !== 1 &&
                            <ActionElement isDetail={false} onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default TimeZone