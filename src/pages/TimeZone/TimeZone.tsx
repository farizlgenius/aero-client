import React, { useEffect, useState } from 'react'
import { AddIcon, TimezonIcon } from '../../icons';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import TimeZoneForm from './TimeZoneForm';
import Helper from '../../utility/Helper';
import { TimeZoneDto } from '../../model/TimeZone/TimeZoneDto';
import { useToast } from '../../context/ToastContext';
import { TimeZoneToast } from '../../model/ToastMessage';
import { TimeZoneEndPoint } from '../../endpoint/TimezoneEndpoint';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { send } from '../../api/api';
import { BaseTable } from '../UiElements/BaseTable';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import { usePopup } from '../../context/PopupContext';
import { FormType } from '../../model/Form/FormProp';



const TIMEZONE_TABLE_HEAD: string[] = ["Name", "Active Date", "Deactive Date","Mode","Interval", "Action"]
const TIMEZONE_KEY: string[] = ["name", "activeTime", "deactiveTime","mode","intervals"];

const TimeZone = () => {
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);
    const { setConfirmRemove,setConfirmCreate,setConfirmUpdate,setUpdate,setRemove,setCreate,setMessage,setInfo } = usePopup();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [form,setForm] = useState<boolean>(false);
    {/* Data */ }
    const defaultDto: TimeZoneDto = {
        locationId: locationId,
        componentId: -1,
        isActive: true,
        name: "",
        mode: -1,
        activeTime: "",
        deactiveTime: "",
        intervals: []
    }

    const [timeZoneDto, setTimeZoneDto] = useState<TimeZoneDto>(defaultDto);


    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget)
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
                    selectedObjects.map(async (a:TimeZoneDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(TimeZoneEndPoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,TimeZoneToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(TimeZoneEndPoint.CREATE, timeZoneDto)
                    if (Helper.handleToastByResCode(res, TimeZoneToast.CREATE, toggleToast)) {
                        setForm(false);
                        toggleRefresh();
                        setTimeZoneDto(defaultDto)
                    }
                })
                setCreate(true);
                break;
            case "close":
                setForm(false);
                setTimeZoneDto(defaultDto)
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(TimeZoneEndPoint.UPDATE, timeZoneDto)
                    if (Helper.handleToastByResCode(res, TimeZoneToast.UPDATE, toggleToast)) {
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setUpdate(true)
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: TimeZoneDto) => {
        setFormType(FormType.UPDATE)
        setTimeZoneDto(data)
        setForm(true)
    }

    const handleRemove = async (data: TimeZoneDto) => {
        
        setConfirmRemove(() => async () => {
            const res = await send.delete(TimeZoneEndPoint.DELETE(data.componentId));
            console.log(res)
            if (Helper.handleToastByResCode(res, TimeZoneToast.DELETE, toggleToast)) {
                toggleRefresh();
            }
        })
        setRemove(true);
    }

    const handleInfo = (data:TimeZoneDto) => {
        setFormType(FormType.INFO)
        setTimeZoneDto(data)
        setForm(true);
    }



    {/* Group Data */ }
    const [timeZonesDto, setTimeZonesDto] = useState<TimeZoneDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(TimeZoneEndPoint.LOCATION(locationId))
        if (res) {
            setTimeZonesDto(res.data.data);
            console.log(res.data.data)
        }
    };


    {/* UseEffect */ }
    useEffect(() => {
        fetchData();
    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<TimeZoneDto[]>([]);
   
    const tabContent: FormContent[] = [
        {
            label: "Time Zone",
            icon: <TimezonIcon />,
            content: <TimeZoneForm handleClick={handleClick} dto={timeZoneDto} setDto={setTimeZoneDto} type={formType}  />
        }
    ]
    return (
        <>
            <PageBreadcrumb pageTitle="Time Zone" />
            {form ?
                <BaseForm tabContent={tabContent} />

                :
                <BaseTable<TimeZoneDto> keys={TIMEZONE_KEY} headers={TIMEZONE_TABLE_HEAD} data={timeZonesDto} onRemove={handleRemove} onEdit={handleEdit} onInfo={handleInfo} onClick={handleClick} select={selectedObjects} setSelect={setSelectedObjects}  permission={filterPermission(FeatureId.TIME)} />

            }


        </>
    )
}

export default TimeZone