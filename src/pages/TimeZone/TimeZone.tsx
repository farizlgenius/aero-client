import React, { useEffect, useState } from 'react'
import { AddIcon, TimezonIcon } from '../../icons';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import HttpRequest from '../../utility/HttpRequest';
import TimeZoneForm from './TimeZoneForm';
import Helper from '../../utility/Helper';
import { TimeZoneDto } from '../../model/TimeZone/TimeZoneDto';
import { useToast } from '../../context/ToastContext';
import { CreateTimeZoneDto } from '../../model/TimeZone/CreateTimeZone';
import { ToastMessage } from '../../model/ToastMessage';
import { TimeZoneEndPoint } from '../../endpoint/TimezoneEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { send } from '../../api/api';
import { BaseTable } from '../UiElements/BaseTable';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';

// Define Global Variable
let removeTarget: Number;


const TIMEZONE_TABLE_HEAD: string[] = ["Name", "Active Date", "Deactive Date", "Action"]
const TIMEZONE_KEY: string[] = ["name", "activeTime", "deactiveTime"];

const TimeZone = () => {
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [removeModal, setRemoveModal] = useState<boolean>(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);
    {/* Data */ }
    const defaultDto: TimeZoneDto = {
        uuid: "",
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
        const res = await send.post(TimeZoneEndPoint.POST_ADD_TZ, data)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_TZ, toggleToast)) {
            setUpdateModal(false);
            setCreateModal(false);
            toggleRefresh();
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: TimeZoneDto) => {
        console.log(data)
        setTimeZoneDto(data)
        setUpdateModal(true)
    }

    const handleRemove = (data: TimeZoneDto) => {
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
        const res = await HttpRequest.send(HttpMethod.DELETE, TimeZoneEndPoint.DELETE_TZ + removeTarget);
        console.log(res)
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_TZ, toggleToast)) {
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
    const tabContent: FormContent[] = [
        {
            label: "Time Zone",
            icon: <TimezonIcon />,
            content: <TimeZoneForm handleClick={handleClick} data={timeZoneDto} setTimeZoneDto={setTimeZoneDto} />
        }
    ]
    return (
        <>
            {removeModal && <DangerModal header='Remove Time Zone' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Time Zone" />
            {createModal || updateModal ?
                <BaseForm tabContent={tabContent} />

                :
                <BaseTable<TimeZoneDto> keys={TIMEZONE_KEY} headers={TIMEZONE_TABLE_HEAD} data={timeZonesDto} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleRemove={handleRemove} handleEdit={handleEdit} handleClick={handleClick} selectedObject={selectedObjects} permission={filterPermission(FeatureId.TIME)} />

            }


        </>
    )
}

export default TimeZone