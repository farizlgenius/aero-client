import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { AreaDto } from "../../model/Area/AreaDto";
import HttpRequest from "../../utility/HttpRequest";
import { AreaEndPoint } from "../../constants/constant";
import Helper from "../../utility/Helper";
import { ToastMessage } from "../../model/ToastMessage";
import DangerModal from "../UiElements/DangerModal";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { AddIcon, AreaIcon } from "../../icons";
import { HttpMethod } from "../../enum/HttpMethod";
import { BaseForm } from "../UiElements/BaseForm";
import { FormContent } from "../../model/Form/FormContent";
import { AreaForm } from "../../components/form/area/AreaForm";
import { BaseTable } from "../UiElements/BaseTable";
import { OccupancyForm } from "../../components/form/area/OccupancyForm";

var removeTarget: number;
var defaultDto: AreaDto = {
    // base
    uuid: "",
    name: "",
    multiOccupancy: -1,
    accessControl: -1,
    occControl: 0,
    occSet: 0,
    occMax: 0,
    occUp: 0,
    occDown: 0,
    areaFlag: 0x00,
    componentId: 0,
    locationId: 1,
    locationName: "Main",
    isActive: true
}
const AREA_HEADERS = ["Name","Action"]
const AREA_KEY = ["name"]

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
                createArea();
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
    const [areasDto, setAreasDto] = useState<AreaDto[]>([]);
    const createArea = async () => {
        var res = await HttpRequest.send(HttpMethod.POST, AreaEndPoint.CREATE_AREA, areaDto)
        if (Helper.handleToastByResCode(res, ToastMessage.CREATE_AREA, toggleToast)) {
            setCreate(false)
            setUpdate(false)
            toggleRefresh();
        }
    }
    const fetchData = async () => {
        var res = await HttpRequest.send(HttpMethod.GET, AreaEndPoint.GET_AREA);
        if (res) {
            console.log(res.data.data)
            setAreasDto(res.data.data);
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

    {/* Form */ }
    const createContent: FormContent[] = [
        {
            icon: <AreaIcon />,
            label: "Area",
            content: <AreaForm dto={areaDto} setDto={setAreaDto} handleClickWithEvent={handleClick} />
        },{
            icon: <AreaIcon />,
            label: "Occupancy",
            content: <OccupancyForm dto={areaDto} setDto={setAreaDto} handleClickWithEvent={handleClick} />
        }
    ];


    return (
        <>
            {isRemoveModal && <DangerModal header='Remove Card Format' body='Please Click Confirm if you want to remove this Control Point' onCloseModal={handleOnClickCloseRemove} onConfirmModal={handleOnClickConfirmRemove} />}
            <PageBreadcrumb pageTitle="Access Area" />
            {create || update ?
                <BaseForm tabContent={createContent}/>
                :
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Button
                            name='add'
                            size="sm"
                            variant="primary"
                            startIcon={<AddIcon className="size-5" />}
                            onClickWithEvent={handleClick}
                        >
                            Add
                        </Button>

                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            {/* <AreaTable data={areasDto} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove} selectedObject={selectedObjects} /> */}
                            <BaseTable<AreaDto> headers={AREA_HEADERS} keys={AREA_KEY} data={areasDto} selectedObject={selectedObjects} handleCheck={handleChecked} handleCheckAll={handleCheckedAll} handleEdit={handleEdit} handleRemove={handleRemove}  />
                        </div>
                    </div>

                </div>
            }


        </>
    )
}