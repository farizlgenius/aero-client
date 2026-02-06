import { PropsWithChildren, useEffect, useState } from "react"
import { FormProp, FormType } from "../../../model/Form/FormProp"
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto"
import Label from "../Label"
import Switch from "../switch/Switch"
import Button from "../../ui/button/Button"
import { ModeDto } from "../../../model/ModeDto"
import { send } from "../../../api/api"
import { CredentialEndpoint } from "../../../endpoint/CredentialEndpoint"

export const UserSettingForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({  setDto,type,handleClick }) => {
      const [userFlag, setUserFlag] = useState<ModeDto[]>([])
    const fetchUserFlag = async () => {
        const res = await send.get(CredentialEndpoint.GET_FLAG);
        if(res && res.data.data){
            setUserFlag(res.data.data)
        }
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
                        disabled={type == FormType.INFO}
                        key={i}
                        label={d.name}
                        defaultChecked={d.value == 1 ? true : false}
                        onChange={(checked: boolean) => setDto(prev => ({ ...prev, flag: checked ? prev.flag | d.value : prev.flag & (~d.value) }))}
                    />
                </div>)}
            </div>
            <div className='flex m-5 gap-5 justify-center items-center'>
                <Button  disabled={type == FormType.INFO} name='create' onClickWithEvent={handleClick} className="w-50" size="sm">Create</Button>
                <Button name='cancle' onClickWithEvent={handleClick} className="w-50" size="sm" variant='danger'>Cancle</Button>
            </div>
        </>
    )
}