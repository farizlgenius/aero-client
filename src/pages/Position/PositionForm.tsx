import { PropsWithChildren } from "react"
import { FormProp, FormType } from "../../model/Form/FormProp"
import Label from "../../components/form/Label"
import Input from "../../components/form/input/InputField"
import TextArea from "../../components/form/input/TextArea"
import Button from "../../components/ui/button/Button"
import { PositionDto } from "../../model/Position/PositionDto"

export const PositionForm: React.FC<PropsWithChildren<FormProp<PositionDto>>> = ({ type, handleClick: handleClickWithEvent, setDto, dto }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="name">Name</Label>
                        <Input disabled={type == FormType.INFO} placeholder="Position Name" name="name" type="text" id="positionName" onChange={handleChange} value={dto.name} />
                    </div>
                </div>
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="description">Description</Label>
                        <TextArea disabled={type == FormType.INFO} placeholder="Position Description" onChange={(e: string) => setDto(prev => ({ ...prev, description: e }))} value={dto.description} />
                    </div>
                </div>
                <div className='mt-3 flex gap-2'>
                    <Button disabled={type == FormType.INFO} onClickWithEvent={handleClickWithEvent} name={type == FormType.UPDATE ? "update" : "create"} size='sm'>{type == FormType.UPDATE ? "Update" : "Create"}</Button>
                    <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                </div>
            </div>
        </>
    )
}
