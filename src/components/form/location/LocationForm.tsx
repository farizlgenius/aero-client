import { PropsWithChildren } from "react"
import { FormProp, FormType } from "../../../model/Form/FormProp"
import { LocationDto } from "../../../model/Location/LocationDto"
import Button from "../../ui/button/Button"
import Label from "../Label"
import Input from "../input/InputField"
import TextArea from "../input/TextArea"

export const LocationForm: React.FC<PropsWithChildren<FormProp<LocationDto>>> = ({ type, handleClick: handleClickWithEvent, setDto, dto }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="locationName">Name</Label>
                        <Input disabled={type == FormType.Info} placeholder="Location Name" name="locationName" type="text" id="locationName" onChange={handleChange} value={dto.locationName} />
                    </div>

                </div>
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="description">Description</Label>
                        <TextArea disabled={type == FormType.Info} placeholder="Location Description" onChange={(e: string) => setDto(prev => ({ ...prev, description: e }))} value={dto.description} />
                    </div>
                </div>
                                    <div className='mt-3 flex gap-2'>
                    <Button disabled={type == FormType.Info} onClickWithEvent={handleClickWithEvent} name={type == FormType.Update ? "update" : "create"} size='sm'>{type == FormType.Update ? "Update" : "Create"}</Button>
                    <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                </div>
                
            </div>
        </>
    )
}