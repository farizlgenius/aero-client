import React, { useEffect, useState } from 'react'
import DangerModal from '../UiElements/DangerModal';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { AddIcon, BoxIcon, CamIcon } from '../../icons';
import { CardHolderDto } from '../../model/CardHolder/CardHolderDto';
import { CardHolderEndpoint } from '../../endpoint/CardHolderEndpoint';
import { useToast } from '../../context/ToastContext';
import Helper from '../../utility/Helper';
import { ToastMessage } from '../../model/ToastMessage';
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


let removeTarget: string;

const CARDHOLDER_HEAD: string[] = ["Id", "Title", "First Name", "Middle Name", "Last Name", "Status", "Action"];
const CARDHOLDER_KEY: string[] = ["userId", "title", "firstName", "middleName", "lastName", "holderStatus"];


const CardHolder = () => {
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [cardHoldersDto, setCardHoldersDto] = useState<CardHolderDto[]>([]);

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
        image: {
            fileName: "",
            contentType: '',
            fileSize: 0,
            fileData: '',
        },
        additionals: [
        ],
        credentials: [],
        accessLevels: [],
        uuid: '',
        locationId: locationId,
        isActive: true,
        identification: '',
        dateOfBirth: '',
        address: '',
        flag: 1
    }

    const [cardHolderDto, setCardHolderDto] = useState<CardHolderDto>(defaultDto)
    {/* Modal */ }
    const [deleteModal, setRemoveModal] = useState<boolean>(false);
    const [createModal, setCreateModal] = useState<boolean>(false);
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        console.log(e.currentTarget.value)
        switch (e.currentTarget.name) {
            case "add":
                setCreateModal(true);
                break;
            case "create":
                createCardHolder(cardHolderDto);
                break;
            case "cancle":
                setUpdateModal(false)
                setCreateModal(false)
                break;
            case "remove-confirm":
                removeCardHolder(removeTarget);
                break;
                case "remove-cancel":
                    setRemoveModal(false);
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
            content: <PersonalInformationForm dto={cardHolderDto} setDto={setCardHolderDto} />
        }, {
            icon: <BoxIcon />,
            label: "Access Level",
            content: <AccessLevelForm dto={cardHolderDto} setDto={setCardHolderDto} />
        },
        {
            icon: <BoxIcon />,
            label: "Credentials",
            content: <CredentialForm dto={cardHolderDto} setDto={setCardHolderDto} />
        },
        {
            icon: <BoxIcon />,
            label: "Settings",
            content: <UserSettingForm handleClick={handleClick} dto={cardHolderDto} setDto={setCardHolderDto} />
        }
    ];


    {/* handle Table Action */ }
    const handleEdit = () => {

    }

    const handleRemove = (data: CardHolderDto) => {
        console.log(data);
        removeTarget = data.userId;
        setRemoveModal(true);
    }
    const fetchData = async () => {
        const res = await send.get(CardHolderEndpoint.GET_CARDHOLDERS(locationId));
        if (res && res.data.data) {
            setCardHoldersDto(res.data.data)
            console.log(res.data.data)
        }

    };

    const removeCardHolder = async (UserId: string) => {
        const res = await send.delete(CardHolderEndpoint.DELETE_CARDHOLDER(UserId));
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_CARDHOLDER, toggleToast)) {
            setRemoveModal(false);
            toggleRefresh();
        }
    }


    const createCardHolder = async (data: CardHolderDto) => {
        const res = await send.post(CardHolderEndpoint.CREATE_CARDHOLDER, data);
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_CARDHOLDER, toggleToast)) {
            setUpdateModal(false)
            setCreateModal(false)
            toggleRefresh();
        }
    }


    {/* UseEffect */ }
    useEffect(() => {
        fetchData();
    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<CardHolderDto[]>([]);
    const handleCheckedAll = (data: CardHolderDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: CardHolderDto, e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(data)
        console.log(e.target.checked)
        if (setSelectedObjects) {
            if (e.target.checked) {
                setSelectedObjects((prev) => [...prev, data]);
            } else {
                setSelectedObjects((prev) =>
                    prev.filter((item) => item.userId !== data.userId)
                );
            }
        }
    }

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
            <PageBreadcrumb pageTitle="Credentials" />
            {deleteModal && <DangerModal header='Remove Credentials' body='Please Click Confirm if you want to remove this users' handleClick={handleClick} />}
            {createModal || updateModal ?

                <BaseForm tabContent={tabContent} />

                :

                <BaseTable<CardHolderDto> headers={CARDHOLDER_HEAD} keys={CARDHOLDER_KEY} data={cardHoldersDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleClick={handleClick} handleRemove={handleRemove} handleEdit={handleEdit} permission={filterPermission(FeatureId.CARDHODLER)} action={action} />


            }


        </>
    )
}

export default CardHolder