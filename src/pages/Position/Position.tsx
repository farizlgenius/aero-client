import { useState } from "react"
import { BaseForm } from "../UiElements/BaseForm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { FormContent } from "../../model/Form/FormContent";
import { LocationIcon } from "../../icons";
import { useToast } from "../../context/ToastContext";
import Helper from "../../utility/Helper";
import { PositionToast } from "../../model/ToastMessage";
import { BaseTable } from "../UiElements/BaseTable";
import api, { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { usePopup } from "../../context/PopupContext";
import { FeatureId } from "../../enum/FeatureId";
import { FormType } from "../../model/Form/FormProp";
import { usePagination } from "../../context/PaginationContext";
import { useLocation } from "../../context/LocationContext";
import { PositionDto } from "../../model/Position/PositionDto";
import { PositionEndpoint } from "../../endpoint/PositionEndpoint";
import { PositionForm } from "./PositionForm";

var removeTarget: number = 0;



export const HEADER: string[] = ["Name", "Action"]
export const KEY: string[] = ["name"];

export const Position = () => {
    const { locationId } = useLocation();
    const defaultDto: PositionDto = {
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
    const [positionDto, setPositionDto] = useState<PositionDto>(defaultDto);
    const [positionsDto, setPositionsDto] = useState<PositionDto[]>([]);
    const [select, setSelect] = useState<PositionDto[]>([])
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);

    const handleRemove = (data: PositionDto) => {
        removeTarget = data.id;
        setRemove(true);
        setConfirmRemove(() => async () => {
            const res = await api.delete(PositionEndpoint.DELETE(removeTarget));
            if (Helper.handleToastByResCode(res, PositionToast.DELETE, toggleToast)) {
                toggleRefresh();
                removeTarget = 0;
            }
        })
    }

    const handleInfo = (data: PositionDto) => {
        setFormType(FormType.INFO);
        setPositionDto(data);
        setForm(true);
    }

    const handleEdit = (data: PositionDto) => {
        setFormType(FormType.UPDATE);
        setPositionDto(data);
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
                        select.map(async (a: PositionDto) => {
                            data.push(a.id)
                        })
                        var res = await send.post(PositionEndpoint.DELETE_RANGE, data)
                        if (Helper.handleToastByResCode(res, PositionToast.DELETE_RANGE, toggleToast)) {
                            setRemove(false);
                            toggleRefresh();
                        }
                    })
                    setRemove(true);
                }
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(PositionEndpoint.CREATE, positionDto);
                    if (Helper.handleToastByResCode(res, PositionToast.CREATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                        setPositionDto(defaultDto)
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await api.put(PositionEndpoint.UPDATE, positionDto);
                    if (Helper.handleToastByResCode(res, PositionToast.UPDATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                    }
                })
                setUpdate(true);
                break;
            case "close":
            case "cancel":
                setPositionDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }

    const fetchData = async (pageNumber: number, pageSize: number, locationId?: number, search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(PositionEndpoint.PAGINATION(pageNumber, pageSize, locationId, search, startDate, endDate));
        if (res && res.data.data) {
            setPositionsDto(res.data.data.data);
            setPagination(res.data.data.page);
        }
    }

    const tabContent: FormContent[] = [
        {
            icon: <LocationIcon />,
            label: "Intevals",
            content: <PositionForm type={formType} dto={positionDto} setDto={setPositionDto} handleClick={handleClickWithEvent} />
        }
    ];

    return (
        <>
            <PageBreadcrumb pageTitle="Positions" />
            {form ?
                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<PositionDto> headers={HEADER} keys={KEY} data={positionsDto} select={select} setSelect={setSelect} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClickWithEvent} permission={filterPermission(FeatureId.LOCATION)} onInfo={handleInfo} fetchData={fetchData} refresh={refresh} locationId={locationId}  />
                </div>
            }
        </>
    )
}
