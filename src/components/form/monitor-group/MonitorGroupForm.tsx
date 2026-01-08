import { PropsWithChildren, useEffect, useState } from "react";
import Input from "../input/InputField";
import Label from "../Label";
import { FormProp } from "../../../model/Form/FormProp";
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
import ActionElement from "../../../pages/UiElements/ActionElement";
import { MonitorGroupListDto } from "../../../model/MonitorGroup/MonitorGroupListDto";
import { MonitorPointEndpoint } from "../../../endpoint/MonitorPointEndpoint";
import { MonitorPointDto } from "../../../model/MonitorPoint/MonitorPointDto";
import { DoorEndpoint } from "../../../endpoint/DoorEndpoint";
import { DoorDto } from "../../../model/Door/DoorDto";

export const MonitorGroupForm: React.FC<PropsWithChildren<FormProp<MonitorGroupDto>>> = ({  handleClick,dto, setDto, isUpdate }) => {
    const defaultDto: MonitorGroupListDto = {
        pointType: -1,
        pointTypeDesc: "",
        pointNumber: -1
    }
    const { locationId } = useLocation();
    const [add, setAdd] = useState<boolean>(false);
    const [hardwareOptions, setHardwareOptions] = useState<Options[]>([])
    const [typeOptions, setTypeOptions] = useState<Options[]>([]);
    const [numberOptions,setNumberOptions] = useState<Options[]>([]);
    const [mp, setMp] = useState<MonitorGroupListDto>(defaultDto);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.name) {
            case "macAddress":
                setDto(prev => ({ ...prev, macAddress: value }))
                break;
            case "pointType":
                console.log(value)
                setMp(prev => ({ ...prev, pointType: Number(value),pointTypeDesc:typeOptions.find(x => x.value == Number(value))?.label ?? "" }));
                switch(Number(value)){
                    case 1:
                        fetchMonitor(dto.macAddress);
                        break;
                    case 2:
                    case 3:
                        fetchDoor(dto.macAddress);
                        break;
                    default:
                        break;
                }
                break;
            case "pointNumber":
            setMp(prev => ({...prev,pointNumber:Number(value)}))    
            break;
            default:
                break;
        }

    }
    const handleClicks = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
        switch(e.currentTarget.name){
            case "add":
                console.log("test")
                setDto(prev => ({...prev,nMpList:[...prev.nMpList,mp],nMpCount:prev.nMpCount+1}))
                setMp(defaultDto)
                setAdd(false)
                break;
            case "close":
                setAdd(false)
                setMp(defaultDto);
                break;
        }
    }
    const fetchHardware = async () => {
        const res = await send.get(HardwareEndpoint.GET(locationId))
        if (res && res.data.data) {
            res.data.data.map((a: HardwareDto) => {
                setHardwareOptions(prev => ([...prev, {
                    label: a.name,
                    value: a.macAddress,
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

    const fetchMonitor = async (mac:string) =>{
        const res = await send.get(MonitorPointEndpoint.MP_BY_MAC(mac))
        if(res && res.data.data){
            res.data.data.map((a:MonitorPointDto) => {
                setNumberOptions(prev => ([...prev,{
                    label:a.name,
                    value:a.componentId
                }]))
            })
        }
    }

    const fetchDoor = async (mac:string) => {
        const res = await send.get(DoorEndpoint.GET_ACR_BY_MAC(mac))
        if(res && res.data.data){
            res.data.data.map((a:DoorDto) => {
                setNumberOptions(prev => ([...prev,{
                    label:a.name,
                    value:a.componentId
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
                {add ?
                    <>
                        <div className='flex flex-col gap-2 w-1/2'>
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
                        </div>
                          <div className='flex flex-col gap-2 w-1/2'>
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
                        </div>
                        <div className='mt-3 flex gap-5'>
                            <Button onClickWithEvent={handleClicks} name="add" size='sm'>Add</Button>
                            <Button variant='danger' onClickWithEvent={handleClicks} name='close' size='sm'>Cancel</Button>
                        </div>
                    </>


                    :
                    <>
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
                                    defaultValue={dto.macAddress}
                                    onChangeWithEvent={handleSelect}
                                    name="macAddress"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 swim-lane w-1/2">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                                    Mp's {dto.nMpList.length}
                                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                                        {/* {createIntervalDtoList.length}/12 */}
                                    </span>
                                </h3>
                                <a onClick={() => setAdd(true)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            {dto.nMpList.map((a: MonitorGroupListDto, i: number) => (
                                <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                        <div className="flex items-start w-full gap-4">
                                            <label className="w-full cursor-pointer">
                                                <div className="relative flex items-start">
                                                    <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                                        {a.pointTypeDesc} - {a.pointNumber}
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                                            <ActionElement<MonitorGroupListDto> onEditClick={(data) => {
                                                setAdd(true);
                                                setMp(data);
                                            }} onRemoveClick={(data) => setDto(prev => ({...prev,nMpList:prev.nMpList.filter(x => x.pointNumber != data.pointNumber && x.pointType != data.pointType)}))} data={mp}  />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='mt-3 flex gap-5'>
                            <Button onClickWithEvent={handleClick} name={isUpdate ? "update" : "create"} size='sm'>{isUpdate ? "Update" : "Create"}</Button>
                            <Button variant='danger' onClickWithEvent={handleClick} name='close' size='sm'>Cancel</Button>
                        </div>
                    </>

                }
            </div>

        </>
    )
}