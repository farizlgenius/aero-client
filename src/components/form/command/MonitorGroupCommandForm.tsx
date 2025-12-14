import { PropsWithChildren, useEffect, useState } from "react";
import { CommandFormInterface } from "../../../model/CommandForm";
import Button from "../../ui/button/Button";
import Label from "../Label";
import Select from "../Select";
import { MonitorPointGroupIcon } from "../../../icons";
import { Options } from "../../../model/Options";
import api from "../../../api/api";
import { MonitorGroupEndpoint } from "../../../endpoint/MonitorGroupEndpoint";
import { ModeDto } from "../../../model/ModeDto";
import Input from "../input/InputField";

export const MonitorGroupCommandForm:React.FC<PropsWithChildren<CommandFormInterface>> = ({action,setAction,handleClickIn,options}) => {
    const [command,setCommand] = useState<Options[]>([]);

    const fetchMPGCommand = async () => {
        var res = await api.get(MonitorGroupEndpoint.COMMAND)
        if(res && res.data.data){
            res.data.data.map((a:ModeDto) => {
                setCommand(prev => ([...prev,{
                    label:a.name,
                    value:a.value,
                    description:a.description
                }]))
            })
        }
    }
    useEffect(() => {
        fetchMPGCommand();
    },[]);
    return (
         <>
            <div>
                <Label>Monitor Point</Label>
                <Select icon={<MonitorPointGroupIcon />} options={options} name={"arg1"} defaultValue={action.arg1} onChange={(value:string) => setAction(prev => ({...prev,arg1:Number(value),macAddress:options.find(x => x.value == Number(value))?.description ?? ""}))} />
            </div>
            <div>
                <Label htmlFor='mode' >Command</Label>
                <Select options={command} name="arg2" defaultValue={action.arg2} onChange={(value:string) => setAction(prev => ({...prev,arg2:Number(value)}))} />
            </div>
            <div>
                <Label htmlFor='time'>Time Delay (Second)</Label>
                <Input min="0" name="time" type="number" defaultValue={action.delayTime} onChange={(e) => setAction(prev => ({ ...prev, delayTime: Number(e.target.value) }))} />
            </div>
            <div className="flex justify-center gap-3">
                <Button name="add" onClick={handleClickIn} className="flex-1" variant="primary" >Add</Button>
                <Button name="close" onClick={handleClickIn} className="flex-1" variant="danger">Cancel</Button>
            </div>
        </>
    )
}