import { useState } from "react"
import { BaseForm } from "../UiElements/BaseForm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { LocationDto } from "../../model/Location/LocationDto";
import { FormContent } from "../../model/Form/FormContent";
import { LocationIcon } from "../../icons";
import { useToast } from "../../context/ToastContext";
import Helper from "../../utility/Helper";
import { CompanyToast } from "../../model/ToastMessage";
import { BaseTable } from "../UiElements/BaseTable";
import api, { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { usePopup } from "../../context/PopupContext";
import { FeatureId } from "../../enum/FeatureId";
import { FormType } from "../../model/Form/FormProp";
import { usePagination } from "../../context/PaginationContext";
import { useLocation } from "../../context/LocationContext";
import { CompanyDto } from "../../model/Company/CompanyDto";
import { CompanyEndpoint } from "../../endpoint/CompanyEndpoint";
import { CompanyForm } from "./CompanyForm";

var removeTarget: number = 0;


export const HEADER: string[] = ["Name", "Action"]
export const KEY: string[] = ["name"];

export const Company = () => {
    const { locationId } = useLocation();
    const { toggleToast } = useToast();
    const { setPagination } = usePagination();
    const { filterPermission } = useAuth();
    const { setRemove, setConfirmRemove, setConfirmCreate, setInfo, setMessage, setCreate, setUpdate, setConfirmUpdate } = usePopup();
    const [form, setForm] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const toggleRefresh = () => setRefresh(!refresh)
    const defaultDto: CompanyDto = {
        id: 0,
        name: "",
        description: "",
        isActive: true,
        locationId: locationId
    }

    const [dto, setDto] = useState<CompanyDto>(defaultDto);
    const [dtos, setDtos] = useState<CompanyDto[]>([]);
    const [select, setSelect] = useState<CompanyDto[]>([])
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);


    const handleRemove = (data: CompanyDto) => {
        removeTarget = data.id;
        setRemove(true);
        setConfirmRemove(() => async () => {
            const res = await api.delete(CompanyEndpoint.DELETE(removeTarget));
            if (Helper.handleToastByResCode(res, CompanyToast.DELETE, toggleToast)) {
                toggleRefresh();
                removeTarget = 0;
            }
        })
    }

    const handleInfo = (data: CompanyDto) => {
        setFormType(FormType.INFO);
        setDto(data);
        setForm(true);
    }

    {/* handle Table Action */ }
    const handleEdit = (data: CompanyDto) => {
        setFormType(FormType.UPDATE);
        setDto(data);
        setForm(true);
    }


    const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
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
                        select.map(async (a: LocationDto) => {
                            data.push(a.id)
                        })
                        var res = await send.post(CompanyEndpoint.DELETE_RANGE, data)
                        if (Helper.handleToastByResCode(res, CompanyToast.DELETE_RANGE, toggleToast)) {
                            setRemove(false);
                            toggleRefresh();
                        }
                    })
                    setRemove(true);
                }

                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(CompanyEndpoint.CREATE, dto);
                    if (Helper.handleToastByResCode(res, CompanyToast.CREATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                        setDto(defaultDto)
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await api.put(CompanyEndpoint.UPDATE, dto);
                    if (Helper.handleToastByResCode(res, CompanyToast.UPDATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                    }

                })
                setUpdate(true);
                break;
            case "close":
            case "cancel":
                setDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }


    const fetchData = async (pageNumber: number, pageSize: number, locationId?: number, search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(CompanyEndpoint.PAGINATION(pageNumber, pageSize, locationId, search, startDate, endDate));
        console.log(res?.data.data)
        if (res && res.data.data) {
            console.log(res.data.data)
            setDtos(res.data.data.data);
            setPagination(res.data.data.page);
        }
    }



    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <LocationIcon />,
            label: "Intevals",
            content: <CompanyForm type={formType} dto={dto} setDto={setDto} handleClick={handleClickWithEvent} />
        }
    ];







    return (
        <>

            <PageBreadcrumb pageTitle="Companies" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<CompanyDto> headers={HEADER} keys={KEY} data={dtos} select={select} setSelect={setSelect} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClickWithEvent} permission={filterPermission(FeatureId.LOCATION)} onInfo={handleInfo} fetchData={fetchData} refresh={refresh} locationId={locationId} />
                </div>

            }
        </>
    )
}