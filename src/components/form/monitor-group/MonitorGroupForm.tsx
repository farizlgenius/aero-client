import { PropsWithChildren, useEffect, useState } from "react";
import Input from "../input/InputField";
import Label from "../Label";
import { FormProp, FormType } from "../../../model/Form/FormProp";
import { MonitorGroupDto } from "../../../model/MonitorGroup/MonitorGroupDto";
import Select from "../Select";
import Button from "../../ui/button/Button";
import { useLocation } from "../../../context/LocationContext";
import { send } from "../../../api/api";
import { HardwareEndpoint } from "../../../endpoint/HardwareEndpoint";
import { Options } from "../../../model/Options";
import { HardwareDto } from "../../../model/Hardware/HardwareDto";
import { ModeDto } from "../../../model/ModeDto";
import { MonitorGroupEndpoint } from "../../../endpoint/MonitorGroupEndpoint";
import { MonitorGroupListDto } from "../../../model/MonitorGroup/MonitorGroupListDto";
import { MonitorPointEndpoint } from "../../../endpoint/MonitorPointEndpoint";
import { MonitorPointDto } from "../../../model/MonitorPoint/MonitorPointDto";
import { DoorEndpoint } from "../../../endpoint/DoorEndpoint";
import { DoorDto } from "../../../model/Door/DoorDto";
import { MonitorIcon } from "../../../icons";

export const MonitorGroupForm: React.FC<PropsWithChildren<FormProp<MonitorGroupDto>>> = ({ handleClick, dto, setDto, type }) => {
    const defaultDto: MonitorGroupListDto = {
        pointType: -1,
        pointTypeDesc: "",
        pointNumber: -1
    }
    const { locationId } = useLocation();
    const [hardwareOptions, setHardwareOptions] = useState<Options[]>([])
    const [typeOptions, setTypeOptions] = useState<Options[]>([]);
    const [numberOptions, setNumberOptions] = useState<Options[]>([]);
    const [selected,setSelected] = useState<MonitorGroupListDto[]>([]); 
    const [mp, setMp] = useState<MonitorGroupListDto>(defaultDto);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.name) {
            case "macAddress":
                setDto(prev => ({ ...prev, mac: value }))
                break;
            case "pointType":
                console.log(value)
                setMp(prev => ({ ...prev, pointType: Number(value), pointTypeDesc: typeOptions.find(x => x.value == Number(value))?.label ?? "" }));
                switch (Number(value)) {
                    case 1:
                        fetchMonitor(dto.mac);
                        break;
                    case 2:
                    case 3:
                        fetchDoor(dto.mac);
                        break;
                    default:
                        break;
                }
                break;
            case "pointNumber":
                setMp(prev => ({ ...prev, pointNumber: Number(value) }))
                break;
            default:
                break;
        }

    }

    const handleClickAdd = () => {
        setDto(prev => ({ ...prev, nMpList: prev.nMpList.includes(mp) ? [...prev.nMpList] : [...prev.nMpList, mp] }))
        setMp(defaultDto);
    }

    const fetchHardware = async () => {
        const res = await send.get(HardwareEndpoint.GET(locationId))
        if (res && res.data.data) {
            res.data.data.map((a: HardwareDto) => {
                setHardwareOptions(prev => ([...prev, {
                    label: a.name,
                    value: a.mac,
                }]))
            })
        }
    }
    const fetchTypeOptions = async () => {
        const res = await send.get(MonitorGroupEndpoint.GET_TYPE)
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setTypeOptions(prev => ([...prev, {
                    label: a.name,
                    value: a.value,
                }]))
            })
        }
    }

    const fetchMonitor = async (mac: string) => {
        const res = await send.get(MonitorPointEndpoint.MP_BY_MAC(mac))
        if (res && res.data.data) {
            res.data.data.map((a: MonitorPointDto) => {
                setNumberOptions(prev => ([...prev, {
                    label: a.name,
                    value: a.componentId
                }]))
            })
        }
    }

    const fetchDoor = async (mac: string) => {
        const res = await send.get(DoorEndpoint.GET_ACR_BY_MAC(mac))
        if (res && res.data.data) {
            res.data.data.map((a: DoorDto) => {
                setNumberOptions(prev => ([...prev, {
                    label: a.name,
                    value: a.componentId
                }]))
            })
        }
    }

    useEffect(() => {
        fetchHardware();
        fetchTypeOptions();
    }, []);
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

                <div className='flex gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" type="text" id="name" onChange={handleChange} value={dto.name} />
                    </div>
                </div>
                <div className='flex gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="name">Hardware</Label>
                        <Select
                            isString={true}
                            options={hardwareOptions}
                            defaultValue={dto.mac}
                            onChangeWithEvent={handleSelect}
                            name="macAddress"
                        />
                    </div>
                </div>
                <div className='flex gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="pointType">Type</Label>
                        <div className="flex gap-5">
                            <Select
                                isString={false}
                                options={typeOptions}
                                defaultValue={mp.pointType}
                                onChangeWithEvent={handleSelect}
                                name="pointType"
                                
                            />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <Label htmlFor="pointNumber">Point Number</Label>
                        <div className="flex gap-5">
                            <Select
                                isString={false}
                                options={numberOptions}
                                defaultValue={mp.pointNumber}
                                onChangeWithEvent={handleSelect}
                                name="pointNumber"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end items-end">
                        <Button name="add" onClick={handleClickAdd}>Add</Button>
                    </div>
                </div>
                <div className='flex flex-col gap-2 w-1/2'>
                    <Label>Points</Label>
                    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <div className="grid grid-cols-5 gap-4">
                            {dto.nMpList.map((s, i) => (
                                <div key={i} className={`cursor-pointer flex flex-col rounded-2xl border border-gray-200 hover:dark:bg-white/[0.01] hover:bg-gray-200 ${selected.includes(s) ? "bg-gray-200 dark:bg-white/[0.01]" : "dark:bg-white/[0.03] bg-white"} p-5 dark:border-gray-800  md:p-6`}>
                                    <div className="flex flex-col justify-center items-center gap-2">
                                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                                            <MonitorIcon />
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{s.pointTypeDesc} + {s.pointNumber}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div className='mt-3 flex gap-5'>
                    <Button onClickWithEvent={handleClick} disabled={type == FormType.INFO} name={type == FormType.UPDATE ? "update" : "create"} size='sm'>{type == FormType.UPDATE ? "Update" : "Create"}</Button>
                    <Button variant='danger' onClickWithEvent={handleClick} name='close' size='sm'>Cancel</Button>
                </div>


            </div>

        </>
    )
}