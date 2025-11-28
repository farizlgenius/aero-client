import React, {  useEffect, useState } from 'react'
import { AddIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import HttpRequest from '../../utility/HttpRequest';
import TimeZoneForm from './TimeZoneForm';
import Helper from '../../utility/Helper';
import { TimeZoneDto } from '../../model/TimeZone/TimeZoneDto';
import { TimeZoneTable } from './TimeZoneTable';
import { useToast } from '../../context/ToastContext';
import { CreateTimeZoneDto } from '../../model/TimeZone/CreateTimeZone';
import { ToastMessage } from '../../model/ToastMessage';
import { TimeZoneEndPoint } from '../../endpoint/TimezoneEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';

// Define Global Variable
let removeTarget: Number;


const defaultDto: TimeZoneDto = {
    uuid:"",
    locationId:1,
    locationName:"Main Location",
    componentId:-1,
    isActive:true,
    name: "",
    mode: -1,
    activeTime: "",
    deactiveTime: "",
    intervals: []
}


const TimeZone = () => {
    const {toggleToast} = useToast();
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

    const createTimeZone = async (data: CreateTimeZoneDto) => {
        const res = await HttpRequest.send(HttpMethod.POST, TimeZoneEndPoint.POST_ADD_TZ, data)
        if(Helper.handleToastByResCode(res,ToastMessage.CREATE_TZ,toggleToast)){
            setUpdateModal(false);
            setCreateModal(false);
            toggleRefresh();
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data:TimeZoneDto) => {
        console.log(data)
        setTimeZoneDto(data)
        setUpdateModal(true)
    }

    const handleRemove = (data:TimeZoneDto) => {
        console.log(data);
        removeTarget = data.componentId;
        setRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeTimeZone();

    }

    {/* Group Data */ }
    const [timeZonesDto, setTimeZonesDto] = useState<TimeZoneDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, TimeZoneEndPoint.GET_TZ_LIST)
        if (res) {
            setTimeZonesDto(res.data.data);
            console.log(res.data.data)
        }
    };

    const removeTimeZone = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, TimeZoneEndPoint.DELETE_TZ  + removeTarget);
        console.log(res)
        if (Helper.handleToastByResCode(res,ToastMessage.DELETE_TZ,toggleToast)){
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
                    prev.filter((item) => item.componentId !== data.componentId)
                );
            }
        }
    }
    return (
        <>
            {removeModal && <DangerModal header='Remove Time Zone' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Time Zone" />
            {createModal || updateModal ?
            <TimeZoneForm handleClick={handleClick} data={timeZoneDto}  setTimeZoneDto={setTimeZoneDto} />
            : 
                        <div className="space-y-6">
                <div className="flex gap-4">
                    <Button
                        name='add'
                        size="sm"
                        variant="primary"
                        startIcon={<AddIcon className="size-5" />}
                        onClickWithEvent={handleClick}
                    >
                        Create
                    </Button>

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <TimeZoneTable data={timeZonesDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove}/>
                    </div>
                </div>

            </div>
            }


        </>
    )
}

export default TimeZone