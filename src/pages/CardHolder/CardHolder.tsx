import React, { useEffect, useState } from 'react'
import DangerModal from '../UiElements/DangerModal';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { AddIcon, BoxIcon, CamIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import { CardHolderDto } from '../../model/CardHolder/CardHolderDto';
import { CardHolderTable } from './CardHolderTable';
import HttpRequest from '../../utility/HttpRequest';
import { HttpMethod } from '../../enum/HttpMethod';
import { CardHolderEndpoint } from '../../enum/endpoint/CardHolderEndpoint';
import { useToast } from '../../context/ToastContext';
import Helper from '../../utility/Helper';
import { ToastMessage } from '../../model/ToastMessage';
import { FormContent } from '../../model/Form/FormContent';
import { PersonalInformationForm } from '../../components/form/card-holder/PersonalInformationForm';
import { AccessLevelForm } from '../../components/form/card-holder/AccessLevelForm';
import { CredentialForm } from '../../components/form/card-holder/CredentialForm';
import { UserSettingForm } from '../../components/form/card-holder/UserSettingForm';
import { BaseForm } from '../UiElements/BaseForm';


let removeTarget: string;

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
    locationId: 1,
    locationName: 'Main Location',
    isActive: true,
    identification: '',
    dateOfBirth: '',
    address: '',
    flag: 0
}

const CardHolder = () => {


    
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [cardHoldersDto, setCardHoldersDto] = useState<CardHolderDto[]>([]);
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
            default:
                break;
        }
    }

    {/* Form */}
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
            content: <UserSettingForm handleClickWithEvent={handleClick} dto={cardHolderDto} setDto={setCardHolderDto} />
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
    const handleOnClickCloseRemove = () => {
        setRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeCardHolder(removeTarget);

    }
    const fetchData = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, CardHolderEndpoint.GET_CARDHOLDERS)
        if (res && res.data.data) {
            setCardHoldersDto(res.data.data)
            console.log(res.data.data)
        }

    };

    const removeCardHolder = async (UserId: string) => {
        const res = await HttpRequest.send(HttpMethod.DELETE, CardHolderEndpoint.DELETE_CARDHOLDER + UserId)
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_CARDHOLDER, toggleToast)) {
            setRemoveModal(false);
            toggleRefresh();
        }
    }


    const createCardHolder = async (data: CardHolderDto) => {
        const res = await HttpRequest.send(HttpMethod.POST, CardHolderEndpoint.CREATE_CARDHOLDER, data)
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

    return (
        <>
            <PageBreadcrumb pageTitle="Credentials" />
            {deleteModal && <DangerModal header='Remove Credentials' body='Please Click Confirm if you want to remove this users' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            {createModal || updateModal ?

                <BaseForm tabContent={tabContent} />

                :

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button
                            name='add'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<AddIcon className="size-5" />}
                        >
                            Create
                        </Button>
                        <Button
                            name='deactivate'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<AddIcon className="size-5" />}
                        >
                            Deactivate
                        </Button>
                        <Button
                            name='activate'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<AddIcon className="size-5" />}
                        >
                            Activate
                        </Button>
                        <Button
                            name='reset'
                            onClickWithEvent={handleClick}
                            size="sm"
                            variant="primary"
                            startIcon={<AddIcon className="size-5" />}
                        >
                            Reset Anti-Passback
                        </Button>

                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <CardHolderTable handleCheck={handleChecked} handleCheckAll={handleCheckedAll} data={cardHoldersDto} selectedObject={selectedObjects} handleEdit={handleEdit} handleRemove={handleRemove} />
                        </div>
                    </div>

                </div>
            }


        </>
    )
}

export default CardHolder