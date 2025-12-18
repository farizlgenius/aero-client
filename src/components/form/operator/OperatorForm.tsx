import { PropsWithChildren, useEffect, useState } from "react";
import { FormProp } from "../../../model/Form/FormProp";
import { OperatorDto } from "../../../model/Operator/OperatorDto";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import Select from "../Select";
import HttpRequest from "../../../utility/HttpRequest";
import { HttpMethod } from "../../../enum/HttpMethod";
import { RoleEndpoint } from "../../../endpoint/RoleEndpoint";
import { RoleDto } from "../../../model/Role/RoleDto";
import { Options } from "../../../model/Options";
import { LocationDto } from "../../../model/Location/LocationDto";
import { LocationEndpoint } from "../../../endpoint/LocationEndpoint";
import Helper from "../../../utility/Helper";
import { LocationIcon } from "../../../icons";


export const OperatorForm: React.FC<PropsWithChildren<FormProp<OperatorDto>>> = ({ handleClick: handleClickWithEvent, dto, setDto, isUpdate }) => {
    const [roles, setRoles] = useState<Options[]>([]);
    const [locationId,setLocationId] = useState<number>(-1);
    const [locations, setLocations] = useState<Options[]>([]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }


    const fetchRole = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, RoleEndpoint.GET_ROLE)
        console.log(res?.data.data)
        if (res && res.data.data) {
            res.data.data.map((a: RoleDto) => {
                setRoles(prev => ([...prev, {
                    label: a.name,
                    value: a.componentId,
                    isTaken: false
                }]))
            })
        }
    }

    const fetchLocation = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, LocationEndpoint.GET)
        console.log(res?.data.data)
        if (res && res.data.data) {
            res.data.data.map((a: LocationDto) => {
                setLocations(prev => ([...prev, {
                    label: a.locationName,
                    value: a.componentId,
                    isTaken: false
                }]))
            })
        }
    }

    useEffect(() => {
        fetchRole();
        fetchLocation();
    }, []);
    return (
        <>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className='flex gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="username">Username</Label>
                        <Input name="username" type="text" id="username" onChange={handleChange} value={dto.username} />
                    </div>
                    <div className='flex-1'>
                        <Label htmlFor="password">Password</Label>
                        <Input name="password" type="password" id="password" onChange={handleChange} value={dto.password} />
                    </div>
                </div>
                <div className='flex gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="title">Title</Label>
                        <Input name="title" type="text" id="title" onChange={handleChange} value={dto.title} />
                    </div>
                    <div className='flex-2'>
                        <Label htmlFor="firstName">Firstname</Label>
                        <Input name="firstName" type="text" id="firstName" onChange={handleChange} value={dto.firstName} />
                    </div>
                    <div className='flex-2'>
                        <Label htmlFor="middleName">Middlename</Label>
                        <Input name="middleName" type="text" id="middleName" onChange={handleChange} value={dto.middleName} />
                    </div>
                    <div className='flex-2'>
                        <Label htmlFor="lastName">Lastname</Label>
                        <Input name="lastName" type="text" id="lastName" onChange={handleChange} value={dto.lastName} />
                    </div>
                </div>
                <div className='flex gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" type="email" id="email" onChange={handleChange} value={dto.email} />
                    </div>
                    <div className='flex-1'>
                        <Label htmlFor="phone">Phone</Label>
                        <Input name="phone" type="text" id="phone" onChange={handleChange} value={dto.phone} />
                    </div>
                </div>
                <div className='flex gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="phone">Role</Label>
                        <Select
                            isString={false}
                            options={roles}
                            defaultValue={dto.roleId}
                            onChange={e => setDto(prev => ({...prev,roleId:Number(e)}))}
                            name="roleId"
                        />

                    </div>
                </div>
                <div className='flex flex-col gap-2 w-1/2'>
                    <div className='flex-1'>
                        <Label htmlFor="phone">Location</Label>
                        <div className="flex gap-5">
                            <Select
                                isString={false}
                                options={locations}
                                defaultValue={locationId}
                                onChange={e => setLocationId(Number(e))}
                                name="location"
                            />
                            <Button onClick={() => {
                                if(locationId != -1 && !dto.locationIds.includes(locationId)){
                                     setDto(prev => ({...prev,locationIds:[...prev.locationIds,locationId]}))
                                     setLocations(prev => Helper.updateOptionByValue(prev,locationId,true))
                                     setLocationId(-1);
                                }            
                            }}>Add</Button>
                        </div>
                    </div>
                    <Label>Locations</Label>
                    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div className="grid grid-cols-5 gap-4">
                            {dto.locationIds.map((s,i) => (
                                <div key={i} className="cursor-pointer flex flex-col rounded-2xl border border-gray-200 hover:dark:bg-white/[0.01] hover:bg-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                                    <div className="flex flex-col justify-center items-center gap-2">
                                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                                            <LocationIcon  />
                                            
                                        </div>
                                         <span className="text-sm text-gray-500 dark:text-gray-400">{locations.find(a => a.value == s)?.label}</span>
                                    </div>
                                </div>
                            ))}
                            </div>

                    </div>

                </div>

                <div className='mt-3 flex gap-5'>
                    <Button onClickWithEvent={handleClickWithEvent} name={isUpdate ? "update" : "create"} size='sm'>{isUpdate ? "Update" : "Create"}</Button>
                    <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                </div>
            </div>

        </>
    )
}