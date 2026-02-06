import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { AddIcon, BoxIcon, CamIcon } from '../../icons';
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



const CARDHOLDER_HEAD: string[] = ["Id", "Title", "First Name", "Middle Name", "Last Name", "Status", "Action"];
const CARDHOLDER_KEY: string[] = ["userId", "title", "firstName", "middleName", "lastName", "holderStatus"];


const CardHolder = () => {
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const {setCreate,setUpdate,setRemove,setConfirmCreate,setConfirmRemove,setConfirmUpdate,setInfo,setMessage} = usePopup();
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [cardHoldersDto, setCardHoldersDto] = useState<CardHolderDto[]>([]);
    const [formType,setFormType] = useState<FormType>(FormType.CREATE);

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
    }

    const [cardHolderDto, setCardHolderDto] = useState<CardHolderDto>(defaultDto)
    {/* Modal */ }
    const [form,setForm] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        console.log(e.currentTarget.value)
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
                    selectedObjects.map(async (a:CardHolderDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(CardHolderEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,CardHolderToast.DELETE_RANGE,toggleToast)){
                        setSelectedObjects([])                  
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async() => {
                    const res = await send.post(CardHolderEndpoint.CREATE,cardHolderDto);
                    if(Helper.handleToastByResCode(res,CardHolderToast.CREATE,toggleToast)){
                        setCardHolderDto(defaultDto);
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                 setConfirmUpdate(() => async () => {
                    const res = await send.put(CardHolderEndpoint.UPDATE, cardHolderDto);
                    if (Helper.handleToastByResCode(res,CardHolderToast.UPDATE, toggleToast)) {
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
            content: <PersonalInformationForm type={formType} dto={cardHolderDto} setDto={setCardHolderDto} handleClick={handleClick} />
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
    const handleEdit = (data:CardHolderDto) => {
        setFormType(FormType.UPDATE)
                setCardHolderDto(data)
                setForm(true);
    }

    const handleInfo = (data:CardHolderDto) => {
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
    const fetchData = async () => {
        const res = await send.get(CardHolderEndpoint.GET(locationId));
        if (res && res.data.data) {
            setCardHoldersDto(res.data.data)
            console.log(res.data.data)
        }

    };

   


    {/* UseEffect */ }
    useEffect(() => {
        fetchData();
    }, [refresh]);

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
            {form  ?

                <BaseForm tabContent={tabContent} />

                :

                <BaseTable<CardHolderDto> headers={CARDHOLDER_HEAD} keys={CARDHOLDER_KEY} data={cardHoldersDto} select={selectedObjects} setSelect={setSelectedObjects}  onClick={handleClick} onRemove={handleRemove} onEdit={handleEdit} onInfo={handleInfo} permission={filterPermission(FeatureId.CARDHODLER)} action={action} />


            }


        </>
    )
}

export default CardHolder