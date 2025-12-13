import Button from '../../components/ui/button/Button';
import { AddIcon, GroupIcon } from '../../icons';
import { useEffect, useState } from 'react';
import DangerModal from '../UiElements/DangerModal';
import AccessLevelForm from './AccessLevelForm';
import { AccessLevelDto } from '../../model/AccessGroup/AccessLevelDto';
import { AccessGroupTable } from './AccessGroupTable';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Helper from '../../utility/Helper';
import { ToastMessage } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import { CreateUpdateAccessLevelDto } from '../../model/AccessGroup/CreateUpdateAccessLevelDto';
import { useLocation } from '../../context/LocationContext';
import { send } from '../../api/api';
import { AccessLevelEndPoint } from '../../endpoint/AccessLevelEndpoint';
import { BaseTable } from '../UiElements/BaseTable';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';

// Define Global Variable
let removeTarget: number;

// Access Group Page 
export const HEADER: string[] = [
    "Name","Action"
]

export const KEY: string[] = [
    "name"
];

const AccessLevel = () => {
    const {toggleToast} = useToast();
    const {locationId} = useLocation();
    const {filterPermission} = useAuth();
    const defaultDto: CreateUpdateAccessLevelDto = {
    // Detail
    name: "",
    createUpdateAccessLevelDoorTimeZoneDto: [],
    componentId: 0,
    uuid: '',
    locationId: locationId,
    isActive: false
}
    const [accesLevelDto, setAccessLevelDto] = useState<CreateUpdateAccessLevelDto>(defaultDto);
    const [accessLevelDtos, setAccessLevelDtos] = useState<AccessLevelDto[]>([]);
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);
    const closeModalToggle = () => {
        setCreateModal(false);
        toggleRefresh();
    };
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreateModal(true);
                break;
            case "create":
                createAccessGroup();
                break;
            case "cancle":
                setCreateModal(false)
                setUpdateModal(false)
                break;
            default:
                break;
        }

    }

    {/* handle Table Action */ }
    const handleEdit = () => {

    }

    const handleRemove = (data: AccessLevelDto) => {
        removeTarget = data.componentId;
        setIsRemoveModal(true);
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
       removeAccessLevel(removeTarget);

    }

    {/* Group Data */ }
    const fetchData = async () => {
        const res = await send.get(AccessLevelEndPoint.GET_ACCESS_LEVEL(locationId))
        if (res && res.data.data) {
            console.log(res.data.data)
            setAccessLevelDtos(res.data.data);
        }
    };

    const createAccessGroup = async () => {
        const res = await send.post(AccessLevelEndPoint.CREATE_ACCESS_LEVLE,accesLevelDto)
        if(Helper.handleToastByResCode(res,ToastMessage.CREATE_ACCESS_LEVEL,toggleToast)){
            setCreateModal(false)
            toggleRefresh();
        }
    }

    const removeAccessLevel = async (ComponentId:number) => {
        const res = await send.delete(AccessLevelEndPoint.DELETE_ACCESS_LEVEL(ComponentId));
        if(Helper.handleToastByResCode(res,ToastMessage.DELETE_ACCESS_LEVEL,toggleToast)){
            setIsRemoveModal(false)
            toggleRefresh()
        }
    }
    

    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<AccessLevelDto[]>([]);
    const handleCheckedAll = (data: AccessLevelDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: AccessLevelDto, e: React.ChangeEvent<HTMLInputElement>) => {
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

    const tabContent:FormContent[] = [
        {
            label: "Access Level",
            icon: <GroupIcon />,
            content: <AccessLevelForm data={accesLevelDto} isUpdate={updateModal} handleClickWithEvent={handleClick} setAccessGroupDto={setAccessLevelDto} />
        }
    ]

    return (
        <>
            <PageBreadcrumb pageTitle="Access Group" />
            {isRemoveModal && <DangerModal header='Remove Control Point' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {createModal || updateModal ?
                <BaseForm tabContent={tabContent} />
                :
                 <BaseTable<AccessLevelDto> headers={HEADER} keys={KEY} data={accessLevelDtos} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} handleClick={handleClick} selectedObject={selectedObjects} permission={filterPermission(FeatureId.ACCESSLEVEL)}/>
            }

        </>
    )
}

export default AccessLevel