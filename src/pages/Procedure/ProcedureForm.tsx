import { PropsWithChildren, useEffect, useState } from "react"
import { FormProp } from "../../model/Form/FormProp"
import { ProcedureDto } from "../../model/Procedure/ProcedureDto"
import Label from "../../components/form/Label"
import Input from "../../components/form/input/InputField"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"
import { Options } from "../../model/Options"
import api, { send } from "../../api/api"
import { ProcedureEndpoint } from "../../endpoint/ProcedureEndpoint"
import { ModeDto } from "../../model/ModeDto"
import Select from "../../components/form/Select"
import { ActionDto } from "../../model/Procedure/ActionDto"
import { HardwareEndpoint } from "../../endpoint/HardwareEndpoint"
import { useLocation } from "../../context/LocationContext"
import { HardwareDto } from "../../model/Hardware/HardwareDto"
import Radio from "../../components/form/input/Radio"
import Button from "../../components/ui/button/Button"
import { MonitorPointEndpoint } from "../../endpoint/MonitorPointEndpoint"
import { MonitorPointDto } from "../../model/MonitorPoint/MonitorPointDto"
import { MonitorIcon } from "../../icons"

export const ProcedureForm: React.FC<PropsWithChildren<FormProp<ProcedureDto>>> = ({ handleClick, dto, setDto, isUpdate }) => {
    const defaultDto: ActionDto = {
        scpId: -1,
        actionType: -1,
        actionTypeDesc: "",
        arg1: 0,
        arg2: 0,
        arg3: 0,
        arg4: 0,
        arg5: 0,
        arg6: 0,
        arg7: 0,
        strArg: "",
        uuid: "",
        componentId: 0,
        macAddress: "",
        locationId: 0,
        isActive: false
    }
    const { locationId } = useLocation();
    const [action, setAction] = useState<ActionDto>(defaultDto);
    const [add, setAdd] = useState<boolean>(false);
    const [actionType, setActionType] = useState<Options[]>([]);
    const [hardware, setHardware] = useState<Options[]>([]);
    const [mp, setMp] = useState<Options[]>([]);
    const handleClickAddAction = () => {
        setAdd(true);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleRatioSelect = (value: string) => {
        setAction(prev => ({ ...prev, arg2: Number(value) }))
    }
    const handleClickIn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
            case "add":
                setDto(prev => ({ ...prev, Actions: [...prev.Actions, action] }))
                setAction(defaultDto)
                setAdd(false)
                break;
            case "close":
                setAction(defaultDto)
                break;
            default:
                break;
        }
    }

    const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.name) {
            case "actionType":
                setAction(prev => ({ ...prev, actionType: Number(value),actionTypeDesc:actionType.find(a => a.value == Number(value))?.label ?? "" }))
                switch (Number(value)) {
                    case 1:
                        fetchMp();
                        break;
                }
                break;
            case "arg1":
                setAction(prev => ({ ...prev, arg1: Number(value) }))
                const mac = mp.find(x => x.value === Number(value))?.description ?? "";
                const scpId = hardware.find(x => x.description === mac)?.value ?? 0;
                setAction(prev => ({ ...prev, scpId: Number(scpId) }));
                break;
            default:
                break;
        }

    }

    const actionForm = (actionType: number) => {
        switch (actionType) {
            // Monitor Point Mask
            case 1:
                // Always Mask
                // setAction(prev => ({...prev,arg2:1}))
                return <>
                    <div>
                        <Label>Monitor Point</Label>
                        <Select icon={<MonitorIcon />} options={mp} name={"arg1"} defaultValue={-1} onChangeWithEvent={handleSelect} />
                    </div>
                    <div>
                        <Label htmlFor='mode' >Mask Option</Label>
                        <div className="flex justify-around gap-3 pb-3">
                            <div className="flex flex-col flex-wrap gap-8">
                                <Radio
                                    id="insideType1"
                                    name="mask"
                                    value="1"
                                    checked={action.arg2 === 1}
                                    onChange={handleRatioSelect}
                                    label="Mask"
                                />
                            </div>
                            <div className="flex flex-col flex-wrap gap-8">
                                <Radio
                                    id="insideType2"
                                    name="unmask"
                                    value="0"
                                    checked={action.arg2 === 0}
                                    onChange={handleRatioSelect}
                                    label="Unmask"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-3">
                        <Button name="add" onClick={handleClickIn} className="flex-1" variant="primary" >Add</Button>
                        <Button name="close" onClick={handleClickIn} className="flex-1" variant="danger">Cancel</Button>
                    </div>
                </>
            default:
                return <></>
        }
    }

    const fetchHardware = async () => {
        var res = await api.get(HardwareEndpoint.GET(locationId))
        if (res && res.data.data) {
            res.data.data.map((a: HardwareDto) => {
                setHardware(prev => ([...prev, {
                    label: a.name,
                    value: a.componentId,
                    description: a.macAddress
                }]))
            })
        }
    }

    const fetchMp = async () => {
        var res = await api.get(MonitorPointEndpoint.GET_MP_LIST(locationId));
        if (res && res.data.data) {
            res.data.data.map((a: MonitorPointDto) => {
                setMp(prev => ([...prev, {
                    label: a.name,
                    value: a.componentId,
                    description: a.macAddress
                }]))
            })
        }
    }

    const fetchActionType = async () => {
        var res = await api.get(ProcedureEndpoint.ACTION_TYPE);
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setActionType(prev => ([...prev, {
                    label: a.name,
                    value: a.value,
                    description: a.description
                }]))
            })
        }
    }

    useEffect(() => {
        fetchActionType();
        fetchHardware();
    }, [])

    return (
        <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            {add ?
                <>
                    <div className="w-1/4">
                        <Label>Action Type</Label>
                        <Select options={actionType} name={"actionType"} defaultValue={action?.actionType} onChangeWithEvent={handleSelect} />
                    </div>
                    {/* <div className="w-1/4">
                        <Label>Hardware</Label>
                        <Select options={hardware} name={"scpId"} defaultValue={action.scpId} />
                    </div> */}
                    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 w-1/4">
                        <div className="w-full flex flex-col gap-4">
                            {
                                actionForm(action?.actionType)
                            }
                        </div>

                    </div>

                </>

                :
                <>
                    <div>
                        <Label>Name</Label>
                        <Input type="text" placeholder="Procedure name" onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-end">
                            <a onClick={() => handleClickAddAction()} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                        </div>
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        No.
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Scp Id
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Action Type
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Arg 1
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Arg 2
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Arg 3
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Arg 4
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Arg 5
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Arg 6
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Arg 7
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                        Str Arg
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {dto.Actions.map((a: ActionDto, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {i + 1}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.scpId}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.actionTypeDesc}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.arg1}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.arg2}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.arg3}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.arg4}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.arg5}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.arg6}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.arg7}
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {a.strArg}
                                        </TableCell>
                                    </TableRow>

                                ))}

                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex gap-4">
                        <Button className="flex-1" name="create" onClick={handleClick} variant="primary">Create</Button>
                        <Button className="flex-1" name="close" onClick={handleClick} variant="danger">Cancel</Button>
                    </div>
                </>

            }
        </div>
    )
}