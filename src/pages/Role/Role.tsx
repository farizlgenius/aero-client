import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { useToast } from "../../context/ToastContext";
import { RoleDto } from "../../model/Role/RoleDto";
import HttpRequest from "../../utility/HttpRequest";
import { HttpMethod } from "../../enum/HttpMethod";
import { ToastMessage } from "../../model/ToastMessage";
import { FormContent } from "../../model/Form/FormContent";
import DangerModal from "../UiElements/DangerModal";
import Button from "../../components/ui/button/Button";
import { BaseForm } from "../UiElements/BaseForm";
import { AddIcon, RoleIcon } from "../../icons";
import { BaseTable } from "../UiElements/BaseTable";
import { RoleEndpoint } from "../../enum/endpoint/RoleEndpoint";
import Helper from "../../utility/Helper";
import { RoleForm } from "../../components/form/role/RoleForm";


var removeTarget: number = 0;

const defaultDto: RoleDto = {
    componentId: 0,
    name: "",
    features: []
}

export const LOCATION_HEADER: string[] = ["Name", "Action"]
export const LOCATION_KEY: string[] = ["locationName"];


export const Role = () => {
    const { toggleToast } = useToast();
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [remove, setRemove] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [locationDto, setLocationDto] = useState<RoleDto>(defaultDto);
    const [locationsDto, setLocationsDto] = useState<RoleDto[]>([]);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: RoleDto) => {
        removeTarget = data.componentId;
        setRemove(true);
    }
    const handleOnClickCloseRemove = () => {
        setRemove(false);
    }
    const handleOnClickConfirmRemove = () => {
        setRemove(false);
        removeLocation(removeTarget);
    }

    {/* handle Table Action */ }
    const handleEdit = (data: RoleDto) => {
        setLocationDto(data);
        setUpdate(true);
    }


    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true);
                break;
            case "create":
                createLocation(locationDto);
                break;
            case "update":
                updateLocation(locationDto)
                break;
            case "close":
            case "cancel":
                setLocationDto(defaultDto)
                setCreate(false);
                setUpdate(false);
                break;
            default:
                break;
        }
    }

    const createLocation = async (dto: RoleDto) => {
        const res = await HttpRequest.send(HttpMethod.POST, RoleEndpoint.CREATE_ROLE, dto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }

    const updateLocation = async (dto: RoleDto) => {
        const res = await HttpRequest.send(HttpMethod.PUT, RoleEndpoint.UPDATE_ROLE, dto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }

    const removeLocation = async (id: number) => {
        const res = await HttpRequest.send(HttpMethod.DELETE, RoleEndpoint.DELETE_ROLE + id)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_LOCATION, toggleToast)) {
            setRemove(false)
            toggleRefresh();
        }
    }

    const [selectedObjects, setSelectedObjects] = useState<RoleDto[]>([]);
    const handleCheckedAll = (data: RoleDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: RoleDto, e: React.ChangeEvent<HTMLInputElement>) => {
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

    const fetchDate = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, RoleEndpoint.GET_ROLE)
        console.log(res?.data.data)
        if (res && res.data.data) {
            setLocationsDto(res.data.data);
        }
    }


    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <RoleIcon />,
            label: "Role",
            content: <RoleForm dto={locationDto} setDto={setLocationDto} handleClickWithEvent={handleClickWithEvent} />
        }
    ];



    useEffect(() => {
        fetchDate();
    }, [refresh])


    return (

        <>
            <PageBreadcrumb pageTitle="Roles" />
            {remove && <DangerModal header='Remove Role' body='Please Click Confirm if you want to remove role' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {create || update ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button
                            name='add'
                            size="sm"
                            variant="primary"
                            startIcon={<AddIcon className="size-5" />}
                            onClickWithEvent={handleClickWithEvent}
                        >
                            Add
                        </Button>

                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <BaseTable<RoleDto> headers={LOCATION_HEADER} keys={LOCATION_KEY} data={locationsDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} />

                        </div>
                    </div>
                </div>

            }
        </>)
}   