import React, {  useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import CardFormatForm from './CardFormatForm';
import { CardFormatDto } from '../../model/CardFormat/CardFormatDto';
import Helper from '../../utility/Helper';
import { CardFormatToast } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import { CardFormatEndpoint } from '../../endpoint/CardFormatEndpoint';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { BaseTable } from '../UiElements/BaseTable';
import { FeatureId } from '../../enum/FeatureId';
import { send } from '../../api/api';
import { FormContent } from '../../model/Form/FormContent';
import { AddIcon } from '../../icons';
import { BaseForm } from '../UiElements/BaseForm';
import { usePopup } from '../../context/PopupContext';
import { FormType } from '../../model/Form/FormProp';
import { usePagination } from '../../context/PaginationContext';


// Define Global Variable
export const CARDFORMAT_TABLE_HEAD: string[] = [
    "Name", "Bits", "Facility", "Action"
]
export const CARDFORMAT_KEY: string[] = [
    "name", "bits", "facility",
];

const CardFormat = () => {
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const { setCreate, setUpdate, setInfo, setRemove, setConfirmRemove, setConfirmCreate, setConfirmUpdate,setMessage } = usePopup();
    const { setPagination } = usePagination();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const defaultDto: CardFormatDto = {
        name: '',
        componentId: 0,
        facility: -1,
        flags: 0,
        offset: 0,
        functionId: 1,
        bits: 0,
        peLn: 0,
        peLoc: 0,
        poLn: 0,
        poLoc: 0,
        fcLn: 0,
        fcLoc: 0,
        chLn: 0,
        chLoc: 0,
        icLn: 0,
        icLoc: 0,
        locationId: locationId,
        isActive: false
    }

    const [formType,setFormType] = useState<FormType>(FormType.CREATE);
    const [cardFormatDto, setCardFormatDto] = useState<CardFormatDto>(defaultDto);
    {/* Modal */ }
    const [form,setForm] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setFormType(FormType.CREATE);
                setForm(true);
                break;
            case "delete":
                if(selectedObjects.length == 0){            
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data:number[] = [];
                    selectedObjects.map(async (a:CardFormatDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(CardFormatEndpoint.DELETE_RANGE,data)
                    if(Helper.handleToastByResCode(res,CardFormatToast.DELETE_RANGE,toggleToast)){
                        setRemove(false);
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(CardFormatEndpoint.CREATE, cardFormatDto)
                    if (Helper.handleToastByResCode(res, CardFormatToast.CREATE, toggleToast)) {
                        setForm(false)
                        setCardFormatDto(defaultDto)
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(CardFormatEndpoint.UPDATE, cardFormatDto);
                    if (Helper.handleToastByResCode(res,CardFormatToast.UPDATE, toggleToast)) {
                        setCardFormatDto(defaultDto)
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setUpdate(true)
                break;
            case "close":
            case "cancle":
                setCardFormatDto(defaultDto);
                setForm(false);
                break;
            default:
                break;
        }
    }


    {/* handle Table Action */ }
    const handleInfo = (data:CardFormatDto) => {
            setFormType(FormType.INFO);
                    setCardFormatDto(data)
                    setForm(true);
    }
    const handleEdit = (data:CardFormatDto) => {
        setFormType(FormType.UPDATE)
                setCardFormatDto(data)
                setForm(true);
    }

    const handleRemove = (data: CardFormatDto) => {
       setConfirmRemove(() => async () => {
            const res = await send.delete(CardFormatEndpoint.DELETE(data.componentId))
            if (Helper.handleToastByResCode(res, CardFormatToast.DELETE, toggleToast))
                toggleRefresh();
        })
        setRemove(true);
    }


    {/* Group Data */ }
    const [cardFormatsDto, setCardFormatsDto] = useState<CardFormatDto[]>([]);

    const fetchData = async (pageNumber: number, pageSize: number,locationId?:number,search?: string, startDate?: string, endDate?: string) => {
            const res = await send.get(CardFormatEndpoint.PAGINATION(pageNumber,pageSize,locationId,search, startDate, endDate));
            console.log(res?.data.data)
            if (res && res.data.data) {
                console.log(res.data.data)
                setCardFormatsDto(res.data.data.data);
                setPagination(res.data.data.page);
            }
        }



    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<CardFormatDto[]>([]);
   

    const content:FormContent[] = [
        {
            label:"Card Format",
            icon:<AddIcon/>,
            content: <CardFormatForm dto={cardFormatDto} setDto={setCardFormatDto} type={formType} handleClick={handleClick} />
        }
    ]
    return (
        <>
            <PageBreadcrumb pageTitle="Card Format Configuration" />
            {form ?
                <BaseForm tabContent={content}/>
                :
                <BaseTable<CardFormatDto> headers={CARDFORMAT_TABLE_HEAD} keys={CARDFORMAT_KEY} data={cardFormatsDto} onInfo={handleInfo}  onEdit={handleEdit} onRemove={handleRemove} select={selectedObjects} setSelect={setSelectedObjects} onClick={handleClick} permission={filterPermission(FeatureId.SETTING)} refresh={refresh} fetchData={fetchData} locationId={locationId} />

            }


        </>
    )
}

export default CardFormat