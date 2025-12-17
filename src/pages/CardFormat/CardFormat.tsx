import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import RemoveModal from '../UiElements/RemoveModal';
import CardFormatForm from './CardFormatForm';
import { CardFormatDto } from '../../model/CardFormat/CardFormatDto';
import HttpRequest from '../../utility/HttpRequest';
import Helper from '../../utility/Helper';
import { ToastMessage } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import { CardFormatEndpoint } from '../../endpoint/CardFormatEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { BaseTable } from '../UiElements/BaseTable';
import { FeatureId } from '../../enum/FeatureId';
import { send } from '../../api/api';
import { FormContent } from '../../model/Form/FormContent';
import { AddIcon } from '../../icons';
import { BaseForm } from '../UiElements/BaseForm';


// Define Global Variable
let removeTarget: number = -1;
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
        uuid: '',
        locationId: locationId,
        isActive: false
    }

    const [cardFormatDto, setCardFormatDto] = useState<CardFormatDto>(defaultDto);
    {/* Modal */ }
    const [isRemoveModal, setIsRemoveModal] = useState(false);
    const [create, setCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setCreate(true);
                break;
            case "create":
                createCardformat();
                break;
            case "cancle":
                setCreate(false);
                setUpdate(false);
                break;
            default:
                break;
        }
    }


    {/* handle Table Action */ }
    const handleEdit = () => {

    }

    const handleRemove = (data: CardFormatDto) => {
        console.log(data);
        setIsRemoveModal(true);
        removeTarget = data.componentId
    }
    const handleOnClickCloseRemove = () => {
        setIsRemoveModal(false);
    }
    const handleOnClickConfirmRemove = () => {
        removeCardFormat(removeTarget);

    }

    {/* Group Data */ }
    const [cardFormatsDto, setCardFormatsDto] = useState<CardFormatDto[]>([]);
    const createCardformat = async () => {
        var res = await send.post(CardFormatEndpoint.CREATE_CARDFORMAT,cardFormatDto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_CARD_FORMAT, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }
    const fetchData = async () => {
        var res = await send.get(CardFormatEndpoint.GET_CARDFORMAT);
        if (res) {
            setCardFormatsDto(res.data.data);
        }

    };

    const removeCardFormat = async (cardFormatNo: number) => {
        var res = await HttpRequest.send(HttpMethod.DELETE, CardFormatEndpoint.DELETE_CARDFORMAT + cardFormatNo);
        if (Helper.handleToastByResCode(res, ToastMessage.DELETE_CARDFORMAT, toggleToast)) {
            setIsRemoveModal(false);
            toggleRefresh();
        }

    }


    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<CardFormatDto[]>([]);
    const handleCheckedAll = (data: CardFormatDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: CardFormatDto, e: React.ChangeEvent<HTMLInputElement>) => {
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

    const content:FormContent[] = [
        {
            label:"Card Format",
            icon:<AddIcon/>,
            content: <CardFormatForm data={cardFormatDto} setCardFormatDto={setCardFormatDto} isUpdate={update} handleClickWithEvent={handleClick} />
        }
    ]
    return (
        <>
            {isRemoveModal && <RemoveModal header='Remove Card Format' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Card Format Configuration" />
            {create || update ?
                <BaseForm tabContent={content}/>
                :
                <BaseTable<CardFormatDto> headers={CARDFORMAT_TABLE_HEAD} keys={CARDFORMAT_KEY} data={cardFormatsDto} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObjects} handleClick={handleClick} permission={filterPermission(FeatureId.SETTING)} />

            }


        </>
    )
}

export default CardFormat