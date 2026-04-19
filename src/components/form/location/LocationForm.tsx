import { PropsWithChildren, useEffect, useState } from "react"
import { FormProp, FormType } from "../../../model/Form/FormProp"
import { LocationDto } from "../../../model/Location/LocationDto"
import Button from "../../ui/button/Button"
import Label from "../Label"
import Input from "../input/InputField"
import TextArea from "../input/TextArea"
import { Options } from "../../../model/Options"
import { LocationEndpoint } from "../../../endpoint/LocationEndpoint"
import { send } from "../../../api/api"
import { CountryDto } from "../../../model/Country/CountryDto"
import Select from "../Select"

export const LocationForm: React.FC<PropsWithChildren<FormProp<LocationDto>>> = ({ type, handleClick: handleClickWithEvent, setDto, dto }) => {
    const [country, setCountry] = useState<Options[]>([]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const fetchCountry = async () => {
        const res = await send.get(LocationEndpoint.COUNTRY);
        if (res && res.data) {
           res.data.map((item: CountryDto) => {
                setCountry(prev => [...prev, { label: item.name, value: item.id }])
           })
        }
    }
    useEffect(() => {
        fetchCountry();
    },[])
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="name">Name</Label>
                        <Input disabled={type == FormType.INFO} placeholder="Location Name" name="name" type="text" id="locationName" onChange={handleChange} value={dto.name} />
                    </div>

                </div>
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="name">Country</Label>
                        <Select options={country} name={"country"} defaultValue={dto.countryId} onChange={(value:string) =>{
                            setDto(prev => ({...prev, countryId: parseInt(value),country: country.find(item => item.value == parseInt(value))?.label || ""}))
                        }} />
                    </div>

                </div>
                <div className='flex gap-2 mb-3 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="description">Description</Label>
                        <TextArea disabled={type == FormType.INFO} placeholder="Location Description" onChange={(e: string) => setDto(prev => ({ ...prev, description: e }))} value={dto.description} />
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