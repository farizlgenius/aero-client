import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { AddIcon, BoxIcon, CamIcon, ToggleIcon } from '../../icons';
import { CardHolderDto } from '../../model/CardHolder/CardHolderDto';
import { CardHolderEndpoint } from '../../endpoint/CardHolderEndpoint';
import { useToast } from '../../context/ToastContext';
import Helper from '../../utility/Helper';
import { CardHolderToast } from '../../model/ToastMessage';
import { FormContent } from '../../model/Form/FormContent';
import { PersonalInformationForm } from '../../components/form/card-holder/PersonalInformationForm';
import { AccessLevelForm } from '../../components/form/card-holder/AccessLevelForm';
import { CredentialForm } from '../../components/form/card-holder/CredentialForm';
import { UserSettingForm } from '../../components/form/card-holder/UserSettingForm';
import { BaseForm } from '../UiElements/BaseForm';
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



const CARDHOLDER_HEAD: string[] = ["", "Id", "Name", "Company", "Department", "Postion", "Status", "Action"];
const CARDHOLDER_KEY: string[] = ["avatar", "userId", "name", "company", "department", "position", "isActive"];


const CardHolder = () => {

    const { locationId } = useLocation();
    const { setPagination } = usePagination();
    const { filterPermission } = useAuth();
    const { setCreate, setUpdate, setRemove, setConfirmCreate, setConfirmRemove, setConfirmUpdate, setInfo, setMessage } = usePopup();
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [cardHoldersDto, setCardHoldersDto] = useState<CardHolderDto[]>([]);
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);

    const defaultDto: CardHolderDto = {
        userId: '',
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
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
        identification: '',
        dateOfBirth: '',
        address: '',
        flag: 1,
        componentId: 0,
        hardwareName: ''
    }

    const [cardHolderDto, setCardHolderDto] = useState<CardHolderDto>(defaultDto)
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
                    selectedObjects.map(async (a: CardHolderDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(CardHolderEndpoint.DELETE_RANGE, data)
                    if (Helper.handleToastByResCode(res, CardHolderToast.DELETE_RANGE, toggleToast)) {
                        setSelectedObjects([])
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":

                setConfirmCreate(() => async () => {
                    const res1 = await send.post(CardHolderEndpoint.CREATE, cardHolderDto);
                    if (Helper.handleToastByResCode(res1, CardHolderToast.CREATE, toggleToast)) {
                        if (image != undefined) {
                            const payload = new FormData();
                            payload.append("image", image);
                            const res2 = await send.postForm(CardHolderEndpoint.UPLOAD(cardHolderDto.userId), payload);
                            if (Helper.handleToastByResCode(res2, CardHolderToast.CREATE, toggleToast)) {
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
                    const res = await send.put(CardHolderEndpoint.UPDATE, cardHolderDto);
                    if (Helper.handleToastByResCode(res, CardHolderToast.UPDATE, toggleToast)) {
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

    {/* Form */ }
    const tabContent: FormContent[] = [
        {
            icon: <CamIcon />,
            label: "Personal Information",
            content: <PersonalInformationForm type={formType} dto={cardHolderDto} setDto={setCardHolderDto} handleClick={handleClick} image={image} setImage={setImage} />
        }, {
            icon: <BoxIcon />,
            label: "Level & Credential",
            content: <AccessLevelForm type={formType} handleClick={handleClick} dto={cardHolderDto} setDto={setCardHolderDto} />
        },
        {
            icon: <BoxIcon />,
            label: "Credentials",
            content: <CredentialForm type={formType} handleClick={handleClick} dto={cardHolderDto} setDto={setCardHolderDto} />
        },
        {
            icon: <BoxIcon />,
            label: "Settings",
            content: <UserSettingForm type={formType} handleClick={handleClick} dto={cardHolderDto} setDto={setCardHolderDto} />
        }
    ];


    {/* handle Table Action */ }
    const handleEdit = (data: CardHolderDto) => {
        console.log(data);
        setFormType(FormType.UPDATE)
        setCardHolderDto(data)
        setForm(true);
    }

    const handleInfo = (data: CardHolderDto) => {
        setFormType(FormType.INFO);
        setCardHolderDto(data)
        setForm(true);
    }

    const handleRemove = (data: CardHolderDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(CardHolderEndpoint.DELETE(data.userId))
            if (Helper.handleToastByResCode(res, CardHolderToast.DELETE, toggleToast))
                toggleRefresh();
        })
        setRemove(true);
    }
    const fetchData = async (pageNumber: number, pageSize: number, locationId?: number, search?: string, startDate?: string, endDate?: string) => {
        const res = await send.get(CardHolderEndpoint.PAGINATION(pageNumber, pageSize, locationId, search, startDate, endDate));
        console.log(res?.data.data)
        if (res && res.data.data) {
            console.log(res.data.data)
            setCardHoldersDto(res.data.data.data);
            setPagination(res.data.data.page);
        }
    }




    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<CardHolderDto[]>([]);


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

                <BaseForm tabContent={tabContent} />

                :

                <BaseTable<CardHolderDto> headers={CARDHOLDER_HEAD} keys={CARDHOLDER_KEY} data={cardHoldersDto} select={selectedObjects} setSelect={setSelectedObjects} onClick={handleClick} onRemove={handleRemove} onEdit={handleEdit} onInfo={handleInfo} permission={filterPermission(FeatureId.CARDHODLER)} action={action} fetchData={fetchData} locationId={locationId} refresh={refresh} specialDisplay={[
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

export default CardHolder