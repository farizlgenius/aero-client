import React, { useEffect, useState } from 'react'
import { AddIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import HttpRequest from '../../utility/HttpRequest';
import HolidayForm from './HolidayForm';
import Helper from '../../utility/Helper';
import { HolidayDto } from '../../model/Holiday/HolidayDto';
import { HolidayTable } from './HolidayTable';
import { useToast } from '../../context/ToastContext';
import { CreateHolidayDto } from '../../model/Holiday/CreateHolidayDto';
import { ToastMessage } from '../../model/ToastMessage';
import { HolidayEndpoint } from '../../enum/endpoint/HolidayEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';

// Define Global Variable
let removeTarget: number;
const defaultDto: HolidayDto = {
    uuid:"",
    locationId:1,
    locationName:"Main Location",
    isActive:true,
    componentId: -1,
    year: 0,
    month: 0,
    day: 0,
    extend:0,
    typeMask: 0
}

const Holiday = () => {
    const { toggleToast } = useToast();
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
    const handleEdit = (data:HolidayDto) => {
        setHolidayDto(data)
        setUpdateModal(true);
    }

    const handleRemove = (data: HolidayDto) => {
        console.log(data);
        removeTarget = data.componentId;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        setIsRemoveModal(false);
        removeHoliday();
    }

    const createHoliday = async (data: CreateHolidayDto) => {
        const res = await HttpRequest.send(HttpMethod.POST, HolidayEndpoint.POST_HOL, data)
        if(Helper.handleToastByResCode(res,ToastMessage.CREATE_HOL,toggleToast)) setCreateModal(false);
        toggleRefresh();
    }

    const updateHoliday = async (data:HolidayDto) => {
        const res = await HttpRequest.send(HttpMethod.PUT,HolidayEndpoint.PUT_HOL,data)
         if(Helper.handleToastByResCode(res,ToastMessage.UPDATE_HOL,toggleToast)) setUpdateModal(false);
        toggleRefresh();
    }

    {/* Group Data */ }
    const [holidaysDto, setHolidaysDto] = useState<HolidayDto[]>([]);
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, HolidayEndpoint.GET_HOL_LIST)
        if (res) {
            console.log(res.data.data)
            setHolidaysDto(res.data.data);
        }
    };

    const removeHoliday = async () => {
        const res = await HttpRequest.send(HttpMethod.DELETE, HolidayEndpoint.DELETE_HOL + removeTarget)
        if(Helper.handleToastByResCode(res,ToastMessage.DELETE_HOL,toggleToast))
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
                    prev.filter((item) => item.componentId !== data.componentId)
                );
            }
        }
    }
    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Holiday' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Holiday" />
            {createModal || updateModal ?
             
             <HolidayForm isUpdate={updateModal} setHolidayDto={setHolidayDto} handleClickWithEvent={handleClick} data={holidatDto} />
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
                        Add
                    </Button>

                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">

                        <HolidayTable selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} data={holidaysDto}/>

                    </div>
                </div>

            </div>
             
             }

        </>
    )
}

export default Holiday


