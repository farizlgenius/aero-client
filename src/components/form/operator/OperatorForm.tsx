import { PropsWithChildren, useEffect, useState } from "react";
import { FormProp, FormType } from "../../../model/Form/FormProp";
import { OperatorDto } from "../../../model/Operator/OperatorDto";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import Select from "../Select";
import { RoleEndpoint } from "../../../endpoint/RoleEndpoint";
import { RoleDto } from "../../../model/Role/RoleDto";
import { Options } from "../../../model/Options";
import { LocationDto } from "../../../model/Location/LocationDto";
import { LocationEndpoint } from "../../../endpoint/LocationEndpoint";
import Helper from "../../../utility/Helper";
import { CardIcon, CheckLineIcon, CloseIcon, CloseLineIcon, EyeCloseIcon, EyeIcon, LocationIcon, LockIcon, OnIcon } from "../../../icons";
import { send } from "../../../api/api";
import { OperatorEndpoint } from "../../../endpoint/OperatorEndpoint";
import { SettingEndpoint } from "../../../endpoint/SettingEndpoint";
import { PasswordRuleDto } from "../../../model/Setting/PasswordRuleDto";
import { OperatorToast, ToastMessage } from "../../../model/ToastMessage";
import { useToast } from "../../../context/ToastContext";

type PasswordDto = {
    userName: string;
    old: string;
    new: string;
    con: string;
}



export const OperatorForm: React.FC<PropsWithChildren<FormProp<OperatorDto>>> = ({ handleClick: handleClickWithEvent, dto, setDto, type }) => {
    const defaulDto: PasswordDto = {
        userName: dto.username,
        old: "",
        new: "",
        con: ""
    }

    const { toggleToast } = useToast();
    const [roles, setRoles] = useState<Options[]>([]);
    const [locationId, setLocationId] = useState<number>(-1);
    const [locationIds, setLocationIds] = useState<number[]>([]);
    const [locations, setLocations] = useState<Options[]>([]);
    const [passForm, setPassForm] = useState<boolean>(false);
    const [showOld, setShowOld] = useState<boolean>(false);
    const [showNew, setShowNew] = useState<boolean>(false);
    const [showCon, setShowCon] = useState<boolean>(false);
    const [passDto, setPassDto] = useState<PasswordDto>(defaulDto)
    const [passRule, setPassRule] = useState<PasswordRuleDto>({
        len: 4,
        isDigit: false,
        isLower: false,
        isUpper: false,
        isSymbol: false,
        weaks: []
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleChangePassword = () => {
        setPassForm(true);
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
            case "cancel":
                setPassForm(false)
                break;
            case "create":
                setDto(prev =>({...prev,password:passDto.new}))
                setPassDto(defaulDto)
                setPassForm(false)
                break;
            case "change":
                updatePassword();
                break;
            default:
                break;
        }
    }


    const updatePassword = async () => {
        const res = await send.put(OperatorEndpoint.PASS, passDto);
        if (Helper.handleToastByResCode(res, OperatorToast.UPDATE_PASS, toggleToast)) {
            setPassForm(false);
        }
    }

    const fetchRole = async () => {
        const res = await send.get(RoleEndpoint.GET);
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
        const res = await send.get(LocationEndpoint.GET);
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

    const fetchPasswordRule = async () => {
        const res = await send.get(SettingEndpoint.GET_PASSWORD);
        if (res && res.data.data) {
            setPassRule({
                len: res.data.data.len,
                isDigit: res.data.data.isDigit,
                isLower: res.data.data.isLower,
                isUpper: res.data.data.isUpper,
                isSymbol: res.data.data.isSymbol,
                weaks: res.data.data.weaks
            })
        }
    }

    const isRequireLen = (value: string): boolean => {
        return value.length >= passRule.len;
    }

    const isRequireUpper = (value: string): boolean => {
        return /[A-Z]/.test(value) || !passRule.isUpper
    }

    const isRequireLower = (value: string): boolean => {
        return /[a-z]/.test(value) || !passRule.isLower
    }

    const isRequireDigit = (value: string): boolean => {
        return /[1-9]/.test(value) || !passRule.isDigit
    }

    const isRequireSymbol = (value: string): boolean => {
        return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) || !passRule.isSymbol
    }

    const isMatch = (value: string, value2: string): boolean => {
        return value == value2 && value != "" && value2 != "";
    }

    const onLocationClick = (data: number) => {
        setLocationIds(prev => prev.includes(data) ? prev.filter(x => x !== data) : ([...prev, data]))
    }

    useEffect(() => {
        fetchPasswordRule();
        fetchRole();
        fetchLocation();
    }, []);
    return (
        <>
            {
                passForm ?
                    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <div className='flex flex-col gap-2'>
                            {
                                type == FormType.UPDATE &&

                                <div className="flex-1">
                                    <Label>
                                        Old Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showOld ? "text" : "password"}
                                            placeholder="Enter your password"
                                            onChange={(e) => setPassDto(prev => ({ ...prev, old: e.target.value }))}
                                        />
                                        <span
                                            onClick={() => setShowOld(!showOld)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showOld ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>


                            }
                            
                            <div className="flex-1">
                                <Label>
                                    New Password <span className="text-error-500">*</span>{" "}
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showNew ? "text" : "password"}
                                        placeholder="Enter your password"
                                        onChange={(e) => setPassDto(prev => ({ ...prev, new: e.target.value }))}
                                    />
                                    <span
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showNew ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <Label>
                                    Confirm Password <span className="text-error-500">*</span>{" "}
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showCon ? "text" : "password"}
                                        placeholder="Enter your password"
                                        onChange={(e) => setPassDto(prev => ({ ...prev, con: e.target.value }))}
                                    />
                                    <span
                                        onClick={() => setShowCon(!showCon)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showCon ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 justify-center flex-start p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                <div className="flex flex-start">
                                    {
                                        isRequireLen(passDto.new) ?
                                            <div className="flex gap-2">
                                                {<CheckLineIcon color="green" fontSize={20} />}
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Password length pass !!
                                                </p>
                                            </div>
                                            :
                                            <div className="flex gap-2">
                                                {<CloseLineIcon color="red" fontSize={20} />}
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Password must longer than {passRule.len - 1}
                                                </p>
                                            </div>

                                    }
                                </div>
                                {
                                    passRule.isDigit &&

                                    <div className="flex flex-start">
                                        {
                                            isRequireDigit(passDto.new) ?
                                                <div className="flex gap-2">
                                                    {<CheckLineIcon color="green" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password included digit !!
                                                    </p>
                                                </div>
                                                :
                                                <div className="flex gap-2">
                                                    {<CloseLineIcon color="red" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password must contain at least 1 digit
                                                    </p>
                                                </div>

                                        }
                                    </div>
                                }

                                {
                                    passRule.isUpper &&
                                    <div className="flex flex-start">
                                        {
                                            isRequireUpper(passDto.new) ?
                                                <div className="flex gap-2">
                                                    {<CheckLineIcon color="green" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password included uppercase !!
                                                    </p>
                                                </div>
                                                :
                                                <div className="flex gap-2">
                                                    {<CloseLineIcon color="red" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password must contain at least 1 uppercase
                                                    </p>
                                                </div>

                                        }
                                    </div>


                                }

                                {
                                    passRule.isLower &&

                                    <div className="flex flex-start">
                                        {
                                            isRequireLower(passDto.new) ?
                                                <div className="flex gap-2">
                                                    {<CheckLineIcon color="green" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password included lowercase !!
                                                    </p>
                                                </div>
                                                :
                                                <div className="flex gap-2">
                                                    {<CloseLineIcon color="red" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password must contain at least 1 lowercase
                                                    </p>
                                                </div>

                                        }
                                    </div>

                                }

                                {
                                    passRule.isSymbol &&

                                    <div className="flex flex-start">
                                        {
                                            isRequireSymbol(passDto.new) ?
                                                <div className="flex gap-2">
                                                    {<CheckLineIcon color="green" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password included symbol !!
                                                    </p>
                                                </div>
                                                :
                                                <div className="flex gap-2">
                                                    {<CloseLineIcon color="red" fontSize={20} />}
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Password must contain at least 1 symbol
                                                    </p>
                                                </div>

                                        }
                                    </div>
                                }

                                <div className="flex flex-start">
                                    {
                                        isMatch(passDto.new, passDto.con) ?
                                            <div className="flex gap-2">
                                                {<CheckLineIcon color="green" fontSize={20} />}
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Password matched !!
                                                </p>
                                            </div>
                                            :
                                            <div className="flex gap-2">
                                                {<CloseLineIcon color="red" fontSize={20} />}
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Password not match
                                                </p>
                                            </div>

                                    }
                                </div>

                            </div>
                            <div className='mt-3 flex justify-center gap-5'>
                                <Button onClickWithEvent={handleClick} name={ type == FormType.CREATE ? "create" : "change"} size='sm'>{ type == FormType.CREATE ? "Create" : "Change"}</Button>
                                <Button variant='danger' onClickWithEvent={handleClick} name='cancel' size='sm'>Cancel</Button>
                            </div>
                        </div>

                    </div>
                    :
                    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <div className='flex gap-2 w-1/2'>
                            <div className='flex-1'>
                                <Label htmlFor="username">Username</Label>
                                <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="username" type="text" id="username" onChange={handleChange} value={dto.username} />
                            </div>
                            <div className='flex-1'>
                                {
                                    type == FormType.UPDATE || type == FormType.CREATE ?
                                        <>
                                            <Label htmlFor="password">Password</Label>
                                            <Button onClick={() => handleChangePassword()} variant={type == FormType.CREATE && dto.password.length > 0 ? "green" : "primary"}>{type == FormType.UPDATE ? "Change Password" :  dto.password.length == 0 ? "Please Set Password" : "Password assigned"}</Button>
                                        </>
                                        :
                                        <>
                                            <Label htmlFor="password">Password</Label>
                                            <Input disabled={type == FormType.INFO} name="password" type="password" id="password" onChange={handleChange} value={dto.password} />
                                        </>


                                }


                            </div>
                        </div>
                        <div className='flex gap-2 w-1/2'>
                            <div className='flex-1'>
                                <Label htmlFor="title">Title</Label>
                                <Input disabled={type == FormType.INFO} name="title" type="text" id="title" onChange={handleChange} value={dto.title} />
                            </div>
                            <div className='flex-2'>
                                <Label htmlFor="firstName">Firstname</Label>
                                <Input disabled={type == FormType.INFO} name="firstName" type="text" id="firstName" onChange={handleChange} value={dto.firstName} />
                            </div>
                            <div className='flex-2'>
                                <Label htmlFor="middleName">Middlename</Label>
                                <Input disabled={type == FormType.INFO} name="middleName" type="text" id="middleName" onChange={handleChange} value={dto.middleName} />
                            </div>
                            <div className='flex-2'>
                                <Label htmlFor="lastName">Lastname</Label>
                                <Input disabled={type == FormType.INFO} name="lastName" type="text" id="lastName" onChange={handleChange} value={dto.lastName} />
                            </div>
                        </div>
                        <div className='flex gap-2 w-1/2'>
                            <div className='flex-1'>
                                <Label htmlFor="email">Email</Label>
                                <Input disabled={type == FormType.INFO} name="email" type="email" id="email" onChange={handleChange} value={dto.email} />
                            </div>
                            <div className='flex-1'>
                                <Label htmlFor="phone">Phone</Label>
                                <Input disabled={type == FormType.INFO} name="phone" type="text" id="phone" onChange={handleChange} value={dto.phone} />
                            </div>
                        </div>
                        <div className='flex gap-2 w-1/2'>
                            <div className='flex-1'>
                                <Label htmlFor="phone">Role</Label>
                                <Select

                                    isString={false}
                                    options={roles}
                                    defaultValue={dto.roleId}
                                    onChange={e => setDto(prev => ({ ...prev, roleId: Number(e) }))}
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
                                    <Button variant={locationIds.length > 0 ? "danger" : "primary"} disabled={type == FormType.INFO} onClick={() => {
                                        if (locationIds.length > 0) {
                                            setDto(prev => ({ ...prev, locationIds: prev.locationIds.filter(x => !locationIds.includes(x)) }))
                                            setLocations(prev => Helper.updateOptionByValue(prev, locationId, false))
                                        } else {
                                            if (locationId != -1 && !dto.locationIds.includes(locationId)) {
                                                setDto(prev => ({ ...prev, locationIds: [...prev.locationIds, locationId] }))
                                                setLocations(prev => Helper.updateOptionByValue(prev, locationId, true))
                                                setLocationId(-1);
                                            }
                                        }

                                    }}>{locationIds.length > 0 ? "Delete" : "Add"}</Button>
                                </div>
                            </div>
                            <Label>Locations</Label>
                            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                <div className="grid grid-cols-5 gap-4">
                                    {dto.locationIds.map((s, i) => (
                                        <div onClick={() => onLocationClick(s)} key={i} className={`cursor-pointer flex flex-col rounded-2xl border border-gray-200 hover:dark:bg-white/[0.01] hover:bg-gray-200 ${locationIds.includes(s) ? "bg-gray-200 dark:bg-white/[0.01]" : "dark:bg-white/[0.03] bg-white"} p-5 dark:border-gray-800  md:p-6`}>
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                                                    <LocationIcon />
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{locations.find(a => a.value == s)?.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>

                        <div className='mt-3 flex gap-5'>
                            <Button disabled={type == FormType.INFO} onClickWithEvent={handleClickWithEvent} name={type == FormType.UPDATE ? "update" : "create"} size='sm'>{type == FormType.UPDATE ? "Update" : "Create"}</Button>
                            <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                        </div>
                    </div>

            }



        </>
    )
}