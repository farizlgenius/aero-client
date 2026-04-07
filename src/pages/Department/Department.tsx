import { useState } from "react"
import { BaseForm } from "../UiElements/BaseForm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { FormContent } from "../../model/Form/FormContent";
import { LocationIcon } from "../../icons";
import { useToast } from "../../context/ToastContext";
import Helper from "../../utility/Helper";
import { DepartmentToast } from "../../model/ToastMessage";
import { BaseTable } from "../UiElements/BaseTable";
import api, { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { usePopup } from "../../context/PopupContext";
import { FeatureId } from "../../enum/FeatureId";
import { FormType } from "../../model/Form/FormProp";
import { usePagination } from "../../context/PaginationContext";
import { useLocation } from "../../context/LocationContext";
import { DepartmentDto } from "../../model/Department/DepartmentDto";
import { DepartmentEndpoint } from "../../endpoint/DepartmentEndpoint";
import { DepartmentForm } from "./DepartmentForm";

var removeTarget: number = 0;


export const HEADER: string[] = ["Name", "Action"]
export const KEY: string[] = ["name"];

export const Department = () => {
    const { locationId } = useLocation();
    const defaultDto: DepartmentDto = {
    id: 0,
    name: "",
    description: "",
    isActive: true,
    locationId: locationId
}

    const { toggleToast } = useToast();
    const { setPagination } = usePagination();
    const { filterPermission } = useAuth();
    const { setRemove, setConfirmRemove, setConfirmCreate, setInfo, setMessage, setCreate, setUpdate, setConfirmUpdate } = usePopup();
    const [form, setForm] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const toggleRefresh = () => setRefresh(!refresh)
    const [departmentDto, setDepartmentDto] = useState<DepartmentDto>(defaultDto);
    const [departmentsDto, setDepartmentsDto] = useState<DepartmentDto[]>([]);
    const [select, setSelect] = useState<DepartmentDto[]>([])
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);

    const handleRemove = (data: DepartmentDto) => {
        removeTarget = data.id;
        setRemove(true);
        setConfirmRemove(() => async () => {
            const res = await api.delete(DepartmentEndpoint.DELETE(removeTarget));
            if (Helper.handleToastByResCode(res, DepartmentToast.DELETE, toggleToast)) {
                toggleRefresh();
                removeTarget = 0;
            }
        })
    }

    const handleInfo = (data: DepartmentDto) => {
        setFormType(FormType.INFO);
        setDepartmentDto(data);
        setForm(true);
    }

    const handleEdit = (data: DepartmentDto) => {
        setFormType(FormType.UPDATE);
        setDepartmentDto(data);
        setForm(true);
    }

    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE);
                setForm(true);
                break;
            case "delete":
                if (select.length == 0) {
                    setMessage("Please select object")
                    setInfo(true);
                } else {
                    setConfirmRemove(() => async () => {
                        var data: number[] = [];
                        select.map(async (a: DepartmentDto) => {
                            data.push(a.id)
                        })
                        var res = await send.post(DepartmentEndpoint.DELETE_RANGE, data)
                        if (Helper.handleToastByResCode(res, DepartmentToast.DELETE_RANGE, toggleToast)) {
                            setRemove(false);
                            toggleRefresh();
                        }
                    })
                    setRemove(true);
                }
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(DepartmentEndpoint.CREATE, departmentDto);
                    if (Helper.handleToastByResCode(res, DepartmentToast.CREATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                        setDepartmentDto(defaultDto)
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await api.put(DepartmentEndpoint.UPDATE, departmentDto);
                    if (Helper.handleToastByResCode(res, DepartmentToast.UPDATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                    }
                })
                setUpdate(true);
                break;
            case "close":
            case "cancel":
                setDepartmentDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }

    const fetchData = async (pageNumber: number, pageSize: number, locationId?: number, search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(DepartmentEndpoint.PAGINATION(pageNumber, pageSize, locationId, search, startDate, endDate));
        if (res && res.data.data) {
            setDepartmentsDto(res.data.data.data);
            setPagination(res.data.data.page);
        }
    }

    const tabContent: FormContent[] = [
        {
            icon: <LocationIcon />,
            label: "Intevals",
            content: <DepartmentForm type={formType} dto={departmentDto} setDto={setDepartmentDto} handleClick={handleClickWithEvent} />
        }
    ];

    return (
        <>
            <PageBreadcrumb pageTitle="Departments" />
            {form ?
                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<DepartmentDto> headers={HEADER} keys={KEY} data={departmentsDto} select={select} setSelect={setSelect} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClickWithEvent} permission={filterPermission(FeatureId.LOCATION)} onInfo={handleInfo} fetchData={fetchData} refresh={refresh} locationId={locationId} />
                </div>
            }
        </>
    )
}
