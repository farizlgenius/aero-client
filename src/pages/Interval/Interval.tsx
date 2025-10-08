import React, { useEffect, useState } from 'react'
import TableTemplate from '../../components/tables/Tables/TableTemplate';
import ActionElement from '../UiElements/ActionElement';
import { Add } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import Modals from '../UiElements/Modals';
import { IntervalDto } from '../../constants/types';
import { HttpMethod, PopUpMsg, IntervalEndPoint, INTERVAL_TABLE_HEAD, INTERVAL_KEY, TableContent } from '../../constants/constant';
import HttpRequest from '../../utility/HttpRequest';
import { usePopupActions } from '../../utility/PopupCalling';
import AddIntervalForm from './IntervalForm';
import Helper from '../../utility/Helper';

// Define Global Variable
let removeTarget: number;
const defaultDto = {
    componentNo: 0,
    days: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
    },
    daysDesc: "",
    startTime: "",
    endTime: ""
}


const Interval = () => {
    const { showPopup } = usePopupActions();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);

    const [intervalDto, setIntervalDto] = useState<IntervalDto>(defaultDto);

    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    const createInterval = async (data: IntervalDto) => {
        if (!Helper.isDayEmpty(data.days)) {
            showPopup(false,["Day can't be empty"])       
        } else if (!Helper.isValidTimeRange(data.startTime, data.endTime)) {
            showPopup(false,["Start time must lower than end time"])
        }
        else {
            const res = await HttpRequest.send(HttpMethod.POST, IntervalEndPoint.POST_ADD_INTERVAL, data)
            if(Helper.handlePopupByResCode(res,showPopup)){
                setCreateModal(false);
                setUpdateModal(false);
                toggleRefresh();
            }
        }


    }

    const updateInterval = async (data: IntervalDto) => {
        if (!Helper.isDayEmpty(data.days)) {
            showPopup(false,["Day can't be empty"]);
        } else if (!Helper.isValidTimeRange(data.startTime, data.endTime)) {
            showPopup(false,["Start time must lower than end time"]);
        }
        else {
            const res = await HttpRequest.send(HttpMethod.PUT, IntervalEndPoint.PUT_UPDATE_INTERVAL, data)
            Helper.handlePopupByResCode(res,showPopup);
        }
    }


    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreateModal(true);
                break;
            case "create":
                createInterval(intervalDto);
                break;
            case "update":
                updateInterval(intervalDto);
                break;
            case "close":
            case "cancel":
                setIntervalDto({...defaultDto,days:defaultDto.days  })
                setCreateModal(false);
                setUpdateModal(false);
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = (data: IntervalDto) => {
        intervalDto.days = data.days
        setIntervalDto(data);
        setUpdateModal(true);
    }


    const handleOnClickRemove = (data: IntervalDto) => {
        removeTarget = data.componentNo;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        setIsRemoveModal(false);
        removeInterval();
    }

    {/* Group Data */ }
    const [tableDatas, setTableDatas] = useState<IntervalDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, IntervalEndPoint.GET_INTERVAL)
        console.log(res);
        if (res) {
            setTableDatas(res.data.data);
        }

    };
    const removeInterval = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, IntervalEndPoint.DELETE_INTERVAL + removeTarget)
        if(Helper.handlePopupByResCode(res,showPopup)){
            toggleRefresh();
        }
    }
    {/* State */ }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name)
        console.log(e.target.value);
        switch (e.target.name) {
            case "startTime":
            case "endTime":
                setIntervalDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                break;
            default:
                setIntervalDto((prev) => ({ ...prev, days: { ...prev.days, [e.target.name]: e.target.checked } }))
                break;
        }
    }

    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<IntervalDto[]>([]);
    const handleCheckedAll = (data: IntervalDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: IntervalDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
            {isRemoveModal && <DangerModal header='Remove Interval' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {createModal && <Modals isWide={false} header='Add Interval' body={<AddIntervalForm isUpdate={false} data={intervalDto} handleClickWithEvent={handleClickWithEvent} handleChange={handleChange} />} handleClickWithEvent={handleClickWithEvent} />}
            {updateModal && <Modals isWide={false} header='Update Interval' body={<AddIntervalForm isUpdate={true} data={intervalDto} handleClickWithEvent={handleClickWithEvent} handleChange={handleChange} />} handleClickWithEvent={handleClickWithEvent} />}
            <PageBreadcrumb pageTitle="Interval" />
            <div className="space-y-6">
                <div className="flex gap-4">
                    <Button
                        name='add'
                        size="sm"
                        variant="primary"
                        startIcon={<Add className="size-5" />}
                        onClickWithEvent={handleClickWithEvent}
                    >
                        Add
                    </Button>

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TableTemplate deviceIndicate={TableContent.INTERVAL} checkbox={true} onCheckedAll={handleCheckedAll} onChecked={handleChecked} tableHeaders={INTERVAL_TABLE_HEAD} tableDatas={tableDatas} tableKeys={INTERVAL_KEY} status={true} action={true} selectedObject={selectedObjects} actionElement={(row) => (
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={row} />
                        )} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default Interval


