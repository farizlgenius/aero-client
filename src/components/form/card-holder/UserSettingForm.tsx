import { PropsWithChildren, useEffect, useState } from "react"
import { FormProp, FormType } from "../../../model/Form/FormProp"
import { UserDto } from "../../../model/CardHolder/UserDto"
import Label from "../Label"
import Switch from "../switch/Switch"
import { ModeDto } from "../../../model/ModeDto"
import { send } from "../../../api/api"
import { CredentialEndpoint } from "../../../endpoint/CredentialEndpoint"

export const UserSettingForm: React.FC<PropsWithChildren<FormProp<UserDto>>> = ({  setDto,type }) => {
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
        </>
    )
}
