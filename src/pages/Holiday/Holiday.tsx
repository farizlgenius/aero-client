import React, { useEffect, useState } from 'react'
import {  CalenderIcon } from '../../icons';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import HolidayForm from './HolidayForm';
import Helper from '../../utility/Helper';
import { HolidayDto } from '../../model/Holiday/HolidayDto';
import { useToast } from '../../context/ToastContext';
import { HolidayToast, ToastMessage } from '../../model/ToastMessage';
import { HolidayEndpoint } from '../../endpoint/HolidayEndpoint';
import { send } from '../../api/api';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { BaseTable } from '../UiElements/BaseTable';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import { FormType } from '../../model/Form/FormProp';
import { usePopup } from '../../context/PopupContext';

// Holiday Page 
export const HEADER: string[] = ["Day", "Month", "Year", "Action"]
export const KEY: string[] = ["day", "month", "year"];

const Holiday = () => {
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const {setCreate,setUpdate,setRemove,setConfirmCreate,setConfirmRemove,setConfirmUpdate,setInfo,setMessage} = usePopup();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);
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
    const [form,setForm] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE)
                setForm(true);
                break;
            case "delete":
                if(selectedObjects.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObjects.map(async (a:HolidayDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(HolidayEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,HolidayToast.DELETE_RANGE,toggleToast)){
                        setSelectedObjects([])                  
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async() => {
                    const res = await send.post(HolidayEndpoint.CREATE,holidatDto);
                    if(Helper.handleToastByResCode(res,HolidayToast.CREATE,toggleToast)){
                        setHolidayDto(defaultDto);
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(HolidayEndpoint.CREATE, holidatDto);
                    if (Helper.handleToastByResCode(res,HolidayToast.UPDATE, toggleToast)) {
                        setHolidayDto(defaultDto)
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setUpdate(true)
                break;
            case "close":
                setForm(false);
                setHolidayDto(defaultDto)
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: HolidayDto) => {
        setFormType(FormType.UPDATE)
        setHolidayDto(data)
        setForm(true);
    }

    const handleRemove = (data: HolidayDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(HolidayEndpoint.DELETE(data.componentId))
            if (Helper.handleToastByResCode(res, ToastMessage.DELETE_HOL, toggleToast))
                toggleRefresh();
        })
        setRemove(true);
    }

    const handleInfo = (data:HolidayDto) => {
        setFormType(FormType.INFO);
        setHolidayDto(data)
        setForm(true);
    }



    {/* Group Data */ }
    const [holidaysDto, setHolidaysDto] = useState<HolidayDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(HolidayEndpoint.GET(locationId));
        if (res && res.data.data) {
            console.log(res.data.data)
            setHolidaysDto(res.data.data);
        }
    };

    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<HolidayDto[]>([]);
   
    const content: FormContent[] = [
        {
            label: "Holiday",
            icon: <CalenderIcon />,
            content: <HolidayForm type={formType} setDto={setHolidayDto} handleClick={handleClick} dto={holidatDto} />
        }
    ]
    return (
        <>
            <PageBreadcrumb pageTitle="Holiday" />
            {form ?
                <BaseForm tabContent={content} />
                :
                <BaseTable<HolidayDto> headers={HEADER} keys={KEY} data={holidaysDto} select={selectedObjects} setSelect={setSelectedObjects} onInfo={handleInfo} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClick} permission={filterPermission(FeatureId.TIME)} />


            }

        </>
    )
}

export default Holiday


