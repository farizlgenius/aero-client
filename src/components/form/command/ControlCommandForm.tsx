import { PropsWithChildren } from "react"
import { ControlIcon } from "../../../icons"
import Button from "../../ui/button/Button"
import Radio from "../input/Radio"
import Label from "../Label"
import Select from "../Select"
import { CommandFormInterface } from "../../../model/CommandForm"
import Input from "../input/InputField"


export const ControlCommandForm: React.FC<PropsWithChildren<CommandFormInterface>> = ({ options, handleClickIn, action,setAction }) => {
    const handleRadio = (value:string) => {
        setAction(prev => ({...prev,arg2:Number(value)}))
    }
    const render = (i:number) => {
        switch(i){
            case 3:
                return <div>
                    <Label>Pulse Time (second)</Label>
                    <Input name="arg3" type="number" defaultValue={action.arg3} onChange={(e) => setAction(prev => ({...prev,arg3:Number(e.target.value)}))}/>
                </div>
            case 4:
                return <>
                <div>
                    <Label>On Time (0.1 second)</Label>
                    <Input name="arg3" type="number" defaultValue={action.arg3} onChange={(e) => setAction(prev => ({...prev,arg3:Number(e.target.value)}))}/>
                </div>
                <div>
                    <Label>Off Time (0.1 second)</Label>
                    <Input name="arg4" type="number" defaultValue={action.arg3} onChange={(e) => setAction(prev => ({...prev,arg4:Number(e.target.value)}))}/>
                </div>
                                <div>
                    <Label>Repeate Count</Label>
                    <Input name="arg5" type="number" defaultValue={action.arg3} onChange={(e) => setAction(prev => ({...prev,arg5:Number(e.target.value)}))}/>
                </div>
                </>
            default:
                return <></>
        }
    }
    
    return (
        <>
            <div>
                <Label>Control Point</Label>
                <Select icon={<ControlIcon />} options={options} name={"arg1"} defaultValue={-1} onChange={(value:string) => setAction(prev => ({...prev,arg1:Number(value),mac:options.find(x => x.value == Number(value))?.description ?? ""}))} />
            </div>
            <div>
                <Label htmlFor='mode' >Command Option</Label>
                <div className="flex justify-around gap-3 pb-3">
                    <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                            id="1"
                            name="off"
                            value="1"
                            checked={action.arg2 === 1}
                            onChange={handleRadio}
                            label="Off"
                        />
                    </div>
                    <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                            id="2"
                            name="on"
                            value="2"
                            checked={action.arg2 === 2}
                            onChange={handleRadio}
                            label="On"
                        />
                    </div>
                    <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                            id="3"
                            name="single"
                            value="3"
                            checked={action.arg2 === 3}
                            onChange={handleRadio}
                            label="Single"
                        />
                    </div>
                    <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                            id="4"
                            name="repeat"
                            value="4"
                            checked={action.arg2 === 4}
                            onChange={handleRadio}
                            label="Repeat"
                        />
                    </div>
                </div>
                
            </div>
            {render(action.arg2)}
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