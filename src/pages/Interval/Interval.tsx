import React, { useEffect, useState } from 'react'
import { AddIcon, CamIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import RemoveModal from '../UiElements/RemoveModal';
import HttpRequest from '../../utility/HttpRequest';
import Helper from '../../utility/Helper';
import { IntervalDto } from '../../model/Interval/IntervalDto';
import { useToast } from '../../context/ToastContext';
import { ToastMessage } from '../../model/ToastMessage';
import { IntervalEndpoint } from '../../endpoint/IntervalEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';
import { BaseTable } from '../UiElements/BaseTable';
import { TableCell } from '../../components/ui/table';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import { IntervalForm } from '../../components/form/interval/IntervalForm';
import Search from '../../components/ui/table/Search';
import { send } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';



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

export const INTERVAL_TABLE_HEAD: string[] = ["Start Time", "End Time", "Days", "Action"]
export const INTERVAL_KEY: string[] = ["startTime", "endTime", "days"];

const Interval = () => {
    const { toggleToast } = useToast();
    const {filterPermission} = useAuth();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);


    const [intervalDto, setIntervalDto] = useState<IntervalDto>(defaultDto);

    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    const createInterval = async (data: IntervalDto) => {
        if (!Helper.isDayEmpty(data.days)) {
            toggleToast("error", "Day can't be empty")
        } else if (!Helper.isValidTimeRange(data.startTime, data.endTime)) {
            toggleToast("error", "Start time must lower than end time")
        }
        else {
            const res = await send.post(IntervalEndpoint.POST_ADD_INTERVAL,data)
            if (Helper.handleToastByResCode(res, ToastMessage.CREATE_INTERVAL, toggleToast)) {
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
            toggleToast("error", "Day can't be empty")
        } else if (!Helper.isValidTimeRange(data.startTime, data.endTime)) {
            toggleToast("error", "Start time must lower than end time")
        }
        else {
            const res = await send.put(IntervalEndpoint.PUT_UPDATE_INTERVAL,data);
            if (Helper.handleToastByResCode(res, ToastMessage.UPDATE_INTERVAL, toggleToast)) {
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
            case "remove-confirm":
                setIsRemoveModal(false);
        removeInterval();
                break;
            case "remove-cancel":
                setIsRemoveModal(false);
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
        if (Helper.handleToastByResCode(res, ToastMessage.REMOVE_INTERVAL, toggleToast)) {
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

    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <CamIcon />,
            label: "Intevals",
            content: <IntervalForm dto={intervalDto} setDto={setIntervalDto} handleClick={handleClickWithEvent} />
        }
    ];



    return (
        <>
            {isRemoveModal && <RemoveModal header='Remove Interval' body='Please Click Confirm if you want to remove this Control Point'  handleClick={handleClickWithEvent} />}
            <PageBreadcrumb pageTitle="Interval" />
            {createModal || updateModal ?
                <>
                    <BaseForm tabContent={tabContent} />
                </>

                :
                <div className="space-y-6">
                        <BaseTable<IntervalDto> headers={INTERVAL_TABLE_HEAD} keys={INTERVAL_KEY} data={intervalsDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} onEdit={handleEdit} onRemove={handleRemove} specialDisplay={[
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


