import {  useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import { useToast } from "../../context/ToastContext";
import { RoleDto } from "../../model/Role/RoleDto";
import { RoleToast } from "../../model/ToastMessage";
import { FormContent } from "../../model/Form/FormContent";
import { BaseForm } from "../UiElements/BaseForm";
import {  RoleIcon } from "../../icons";
import { BaseTable } from "../UiElements/BaseTable";
import { RoleEndpoint } from "../../endpoint/RoleEndpoint";
import Helper from "../../utility/Helper";
import { RoleForm } from "../../components/form/role/RoleForm";
import { send } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { FeatureId } from "../../enum/FeatureId";
import { usePopup } from "../../context/PopupContext";
import { FormType } from "../../model/Form/FormProp";
import { useLocation } from "../../context/LocationContext";
import { usePagination } from "../../context/PaginationContext";


var removeTarget: number = 0;

const defaultDto: RoleDto = {
    componentId: 0,
    name: "",
    features: []
}

export const LOCATION_HEADER: string[] = ["Name", "Action"]
export const LOCATION_KEY: string[] = ["name"];


export const Role = () => {
    const { toggleToast } = useToast();
    const {locationId} = useLocation();
    const {setPagination} = usePagination();
    const {filterPermission} = useAuth();
    const { setCreate,setConfirmCreate,setUpdate,setConfirmUpdate,setRemove,setConfirmRemove,setInfo,setMessage } = usePopup();
    const [form, setForm] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [roleDto, setRoleDto] = useState<RoleDto>(defaultDto);
    const [rolesDto, setRolesDto] = useState<RoleDto[]>([]);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);
    const toggleRefresh = () => setRefresh(!refresh)

    const handleRemove = (data: RoleDto) => {
        removeTarget = data.componentId;
        setConfirmRemove(() => async () => {
            const res = await send.delete(RoleEndpoint.DELETE(removeTarget));
            if (Helper.handleToastByResCode(res, RoleToast.DELETE, toggleToast)) {
                setRemove(false)
                toggleRefresh();
                removeTarget = 0;
            }
        })
        setRemove(true);
    }

    const handleInfo = (data:RoleDto) => {
        setFormType(FormType.INFO)
        setRoleDto(data)
        setForm(true);
    }

    {/* handle Table Action */ }
    const handleEdit = (data: RoleDto) => {
        setFormType(FormType.UPDATE)
        setRoleDto(data);
        setForm(true);
    }


    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
                    selectedObjects.map(async (a:RoleDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(RoleEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,RoleToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(RoleEndpoint.CREATE, roleDto)
                    if (Helper.handleToastByResCode(res, RoleToast.CREATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(RoleEndpoint.UPDATE, roleDto)
                    if (Helper.handleToastByResCode(res, RoleToast.UPDATE, toggleToast)) {
                        setForm(false)
                        toggleRefresh();
                    }
                })
                setUpdate(true);
                break;
            case "close":
            case "cancel":
                setRoleDto(defaultDto)
                setForm(false);
                break;
            default:
                break;
        }
    }


    const [selectedObjects, setSelectedObjects] = useState<RoleDto[]>([]);

  const fetchData = async (pageNumber: number, pageSize: number,locationId?:number,search?: string, startDate?: string, endDate?: string) => {
          const res = await send.get(RoleEndpoint.PAGINATION(pageNumber,pageSize,locationId,search, startDate, endDate));
          console.log(res?.data.data)
          if (res && res.data.data) {
              console.log(res.data.data)
              setRolesDto(res.data.data.data);
              setPagination(res.data.data.page);
          }
      }


    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <RoleIcon />,
            label: "Role",
            content: <RoleForm type={formType} dto={roleDto} setDto={setRoleDto} handleClick={handleClick} />
        }
    ];



    return (

        <>
            <PageBreadcrumb pageTitle="Roles" />
            {form ?

                <BaseForm tabContent={tabContent} />
                :
                <div className="space-y-6">
                    <BaseTable<RoleDto> headers={LOCATION_HEADER} keys={LOCATION_KEY} data={rolesDto} select={selectedObjects} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClick} permission={filterPermission(FeatureId.OPERATOR)} onInfo={handleInfo} setSelect={setSelectedObjects} fetchData={fetchData} locationId={locationId} />
                </div>

            }
        </>)
}   