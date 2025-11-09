import React, { useEffect, useState } from 'react'
import { Add } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import HttpRequest from '../../utility/HttpRequest';
import AddIntervalForm from './IntervalForm';
import Helper from '../../utility/Helper';
import { IntervalTable } from './IntervalTable';
import { IntervalDto } from '../../model/Interval/IntervalDto';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../../model/ToastMessage';
import { IntervalEndpoint } from '../../enum/endpoint/IntervalEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';



// Define Global Variable
let removeTarget: number;
const defaultDto = {
    uuid: "",
    locationId: 0,
    locationName: "",
    isActive: true,
    componentId: 0,
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
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);


    const [intervalDto, setIntervalDto] = useState<IntervalDto>(defaultDto);

    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    const createInterval = async (data: IntervalDto) => {
        if (!Helper.isDayEmpty(data.days)) {
            toggleToast("error","Day can't be empty")
        } else if (!Helper.isValidTimeRange(data.startTime, data.endTime)) {
            toggleToast("error","Start time must lower than end time")
        }
        else {
            const res = await HttpRequest.send(HttpMethod.POST, IntervalEndpoint.POST_ADD_INTERVAL, data)
            if (Helper.handleToastByResCode(res,ToastMessage.CREATE_INTERVAL,toggleToast)) {
                setCreateModal(false);
                setUpdateModal(false);
                toggleRefresh();
            } else {
                setCreateModal(false);
                setUpdateModal(false);
                toggleRefresh();
            }
        }


    }

    const updateInterval = async (data: IntervalDto) => {
        if (!Helper.isDayEmpty(data.days)) {
            toggleToast("error","Day can't be empty")
        } else if (!Helper.isValidTimeRange(data.startTime, data.endTime)) {
            toggleToast("error","Start time must lower than end time")
        }
        else {
            const res = await HttpRequest.send(HttpMethod.PUT, IntervalEndpoint.PUT_UPDATE_INTERVAL, data)
            if (Helper.handleToastByResCode(res,ToastMessage.UPDATE_INTERVAL,toggleToast)) {
                setCreateModal(false);
                setUpdateModal(false);
                toggleRefresh();
            } else {
                setCreateModal(false);
                setUpdateModal(false);
                toggleRefresh();
            }
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
                setIntervalDto({ ...defaultDto, days: defaultDto.days })
                setCreateModal(false);
                setUpdateModal(false);
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: IntervalDto) => {
        intervalDto.days = data.days
        setIntervalDto(data);
        setUpdateModal(true);
    }


    const handleRemove = (data: IntervalDto) => {
        removeTarget = data.componentId;
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
    const [intervalsDto, setIntervalsDto] = useState<IntervalDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, IntervalEndpoint.GET_INTERVAL)
        console.log(res);
        if (res) {
            setIntervalsDto(res.data.data);
        }

    };
    const removeInterval = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, IntervalEndpoint.DELETE_INTERVAL + removeTarget)
            if (Helper.handleToastByResCode(res,ToastMessage.REMOVE_INTERVAL,toggleToast)) {
                setCreateModal(false);
                setUpdateModal(false);
                toggleRefresh();
            } else {
                setCreateModal(false);
                setUpdateModal(false);
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
                    prev.filter((item) => item.componentId !== data.componentId)
                );
            }
        }
    }



    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Interval' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Interval" />
            {createModal || updateModal ?

                <AddIntervalForm isUpdate={updateModal} data={intervalDto} handleClickWithEvent={handleClickWithEvent} handleChange={handleChange} />
                :
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
                            <IntervalTable data={intervalsDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} />

                        </div>
                    </div>

                </div>
            }


        </>
    )
}

export default Interval


