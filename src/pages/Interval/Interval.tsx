import React, { useEffect, useState } from 'react'
import { AddIcon, CamIcon } from '../../icons';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Helper from '../../utility/Helper';
import { IntervalDto } from '../../model/Interval/IntervalDto';
import { useToast } from '../../context/ToastContext';
import { IntervalToast, ToastMessage } from '../../model/ToastMessage';
import { IntervalEndpoint } from '../../endpoint/IntervalEndpoint';
import { BaseTable } from '../UiElements/BaseTable';
import { TableCell } from '../../components/ui/table';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import { IntervalForm } from '../../components/form/interval/IntervalForm';
import { send } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';
import { FormType } from '../../model/Form/FormProp';
import { usePopup } from '../../context/PopupContext';
import { useLocation } from '../../context/LocationContext';



// Define Global Variable
let removeTarget: number;


export const INTERVAL_TABLE_HEAD: string[] = ["Start Time", "End Time", "Days", "Action"]
export const INTERVAL_KEY: string[] = ["startTime", "endTime", "days"];

const Interval = () => {

    const { toggleToast } = useToast();
    const { filterPermission } = useAuth();
    const { locationId } = useLocation();
    const { setCreate, setUpdate, setInfo, setRemove, setConfirmRemove, setConfirmCreate, setConfirmUpdate,setMessage } = usePopup();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);

    const defaultDto = {
        uuid: "",
        locationId: locationId,
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


    const [formType, setFormType] = useState<FormType>(FormType.Create);
    const [intervalDto, setIntervalDto] = useState<IntervalDto>(defaultDto);

    {/* Modal */ }
    const [form, setForm] = useState<boolean>(false);

    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.Create)
                setForm(true)
                break;
            case "delete":
                if(selectedObjects.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObjects.map(async (a:IntervalDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(IntervalEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,IntervalToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    if (!Helper.isDayEmpty(intervalDto.days)) {
                        toggleToast("error", "Day can't be empty")
                    } else if (!Helper.isValidTimeRange(intervalDto.startTime, intervalDto.endTime)) {
                        toggleToast("error", "Start time must lower than end time")
                    }
                    else {
                        const res = await send.post(IntervalEndpoint.CREATE, intervalDto)
                        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_INTERVAL, toggleToast)) {
                            setForm(false)
                            setIntervalDto(defaultDto)
                            toggleRefresh();
                        } 
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    if (!Helper.isDayEmpty(intervalDto.days)) {
                        toggleToast("error", "Day can't be empty")
                    } else if (!Helper.isValidTimeRange(intervalDto.startTime, intervalDto.endTime)) {
                        toggleToast("error", "Start time must lower than end time")
                    }
                    else {
                        const res = await send.put(IntervalEndpoint.UPDATE, intervalDto);
                        if (Helper.handleToastByResCode(res, ToastMessage.UPDATE_INTERVAL, toggleToast)) {
                            setForm(false)
                            toggleRefresh();
                        } else {
                            setForm(false)
                            toggleRefresh();
                        }
                    }
                })
                setUpdate(true);
                break;
            case "close":
            case "cancel":
                setIntervalDto({ ...defaultDto, days: defaultDto.days })
                setForm(false)
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: IntervalDto) => {
        intervalDto.days = data.days
        setIntervalDto(data);
        setFormType(FormType.Update);
        setForm(true)
    }


    const handleRemove = (data: IntervalDto) => {
        removeTarget = data.componentId;
        setConfirmRemove(() => async () => {
            const res = await send.delete(IntervalEndpoint.DELETE(data.componentId))
            if (Helper.handleToastByResCode(res, IntervalToast.DELETE, toggleToast)) {
                toggleRefresh();
            }
        })
        setRemove(true);
    }

    const handleInfo = (data: IntervalDto) => {
        setIntervalDto(data);
        intervalDto.days = data.days
        setFormType(FormType.Info);
        setForm(true);
    }

    {/* Group Data */ }
    const [intervalsDto, setIntervalsDto] = useState<IntervalDto[]>([]);
    const fetchData = async () => {
        const res = await send.get(IntervalEndpoint.LOCATION(locationId));
        console.log(res);
        if (res) {
            setIntervalsDto(res.data.data);
        }

    };

    {/* State */ }
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log(e.target.name)
    //     console.log(e.target.value);
    //     switch (e.target.name) {
    //         case "startTime":
    //         case "endTime":
    //             setIntervalDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    //             break;
    //         default:
    //             setIntervalDto((prev) => ({ ...prev, days: { ...prev.days, [e.target.name]: e.target.checked } }))
    //             break;
    //     }
    // }

    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<IntervalDto[]>([]);


    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <CamIcon />,
            label: "Intevals",
            content: <IntervalForm dto={intervalDto} setDto={setIntervalDto} handleClick={handleClickWithEvent} type={formType} />
        }
    ];



    return (
        <>
            <PageBreadcrumb pageTitle="Interval" />
            {form ?
                <>
                    <BaseForm tabContent={tabContent} />
                </>

                :
                <div className="space-y-6">
                    <BaseTable<IntervalDto> headers={INTERVAL_TABLE_HEAD} keys={INTERVAL_KEY} data={intervalsDto} select={selectedObjects} setSelect={setSelectedObjects} onInfo={handleInfo} onEdit={handleEdit} onRemove={handleRemove} specialDisplay={[
                        {
                            key: "days",
                            content: (d, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                <div className="flex gap-5">
                                    <p className={d.days.sunday ? "text-green-500" : "text-gray-700"}>
                                        Sun
                                    </p>
                                    <p className={d.days.monday ? "text-green-500" : "text-gray-700"}>
                                        Mon
                                    </p>
                                    <p className={d.days.tuesday ? "text-green-500" : "text-gray-700"}>
                                        Tue
                                    </p>
                                    <p className={d.days.wednesday ? "text-green-500" : "text-gray-700"}>
                                        Wed
                                    </p>
                                    <p className={d.days.thursday ? "text-green-500" : "text-gray-700"}>
                                        Thu
                                    </p>
                                    <p className={d.days.friday ? "text-green-500" : "text-gray-700"}>
                                        Fri
                                    </p>
                                    <p className={d.days.saturday ? "text-green-500" : "text-gray-700"}>
                                        Sat
                                    </p>
                                </div>
                            </TableCell>
                        }
                    ]} onClick={handleClickWithEvent} permission={filterPermission(FeatureId.TIME)} />
                </div>
            }


        </>
    )
}

export default Interval


