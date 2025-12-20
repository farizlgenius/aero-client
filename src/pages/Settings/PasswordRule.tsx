import { useEffect, useState } from "react"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import Input from "../../components/form/input/InputField"
import Switch from "../../components/form/switch/Switch"
import { PasswordRuleDto } from "../../model/Setting/PasswordRuleDto"
import Button from "../../components/ui/button/Button"
import { send } from "../../api/api"
import { SettingEndpoint } from "../../endpoint/SettingEndpoint"
import Helper from "../../utility/Helper"
import { useToast } from "../../context/ToastContext"
import { SettingToast } from "../../model/ToastMessage"
import Label from "../../components/form/Label"
import TextArea from "../../components/form/input/TextArea"

export const PasswordRule = () => {
    const defaultDto: PasswordRuleDto = {
        len: 4,
        isUpper: false,
        isLower: false,
        isSymbol: false,
        isDigit: false,
        weaks: []
    }
    const { toggleToast } = useToast();
    const [dto, setDto] = useState<PasswordRuleDto>(defaultDto)
    const [len, setLen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [weak,setWeak] = useState<string>("");
    const toggleRefresh = () => setRefresh(!refresh)

    const setPasswordRule = async () => {
        const res = await send.post(SettingEndpoint.UPDATE_PASSWORD, dto);
        if (Helper.handleToastByResCode(res, SettingToast.UPDATE_PASSWORD, toggleToast)) {
            toggleRefresh();
        }
    }

    const getPasswordRule = async () => {
        const res = await send.get(SettingEndpoint.GET_PASSWORD);
        if (res && res.data.data) {
            setDto(res.data.data)
        }
    }

    useEffect(() => {
        getPasswordRule();
    }, [refresh])

    return (
        <>
            <PageBreadcrumb pageTitle="Password Rule Setting" />
            <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800 border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]" >
                <div className="flex flex-col gap-5 justify-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex gap-3">
                        <Switch label={"Password Len"} onChange={(checked) => {
                            setLen(checked)
                        }} />
                        <Input disabled={!len} min="4" type="number" defaultValue={dto.len} placeholder={String(dto.len)} onChange={(e) => setDto(prev => ({ ...prev, len: Number(e.target.value) }))} />
                    </div>
                    <div >
                        <Switch label={"Require Upppercase [A-Z]"} onChange={(c) => setDto(prev => ({ ...prev, isUpper: c }))} defaultChecked={dto.isUpper} />
                    </div>
                    <div >
                        <Switch label={"Require Lowercase [a-z]"} onChange={(c) => setDto(prev => ({ ...prev, isLower: c }))} defaultChecked={dto.isLower} />
                    </div>
                    <div >
                        <Switch label={"Require Digit [0-9]"} onChange={(c) => setDto(prev => ({ ...prev, isDigit: c }))} defaultChecked={dto.isDigit} />
                    </div>
                    <div >
                        <Switch label={"Require Symbol [!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]"} onChange={(c) => setDto(prev => ({ ...prev, isSymbol: c }))} defaultChecked={dto.isSymbol} />
                    </div>
                    <div >
                        <Label>Weak Pattern</Label>
                        <div className="flex gap-2 w-1/4">
                            <Input onChange={(e) => setWeak(e.target.value.trim())} value={weak} placeholder="Place weak pattern here"/>
                            <Button onClick={() => {
                                setDto(prev => ({...prev,weaks:!prev.weaks.includes(weak) ? [...prev.weaks,weak] : prev.weaks})) 
                                setWeak("")
                            } }>Add</Button>
                        </div>
                    </div>
                    <div>
                        <Label>Weak Pattern List</Label>
                        <TextArea disabled value={
                            dto.weaks.map((a: string) => (
                                a
                            )).join("  ,  ")
                        }/>
                    </div>
                    <div className='mt-3 flex gap-5'>
                        <Button onClick={() => {
                            setPasswordRule();
                        }} size='sm'>Save</Button>
                    </div>
                </div>

            </div>
        </>
    )
}