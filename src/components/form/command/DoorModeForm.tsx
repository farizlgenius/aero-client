import { PropsWithChildren, useEffect, useState } from "react";
import { CommandFormInterface } from "../../../model/CommandForm";
import { Options } from "../../../model/Options";
import api from "../../../api/api";
import { DoorEndpoint } from "../../../endpoint/DoorEndpoint";
import { ModeDto } from "../../../model/ModeDto";
import Label from "../Label";
import Select from "../Select";
import { DoorIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import Input from "../input/InputField";
import { FormType } from "../../../model/Form/FormProp";

export const DoorModeForm:React.FC<PropsWithChildren<CommandFormInterface>> = ({action,setAction,handleClickIn,options,type}) => {
    const [doorMode,setDoorMode] = useState<Options[]>([]);

    
    const fetchDoorMode = async () => {
        var res = await api.get(DoorEndpoint.GET_ACR_MODE);
        if (res && res.data.data) {
            res.data.data.map((a: ModeDto) => {
                setDoorMode(prev => ([...prev, {
                    label: a.name,
                    value: a.value,
                    description: a.description
                }]))
            })
        }   
    }


    useEffect(() => {
        fetchDoorMode();
    },[])

    return (
                <>
            <div>
                <Label>Doors</Label>
                <Select disabled={type == FormType.INFO} icon={<DoorIcon />} options={options} name={"arg1"} defaultValue={action.arg1} onChange={(value:string) => setAction(prev => ({...prev,arg1:Number(value),mac:options.find(x => x.value == Number(value))?.description ?? ""}))} />
            </div>
            <div>
                <Label htmlFor='mode'>Mode</Label>
                <Select disabled={type == FormType.INFO} name="arg2" options={doorMode} onChange={(value:string) => setAction(prev => ({...prev,arg2:Number(value)}))} />
            </div>
            <div>
                <Label htmlFor='time'>Time Delay (Second)</Label>
                <Input disabled={type == FormType.INFO} min="0" name="time" type="number" defaultValue={action.delayTime} onChange={(e) => setAction(prev => ({ ...prev, delayTime: Number(e.target.value) }))} />
            </div>
            <div className="flex justify-center gap-3">
                <Button name="add" onClick={handleClickIn} className="flex-1" variant="primary" >Add</Button>
                <Button disabled={type == FormType.INFO} name="close" onClick={handleClickIn} className="flex-1" variant="danger">Cancel</Button>
            </div>
        </>
    )
}