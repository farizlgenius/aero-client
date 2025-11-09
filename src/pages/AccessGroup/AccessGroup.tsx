import Button from '../../components/ui/button/Button';
import { Add } from '../../icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DangerModal from '../UiElements/DangerModal';
import AccessGroupForm from './AccessGroupForm';
import { AccessGroupDto } from '../../model/AccessGroup/AccessGroupDto';
import { AccessGroupTable } from './AccessGroupTable';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import HttpRequest from '../../utility/HttpRequest';
import Helper from '../../utility/Helper';
import { ToastMessage } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import { HttpMethod } from '../../enum/HttpMethod';
import { AccessLevelEndPoint } from '../../constants/constant';
import { CreateUpdateAccessGroupDto } from '../../model/AccessGroup/CreateUpdateAccessGroupDto';

// Define Global Variable
let removeTarget: number;


const defaultDto: CreateUpdateAccessGroupDto = {
    // Detail
    name: "",
    createUpdateAccessLevelDoorTimeZoneDto: [],
    componentId: 0,
    uuid: '',
    locationId: 1,
    locationName: 'Main Location',
    isActive: false
}


const AccessGroup = () => {
    const {toggleToast} = useToast();
    const [accessGroupDto, setAccessGroupDto] = useState<CreateUpdateAccessGroupDto>(defaultDto);
    const [accessGroupDtos, setAccessGroupDtos] = useState<AccessGroupDto[]>([]);
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

    const handleRemove = (data: AccessGroupDto) => {
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
        const res = await HttpRequest.send(HttpMethod.GET, AccessLevelEndPoint.GET_ACCESS_LEVEL)
        if (res && res.data.data) {
            console.log(res.data.data)
            setAccessGroupDtos(res.data.data);
        }
    };

    const createAccessGroup = async () => {
        const res = await HttpRequest.send(HttpMethod.POST,AccessLevelEndPoint.CREATE_ACCESS_LEVEL,accessGroupDto)
        if(Helper.handleToastByResCode(res,ToastMessage.CREATE_ACCESS_LEVEL,toggleToast)){
            setCreateModal(false)
            toggleRefresh();
        }
    }

    const removeAccessLevel = async (ComponentId:number) => {
        const res = await HttpRequest.send(HttpMethod.DELETE,AccessLevelEndPoint.DELETE_ACCESS_LEVEL+ComponentId)
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
    const [selectedObjects, setSelectedObjects] = useState<AccessGroupDto[]>([]);
    const handleCheckedAll = (data: AccessGroupDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: AccessGroupDto, e: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <>
            <PageBreadcrumb pageTitle="Access Group" />
            {isRemoveModal && <DangerModal header='Remove Control Point' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {createModal || updateModal ?
                <AccessGroupForm data={accessGroupDto} isUpdate={updateModal} handleClickWithEvent={handleClick} setAccessGroupDto={setAccessGroupDto} />
                :
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button
                            name="add"
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<Add className="size-5" />}
                        >
                            Create
                        </Button>

                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <AccessGroupTable data={accessGroupDtos} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObjects} />

                        </div>
                    </div>

                </div>
            }

        </>
    )
}

export default AccessGroup