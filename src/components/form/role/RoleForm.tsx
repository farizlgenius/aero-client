import { PropsWithChildren } from "react";
import { FormProp } from "../../../model/Form/FormProp";
import { RoleDto } from "../../../model/Role/RoleDto";
import Button from "../../ui/button/Button";
import Label from "../Label";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";

export const RoleForm: React.FC<PropsWithChildren<FormProp<RoleDto>>> = ({ isUpdate, handleClickWithEvent, dto, setDto }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" type="text" id="name" onChange={handleChange} value={dto.name} />
                    </div>

                </div>
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="description">Description</Label>
                        <TextArea onChange={(e: string) => setDto(prev => ({ ...prev, description: e }))} value={dto.description} />
                    </div>
                </div>
                <div className='mt-3 flex gap-2'>
                    <Button onClickWithEvent={handleClickWithEvent} name={isUpdate ? "update" : "create"} size='sm'>{isUpdate ? "Update" : "Create"}</Button>
                    <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                </div>
            </div>
        </>
    )
}