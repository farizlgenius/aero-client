import { PropsWithChildren } from "react"
import Input from "../input/InputField"
import Label from "../Label"
import { CommandFormInterface } from "../../../model/CommandForm"
import Button from "../../ui/button/Button"

export const DelayCommandForm: React.FC<PropsWithChildren<CommandFormInterface>> = ({ action, setAction, options, handleClickIn }) => {
    return (
        <>
            <div>
                <Label htmlFor='time'>Time Delay (Second)</Label>
                <Input name="time" type="number" defaultValue={action.arg1} onChange={(e) => setAction(prev => ({ ...prev, arg1: Number(e.target.value) }))} />
            </div>
            <div className="flex justify-center gap-3">
                <Button name="add" onClick={handleClickIn} className="flex-1" variant="primary" >Add</Button>
                <Button name="close" onClick={handleClickIn} className="flex-1" variant="danger">Cancel</Button>
            </div>
        </>
    )
}