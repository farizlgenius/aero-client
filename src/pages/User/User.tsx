import { useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { AddIcon, UserIcon } from '../../icons';
import { UserDto } from '../../model/User/UserDto';
import { UserEndpoint } from '../../endpoint/UserEndpoint';
import { useToast } from '../../context/ToastContext';
import Helper from '../../utility/Helper';
import { UserToast as UserToast } from '../../model/ToastMessage';
import { send } from '../../api/api';
import { useLocation } from '../../context/LocationContext';
import { BaseTable } from '../UiElements/BaseTable';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';
import { ActionButton } from '../../model/ActionButton';
import { FormType } from '../../model/Form/FormProp';
import { usePopup } from '../../context/PopupContext';
import { usePagination } from '../../context/PaginationContext';
import { TableCell } from '../../components/ui/table';
import { Avatar } from '../UiElements/Avatar';
import Switch from '../../components/form/switch/Switch';
import UserForm from './UserForm';
import { FormContent } from '../../model/Form/FormContent';
import { BaseForm } from '../UiElements/BaseForm';
import { Gender } from '../../enum/Gender';



const CARDHOLDER_HEAD: string[] = ["Image", "Id", "Name", "Company", "Department", "Postion", "Status", "Action"];
const CARDHOLDER_KEY: string[] = ["avatar", "userId", "name", "company", "department", "position", "isActive"];


const User = () => {

    const { locationId } = useLocation();
    const { setPagination } = usePagination();
    const { filterPermission } = useAuth();
    const { setCreate, setUpdate, setRemove, setConfirmCreate, setConfirmRemove, setConfirmUpdate, setInfo, setMessage } = usePopup();
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [cardHoldersDto, setCardHoldersDto] = useState<UserDto[]>([]);
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);

    const defaultDto: UserDto = {
        userId: '',
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: Gender.Male.toString(),
        email: '',
        phone: '',
        company: '',
        position: '',
        department: '',
        additionals: [],
        credentials: [],
        accessLevels: [],
        locationId: locationId,
        isActive: true,
        flag: 1,
        companyId: -1,
        positionId: -1,
        departmentId: -1,
        identification: '',
        dateOfBirth: '',
        address: '',
        id: 0,
        name: '',
        image: ''
    }

    const [cardHolderDto, setCardHolderDto] = useState<UserDto>(defaultDto)
    const [image, setImage] = useState<File | undefined>();
    {/* Modal */ }
    const [form, setForm] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        console.log(e.currentTarget.value)
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE)
                setForm(true);
                break;
            case "delete":
                if (selectedObjects.length == 0) {
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data: number[] = [];
                    selectedObjects.map(async (a: UserDto) => {
                        data.push(a.id)
                    })
                    var res = await send.post(UserEndpoint.DELETE_RANGE, data)
                    if (Helper.handleToastByResCode(res, UserToast.DELETE_RANGE, toggleToast)) {
                        setSelectedObjects([])
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":

                setConfirmCreate(() => async () => {
                    const res1 = await send.post(UserEndpoint.CREATE, cardHolderDto);
                    if (Helper.handleToastByResCode(res1, UserToast.CREATE, toggleToast)) {
                        if (image != undefined) {
                            const payload = new FormData();
                            payload.append("image", image);
                            const res2 = await send.postForm(UserEndpoint.UPLOAD(cardHolderDto.userId), payload);
                            if (Helper.handleToastByResCode(res2, UserToast.CREATE, toggleToast)) {
                                setCardHolderDto(defaultDto);
                                setForm(false);
                                toggleRefresh();
                            }
                        } else {
                            setCardHolderDto(defaultDto);
                            setForm(false);
                            toggleRefresh();
                        }


                    }

                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(UserEndpoint.UPDATE, cardHolderDto);
                    if (Helper.handleToastByResCode(res, UserToast.UPDATE, toggleToast)) {
                        setCardHolderDto(defaultDto)
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setUpdate(true)
                break;
            case "cancle":
            case "close":
                setForm(false)
                setCardHolderDto(defaultDto);
                break;
            default:
                break;
        }
    }

    {/* handle Table Action */ }
    const handleEdit = (data: UserDto) => {
        console.log(data);
        setFormType(FormType.UPDATE)
        setCardHolderDto(data)
        setForm(true);
    }

    const handleInfo = (data: UserDto) => {
        setFormType(FormType.INFO);
        setCardHolderDto(data)
        setForm(true);
    }

    const handleRemove = (data: UserDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(UserEndpoint.DELETE(data.userId))
            if (Helper.handleToastByResCode(res, UserToast.DELETE, toggleToast))
                toggleRefresh();
        })
        setRemove(true);
    }
    const fetchData = async (pageNumber: number, pageSize: number, locationId?: number, search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(UserEndpoint.PAGINATION(pageNumber, pageSize, locationId, search, startDate, endDate));
        console.log(res?.data.data)
        if (res && res.data.data) {
            console.log(res.data.data)
            setCardHoldersDto(res.data.data.data);
            setPagination(res.data.data.page);
        }
    }




    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<UserDto[]>([]);

    const content:FormContent[] = [
        {
            label: "Users",
            content: <UserForm
                    type={formType}
                    dto={cardHolderDto}
                    setDto={setCardHolderDto}
                    handleClick={handleClick}
                    image={image}
                    setImage={setImage}
                />,
            icon: <UserIcon />
        }
    ]


    const action: ActionButton[] = [
        {
            lable: "deactivate",
            buttonName: "Deactivate",
            icon: <AddIcon />
        }, {
            lable: "activate",
            buttonName: "Activate",
            icon: <AddIcon />
        },
        {
            lable: "reset",
            buttonName: "Reset Anti-Passback",
            icon: <AddIcon />
        }
    ]


    return (
        <>
            <PageBreadcrumb pageTitle="Card Holders" />
            {form ?

                
                <BaseForm tabContent={content} />

                :

                <BaseTable<UserDto> headers={CARDHOLDER_HEAD} keys={CARDHOLDER_KEY} data={cardHoldersDto} select={selectedObjects} setSelect={setSelectedObjects} onClick={handleClick} onRemove={handleRemove} onEdit={handleEdit} onInfo={handleInfo} permission={filterPermission(FeatureId.CARDHODLER)} action={action} fetchData={fetchData} locationId={locationId} refresh={refresh} specialDisplay={[
                    {
                        key: "avatar",
                        content: (d, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                           <div className="cursor-pointer w-11 h-11 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                                <Avatar userId={d.userId} />
                            </div>

                        </TableCell>
                    },
                    {
                        key: "name",
                        content: (d, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {d.title} {d.firstName} {d.middleName} {d.lastName}
                        </TableCell>
                    },{
                        key: "isActive",
                        content: (d, i) => <TableCell key={i} className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {<Switch defaultChecked={d.isActive} label={''} />}
                        </TableCell>
                    }
                ]} />


            }


        </>
    )
}

export default User
