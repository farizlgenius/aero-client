import React, { useEffect, useState } from 'react'
import {  CalenderIcon } from '../../icons';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import RemoveModal from '../UiElements/RemoveModal';
import HttpRequest from '../../utility/HttpRequest';
import HolidayForm from './HolidayForm';
import Helper from '../../utility/Helper';
import { HolidayDto } from '../../model/Holiday/HolidayDto';
import { useToast } from '../../context/ToastContext';
import { CreateHolidayDto } from '../../model/Holiday/CreateHolidayDto';
import { ToastMessage } from '../../model/ToastMessage';
import { HolidayEndpoint } from '../../endpoint/HolidayEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';
import { send } from '../../api/api';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { BaseTable } from '../UiElements/BaseTable';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';

// Define Global Variable
let removeTarget: number;
// Holiday Page 
export const Hol_TABLE_HEAD: string[] = ["Day", "Month", "Year", "Action"]
export const Hol_KEY: string[] = ["day", "month", "year"];

const Holiday = () => {
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const defaultDto: HolidayDto = {
        uuid: "",
        locationId: locationId,
        isActive: true,
        componentId: -1,
        year: 0,
        month: 0,
        day: 0,
        extend: 0,
        typeMask: 0
    }
    const [holidatDto, setHolidayDto] = useState<HolidayDto>(defaultDto)
    {/* Modal */ }
    const [remove, setRemove] = useState(false);
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true);
                break;
            case "create":
                createHoliday(holidatDto)
                break;
            case "update":
                updateHoliday(holidatDto);
                break;
            case "close":
                setCreate(false);
                setUpdate(false);
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: HolidayDto) => {
        setHolidayDto(data)
        setUpdate(true);
    }

    const handleRemove = (data: HolidayDto) => {
        console.log(data);
        removeTarget = data.componentId;
        setRemove(true);
    }
    const handleOnClickCloseRemove = () => {
        setRemove(false);
    }
    const handleOnClickConfirmRemove = () => {
        setRemove(false);
        removeHoliday();
    }

    const createHoliday = async (data: CreateHolidayDto) => {
        const res = await send.post(HolidayEndpoint.POST_HOL, data);
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_HOL, toggleToast)) setCreate(false);
        toggleRefresh();
    }

    const updateHoliday = async (data: HolidayDto) => {
        const res = await send.put(HolidayEndpoint.POST_HOL, data);
        if (Helper.handleToastByResCode(res, ToastMessage.UPDATE_HOL, toggleToast)) setUpdate(false);
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
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_HOL, toggleToast))
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
    const content: FormContent[] = [
        {
            label: "Holiday",
            icon: <CalenderIcon />,
            content: <HolidayForm isUpdate={update} setHolidayDto={setHolidayDto} handleClickWithEvent={handleClick} data={holidatDto} />
        }
    ]
    return (
        <>
            {remove && <RemoveModal header='Remove Holiday' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Holiday" />
            {create || update ?
                <BaseForm tabContent={content} />
                :
                <BaseTable headers={Hol_TABLE_HEAD} keys={Hol_KEY} data={holidaysDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} handleClick={handleClick} permission={filterPermission(FeatureId.TIME)} />


            }

        </>
    )
}

export default Holiday


