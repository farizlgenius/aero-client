import { PropsWithChildren, useEffect, useState } from "react"
import { FormProp } from "../../../model/Form/FormProp"
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto"
import Label from "../Label"
import Switch from "../switch/Switch"
import Button from "../../ui/button/Button"
import { ModeDto } from "../../../model/ModeDto"

export const UserSettingForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({ handleClickWithEvent,dto, setDto }) => {
      const [userFlag, setUserFlag] = useState<ModeDto[]>([])
    const fetchUserFlag = () => {
    }
    useEffect(() => {
        fetchUserFlag();
    }, [])

    return (
        <>
            <Label>User Settings</Label>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                {userFlag.map((d, i) => <div className='m-3'>
                    <Switch
                        key={i}
                        label={d.name}
                        defaultChecked={false}
                        onChange={(checked: boolean) => setDto(prev => ({ ...prev, flag: checked ? prev.flag | d.value : prev.flag & (~d.value) }))}
                    />
                </div>)}
            </div>
            <div className='flex m-5 gap-5 justify-center items-center'>
                <Button name='create' onClickWithEvent={handleClickWithEvent} className="w-50" size="sm">Create</Button>
                <Button name='cancle' onClickWithEvent={handleClickWithEvent} className="w-50" size="sm" variant='danger'>Cancle</Button>
            </div>
        </>
    )
}