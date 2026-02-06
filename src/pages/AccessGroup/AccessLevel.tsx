import { GroupIcon } from '../../icons';
import { useEffect, useState } from 'react';
import AccessLevelForm from './AccessLevelForm';
import { AccessLevelDto } from '../../model/AccessGroup/AccessLevelDto';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Helper from '../../utility/Helper';
import { AccessAreaToast, AccessLevelToast } from '../../model/ToastMessage';
import { useToast } from '../../context/ToastContext';
import { CreateUpdateAccessLevelDto } from '../../model/AccessGroup/CreateUpdateAccessLevelDto';
import { useLocation } from '../../context/LocationContext';
import { send } from '../../api/api';
import { AccessLevelEndPoint } from '../../endpoint/AccessLevelEndpoint';
import { BaseTable } from '../UiElements/BaseTable';
import { useAuth } from '../../context/AuthContext';
import { FeatureId } from '../../enum/FeatureId';
import { BaseForm } from '../UiElements/BaseForm';
import { FormContent } from '../../model/Form/FormContent';
import { FormType } from '../../model/Form/FormProp';
import { usePopup } from '../../context/PopupContext';



// Access Group Page 
export const HEADER: string[] = [
    "Name", "Action"
]

export const KEY: string[] = [
    "name"
];

const AccessLevel = () => {
    const { toggleToast } = useToast();
    const { locationId } = useLocation();
    const { filterPermission } = useAuth();
    const { setCreate, setUpdate, setRemove, setConfirmCreate, setConfirmRemove, setConfirmUpdate, setInfo, setMessage } = usePopup();
    const defaultDto: CreateUpdateAccessLevelDto = {
        // Detail
        name: "",
        components: [],
        componentId: 0,
        locationId: locationId,
        isActive: false
    }
    const [accesLevelDto, setAccessLevelDto] = useState<CreateUpdateAccessLevelDto>(defaultDto);
    const [accessLevelDtos, setAccessLevelDtos] = useState<AccessLevelDto[]>([]);
    const [refresh, setRefresh] = useState(false);
    const toggleRefresh = () => setRefresh(!refresh);
    {/* Modal */ }
    const [form, setForm] = useState<boolean>(false);
    const [formType, setFormType] = useState<FormType>(FormType.CREATE);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
        switch (e.currentTarget.name) {
            case "add":
                setForm(true);
                setFormType(FormType.CREATE);
                break;
            case "delete":
                if (selectedObjects.length == 0) {
                    setMessage("Please select object")
                    setInfo(true);
                }
                setConfirmRemove(() => async () => {
                    var data: number[] = [];
                    selectedObjects.map(async (a: AccessLevelDto) => {
                        data.push(a.componentId)
                    })
                    var res = await send.post(AccessLevelEndPoint.DELETE_RANGE, data)
                    if (Helper.handleToastByResCode(res, AccessLevelToast.DELETE_RANGE, toggleToast)) {
                        setSelectedObjects([])
                        toggleRefresh();
                    }
                })
                setRemove(true);
                break;
            case "create":
                setConfirmCreate(() => async () => {
                    const res = await send.post(AccessLevelEndPoint.CREATE, accesLevelDto);
                    if (Helper.handleToastByResCode(res, AccessLevelToast.CREATE, toggleToast)) {
                        setAccessLevelDto(defaultDto);
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setCreate(true);
                break;
            case "update":
                setConfirmUpdate(() => async () => {
                    const res = await send.put(AccessLevelEndPoint.UPDATE, accesLevelDto);
                    if (Helper.handleToastByResCode(res, AccessLevelToast.UPDATE, toggleToast)) {
                        setAccessLevelDto(defaultDto)
                        setForm(false);
                        toggleRefresh();
                    }
                })
                setUpdate(true)
                break;
            case "close":
            case "cancle":
                setForm(false);
                setAccessLevelDto(defaultDto)
                break;
            default:
                break;
        }

    }

    {/* handle Table Action */ }
    const handleInfo = (data: AccessLevelDto) => {
        setFormType(FormType.UPDATE)
        // setAccessLevelDto(data)
        setForm(true);
    }
    const handleEdit = (data: AccessLevelDto) => {
        setFormType(FormType.UPDATE)
        // setAccessLevelDto(data)
        setForm(true);
    }

    const handleRemove = (data: AccessLevelDto) => {
        setConfirmRemove(() => async () => {
            const res = await send.delete(AccessLevelEndPoint.DELETE(data.componentId))
            if (Helper.handleToastByResCode(res, AccessLevelToast.DELETE, toggleToast))
                toggleRefresh();
        })
        setRemove(true);
    }


    {/* Group Data */ }
    const fetchData = async () => {
        const res = await send.get(AccessLevelEndPoint.GET(locationId))
        if (res && res.data.data) {
            console.log(res.data.data)
            setAccessLevelDtos(res.data.data);
        }
    };




    {/* UseEffect */ }
    useEffect(() => {

        fetchData();

    }, [refresh]);

    {/* checkBox */ }
    const [selectedObjects, setSelectedObjects] = useState<AccessLevelDto[]>([]);

    const tabContent: FormContent[] = [
        {
            label: "Access Level",
            icon: <GroupIcon />,
            content: <AccessLevelForm dto={accesLevelDto} handleClick={handleClick} setDto={setAccessLevelDto} type={formType} />
        }
    ]

    return (
        <>
            <PageBreadcrumb pageTitle="Access Level" />
            {form ?
                <BaseForm tabContent={tabContent} />
                :
                <BaseTable<AccessLevelDto> headers={HEADER} keys={KEY} data={accessLevelDtos} onEdit={handleEdit} onRemove={handleRemove} onClick={handleClick} select={selectedObjects} setSelect={setSelectedObjects} permission={filterPermission(FeatureId.ACCESSLEVEL)} onInfo={handleInfo} />
            }

        </>
    )
}

export default AccessLevel