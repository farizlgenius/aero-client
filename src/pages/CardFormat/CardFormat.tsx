import React, { useEffect, useState } from 'react'
import Button from '../../components/ui/button/Button';
import { Add } from '../../icons';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import DangerModal from '../UiElements/DangerModal';
import CardFormatForm from './CardFormatForm';
import { CardFormatTable } from './CardFormatTable';
import { CardFormatDto } from '../../model/CardFormat/CardFormatDto';
import HttpRequest from '../../utility/HttpRequest';
import Helper from '../../utility/Helper';
import { ToastMessage } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import { CardFormatEndpoint } from '../../enum/endpoint/CardFormatEndpoint';
import { HttpMethod } from '../../enum/HttpMethod';


// Define Global Variable
let removeTarget: number = -1;
const defaultDto: CardFormatDto = {
    name: '',
    componentId: 0,
    facility: -1,
    flags:0,
    offset:0,
    functionId:1,
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
    locationId: 0,
    locationName: '',
    isActive: false
}

const CardFormat = () => {
    const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
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
        var res = await HttpRequest.send(HttpMethod.POST,CardFormatEndpoint.CREATE_CARDFORMAT,cardFormatDto)
        if(Helper.handleToastByResCode(res,ToastMessage.CREATE_CARD_FORMAT,toggleToast)){
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }
    const fetchData = async () => {
        var res = await HttpRequest.send(HttpMethod.GET, CardFormatEndpoint.GET_ALL_CARDFORMAT);
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
    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Card Format' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Card Format Configuration" />
            {create || update ?
                <CardFormatForm data={cardFormatDto} setCardFormatDto={setCardFormatDto} isUpdate={update} handleClickWithEvent={handleClick} />
                :
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button
                            name='add'
                            size="sm"
                            variant="primary"
                            startIcon={<Add className="size-5" />}
                            onClickWithEvent={handleClick}
                        >
                            Add
                        </Button>

                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <CardFormatTable data={cardFormatsDto} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObjects} />
                        </div>
                    </div>

                </div>
            }


        </>
    )
}

export default CardFormat