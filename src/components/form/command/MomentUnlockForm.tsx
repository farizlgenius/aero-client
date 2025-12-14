import { PropsWithChildren } from "react";
import { CommandFormInterface } from "../../../model/CommandForm";
import Label from "../Label";
import Select from "../Select";
import { DoorIcon } from "../../../icons";
import Button from "../../ui/button/Button";

export const MomentUnlockForm:React.FC<PropsWithChildren<CommandFormInterface>> = ({action,setAction,options,handleClickIn}) => {
    return (
        <>
            <div>
                <Label>Doors</Label>
                <Select icon={<DoorIcon />} options={options} name={"arg1"} defaultValue={action.arg1} onChange={(value:string) => setAction(prev => ({...prev,arg1:Number(value),macAddress:options.find(x => x.value == Number(value))?.description ?? ""}))} />
            </div>
            <div className="flex justify-center gap-3">
                <Button name="add" onClick={handleClickIn} className="flex-1" variant="primary" >Add</Button>
                <Button name="close" onClick={handleClickIn} className="flex-1" variant="danger">Cancel</Button>
            </div>
        </>
    )
}