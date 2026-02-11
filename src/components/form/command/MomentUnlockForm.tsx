import { PropsWithChildren } from "react";
import { CommandFormInterface } from "../../../model/CommandForm";
import Label from "../Label";
import Select from "../Select";
import { DoorIcon } from "../../../icons";
import Button from "../../ui/button/Button";
import Input from "../input/InputField";
import { FormType } from "../../../model/Form/FormProp";

export const MomentUnlockForm:React.FC<PropsWithChildren<CommandFormInterface>> = ({action,setAction,options,handleClickIn,type}) => {
    return (
        <>
            <div>
                <Label>Doors</Label>
                <Select disabled={type == FormType.INFO} icon={<DoorIcon />} options={options} name={"arg1"} defaultValue={action.arg1} onChange={(value:string) => setAction(prev => ({...prev,arg1:Number(value),mac:options.find(x => x.value == Number(value))?.description ?? ""}))} />
            </div>
            <div>
                <Label htmlFor='time'>Time Delay (Second)</Label>
                <Input disabled={type == FormType.INFO} min="0" name="time" type="number" defaultValue={action.delayTime} onChange={(e) => setAction(prev => ({ ...prev, delayTime: Number(e.target.value) }))} />
            </div>
            
            <div className="flex justify-center gap-3">
                <Button disabled={type == FormType.INFO} name="add" onClick={handleClickIn} className="flex-1" variant="primary" >Add</Button>
                <Button name="close" onClick={handleClickIn} className="flex-1" variant="danger">Cancel</Button>
            </div>
        </>
    )
}