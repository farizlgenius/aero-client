import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { AreaDto } from "../../model/Area/AreaDto";
import HttpRequest from "../../utility/HttpRequest";
import { AreaEndPoint, HttpMethod } from "../../constants/constant";
import Helper from "../../utility/Helper";
import { ToastMessage } from "../../model/ToastMessage";
import DangerModal from "../UiElements/DangerModal";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { AreaForm } from "./AreaForm";
import { Add } from "../../icons";
import { AreaTable } from "./AreaTable";

var removeTarget:number;
var defaultDto:AreaDto = {
    // base
    uuid: "",
    name: "",
    multiOccupancy: 0,
    accessControl: 0,
    occControl: 0,
    occSet: 0,
    occMax: 0,
    occUp: 0,
    occDown: 0,
    areaFlag: 0,
    componentId: 0,
    macAddress: "",
    locationId: 1,
    locationName: "Main Location",
    isActive: true
}

export const Area = () => {
  const { toggleToast } = useToast();
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    const [areaDto, setAreaDto] = useState<AreaDto>(defaultDto);
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

    const handleRemove = (data: AreaDto) => {
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
    const [cardFormatsDto, setCardFormatsDto] = useState<AreaDto[]>([]);
    const createCardformat = async () => {
        var res = await HttpRequest.send(HttpMethod.POST,AreaEndPoint.CREATE_AREA,areaDto)
        if(Helper.handleToastByResCode(res,ToastMessage.CREATE_CARD_FORMAT,toggleToast)){
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }
    const fetchData = async () => {
        var res = await HttpRequest.send(HttpMethod.GET, AreaEndPoint.GET_AREA);
        if (res) {
            setCardFormatsDto(res.data.data);
        }

    };

    const removeCardFormat = async (cardFormatNo: number) => {
        var res = await HttpRequest.send(HttpMethod.DELETE, AreaEndPoint.DELETE_AREA + cardFormatNo);
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
    const [selectedObjects, setSelectedObjects] = useState<AreaDto[]>([]);
    const handleCheckedAll = (data: AreaDto[], e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleChecked = (data: AreaDto, e: React.ChangeEvent<HTMLInputElement>) => {
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
                <AreaForm data={areaDto} setAreaDto={setAreaDto} isUpdate={update} handleClickWithEvent={handleClick} />
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
                            <AreaTable data={cardFormatsDto} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObjects} />
                        </div>
                    </div>

                </div>
            }


        </>
    )
}