import { PropsWithChildren } from "react"
import { MonitorIcon } from "../../../icons"
import Button from "../../ui/button/Button"
import Radio from "../input/Radio"
import Label from "../Label"
import Select from "../Select"
import { CommandFormInterface } from "../../../model/CommandForm"
import Input from "../input/InputField"


export const MonitorMaskForm:React.FC<PropsWithChildren<CommandFormInterface>> = ({options,action,handleClickIn,setAction}) => {
    const handleRadio = (value:string) => {
        setAction(prev => ({...prev,arg2:Number(value)}))
    }
    return (
        <>
            <div>
                <Label>Monitor Point</Label>
                <Select icon={<MonitorIcon />} options={options} name={"arg1"} defaultValue={action.arg1} onChange={(value:string) => setAction(prev => ({...prev,arg1:Number(value),macAddress:options.find(x => x.value == Number(value))?.description ?? ""}))} />
            </div>
            <div>
                <Label htmlFor='mode' >Mask Option</Label>
                <div className="flex justify-around gap-3 pb-3">
                    <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                            id="1"
                            name="mask"
                            value="1"
                            checked={action.arg2 === 1}
                            onChange={handleRadio}
                            label="Mask"
                        />
                    </div>
                    <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                            id="2"
                            name="unmask"
                            value="0"
                            checked={action.arg2 === 0}
                            onChange={handleRadio}
                            label="Unmask"
                        />
                    </div>
                </div>
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