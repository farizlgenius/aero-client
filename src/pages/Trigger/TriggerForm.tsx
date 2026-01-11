import { PropsWithChildren, useEffect, useState } from "react"
import Input from "../../components/form/input/InputField"
import Label from "../../components/form/Label"
import { FormProp } from "../../model/Form/FormProp"
import { TriggerDto } from "../../model/Trigger/TriggerDto"
import Button from "../../components/ui/button/Button"
import Select from "../../components/form/Select"
import { Options } from "../../model/Options"
import { send } from "../../api/api"
import { TriggerEndpoint } from "../../endpoint/TriggerEndpoint"
import { ModeDto } from "../../model/ModeDto"
import { useLocation } from "../../context/LocationContext"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table"
import { TransactionCodeDto } from "../../model/Transaction/TransactionCodeDto"
import { TimeZoneEndPoint } from "../../endpoint/TimezoneEndpoint"
import { ProcedureEndpoint } from "../../endpoint/ProcedureEndpoint"
import { TimeZoneDto } from "../../model/TimeZone/TimeZoneDto"
import { ProcedureDto } from "../../model/Procedure/ProcedureDto"

export const TriggerForm: React.FC<PropsWithChildren<FormProp<TriggerDto>>> = ({ handleClick, dto, setDto, isUpdate }) => {
    const { locationId } = useLocation();
    const [command, setCommand] = useState<Options[]>([])
    const [source, setSource] = useState<Options[]>([]);
    const [tran, setTran] = useState<Options[]>([]);
    const [code, setCode] = useState<Options[]>([]);
    const [device, setDevice] = useState<Options[]>([]);
    const [tz,setTz] = useState<Options[]>([]);
    const [procedure,setProcedure] = useState<Options[]>([]);

    const handleChange = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.name) {
            case "command":
                setDto(prev => ({ ...prev, command: Number(value) }))
                break;
            case "procedureId":
                setDto(prev => ({...prev,procedureId:Number(value)}))
                break;
            case "sourceType":
                setDto(prev => ({ ...prev, sourceType: Number(value) }))
                setDevice([])
                setTran([])
                setCode([])
                fetchTranType(Number(value));
                fetchDevice(Number(value));
                break;
            case "tranType":
                setDto(prev => ({ ...prev, tranType: Number(value) }))
                setCode([])
                fetchTranCode(Number(value));
                break;
            case "sourceNumber":
                setDto(prev => ({...prev,sourceNumber:Number(value),mac:device.find(x => x.value == Number(value))?.description ?? ""}))
                break;
            case "codeMap":
                setDto(prev => ({...prev,codeMap:prev.codeMap.some(x => x.value == Number(value)) ? prev.codeMap : [...prev.codeMap,{
                    value:Number(value),
                    name:code.find(x => x.value == Number(value))?.label ?? "",
                    description:code.find(x => x.value == Number(value))?.description ?? ""
                }] }) )
                break;
            case "timeZone":
                setDto(prev => ({...prev,timeZone:Number(value)}))
                break;
            default:
                break;
        }
    }

    const fetchCommand = async () => {
        var res = await send.get(TriggerEndpoint.COMMAND)
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setCommand(prev => ([...prev, {
                    label: a.name,
                    description: a.description,
                    value: a.value
                }]))
            })
        }
    };

    const fetchSource = async () => {
        var res = await send.get(TriggerEndpoint.SOURCE)
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setSource(prev => ([...prev, {
                    label: a.name,
                    description: a.description,
                    value: a.value
                }]))
            })
        }
    }

    const fetchTranType = async (source: number) => {
        var res = await send.get(TriggerEndpoint.TRAN(source))
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setTran(prev => ([...prev, {
                    label: a.name,
                    description: a.description,
                    value: a.value
                }]))
            })
        }
    }

    const fetchTranCode = async (tran: number) => {
        var res = await send.get(TriggerEndpoint.CODE(tran))
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setCode(prev => ([...prev, {
                    label: a.name + " : " + a.description,
                    description: a.description,
                    value: a.value
                }]))
            })
        }
    }

    const fetchDevice = async (source: number) => {
        var res = await send.get(TriggerEndpoint.DEVICE(locationId, source))
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setDevice(prev => ([...prev, {
                    label: a.name,
                    description: a.description,
                    value: a.value
                }]))
            })
        }
    }

    const fetchTimeZone = async () => {
        var res = await send.get(TimeZoneEndPoint.GET);
        if (res && res.data.data) {
            res.data.data.map((a: TimeZoneDto) => {
                setTz(prev => ([...prev, {
                    label: a.name,
                    description: "",
                    value: a.componentId
                }]))
            })
        }
    }

    const fetchProcedure = async () => {
        var res = await send.get(ProcedureEndpoint.GET(locationId));
        if (res && res.data.data) {
            res.data.data.map((a: ProcedureDto) => {
                setProcedure(prev => ([...prev, {
                    label: a.name,
                    description: a.mac,
                    value: a.componentId
                }]))
            })
        }
    }

    useEffect(() => {
        fetchCommand();
        fetchSource();
        fetchTimeZone();
        fetchProcedure();
    }, []);
    return (
        <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div>
                <Label>Name</Label>
                <Input name="name" type="text" placeholder="Trigger name" />
            </div>
            <div>
                <Label>Command</Label>
                <Select name="command" options={command} defaultValue={dto.command} onChangeWithEvent={handleChange} />
            </div>
            <div>
                <Label>Prcedure</Label>
                <Select name="procedureId" options={procedure} defaultValue={dto.procedureId} onChangeWithEvent={handleChange} />
            </div>
            <div>
                <Label>Source Type</Label>
                <Select name="sourceType" options={source} defaultValue={dto.sourceType} onChangeWithEvent={handleChange} />
            </div>
            <div>
                <Label>Source Device</Label>
                <Select name="sourceNumber" options={device} defaultValue={dto.sourceNumber} onChangeWithEvent={handleChange} />
            </div>
            <div>
                <Label>Tran Type</Label>
                <Select name="tranType" options={tran} defaultValue={dto.tranType} onChangeWithEvent={handleChange} />
            </div>
            <div>
                <Label>Tran Code</Label>
                <Select name="codeMap" options={code} defaultValue={-1} onChangeWithEvent={handleChange} />
            </div>
            <div>
                <Label>Time Zone</Label>
                <Select name="timeZone" options={tz} defaultValue={dto.timeZone} onChangeWithEvent={handleChange} />
            </div>
            <div>
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-white dark:bg-gray-900 sticky top-0 z-10">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">No</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Transction</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {dto.codeMap.map((a: TransactionCodeDto, i: number) => (
                            <>
                                <TableRow>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">{i + 1}</TableCell>
                                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">{a.name}</TableCell>
                                </TableRow>
                            </>

                        ))}

                    </TableBody>
                </Table>
            </div>
            <div className="flex gap-4">
                <Button className="flex-1" name="create" onClick={handleClick} variant="primary">Create</Button>
                <Button className="flex-1" name="close" onClick={handleClick} variant="danger">Cancel</Button>
            </div>
        </div>
    )
}