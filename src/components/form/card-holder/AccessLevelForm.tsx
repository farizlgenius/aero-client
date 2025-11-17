import { PropsWithChildren, useEffect, useState } from "react";
import { FormProp } from "../../../model/Form/FormProp";
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto";
import ActionElement from "../../../pages/UiElements/ActionElement";
import { AccessGroupDto } from "../../../model/AccessGroup/AccessGroupDto";
import Button from "../../ui/button/Button";
import Select from "../Select";
import Label from "../Label";
import HttpRequest from "../../../utility/HttpRequest";
import { HttpMethod } from "../../../enum/HttpMethod";
import { AccessLevelEndPoint } from "../../../constants/constant";
import { Options } from "../../../model/Options";

var defaultAccessLevel: AccessGroupDto = {
    name: '',
    componentId: -1,
    accessLevelDoorTimeZoneDto: [],
    uuid: '',
    locationId: 1,
    locationName: 'Main Location',
    isActive: true
}

export const AccessLevelForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({ dto, setDto }) => {
    const [addAccessLeveForm, setAddAccessLeveForm] = useState<boolean>(false);
    const [accessLevelOption, setAccessLevelOption] = useState<Options[]>([]);
    const [accessGroupDto, setAccessGroupDto] = useState<AccessGroupDto>(defaultAccessLevel);

    const handleClickAccessLevel = () => {
        setAddAccessLeveForm(true);
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = () => {

    }

    const handleOnClickRemove = (data: Object) => {
        console.log(data);
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        switch (e.currentTarget.name) {
            case "addAvl":
                setDto(prev => ({ ...prev, accessLevels: [...prev.accessLevels, accessGroupDto] }))
                setAccessGroupDto(defaultAccessLevel)
                setAddAccessLeveForm(false)
                break;
            case "cancleAvl":
                setAccessGroupDto(defaultAccessLevel);
                setAddAccessLeveForm(false)
                break;
        }
    }

    const fetchAccessLevel = async () => {
        const res = await HttpRequest.send(HttpMethod.GET, AccessLevelEndPoint.GET_ACCESS_LEVEL)
        if (res && res.data.data) {
            res.data.data.map((a: AccessGroupDto) => {
                setAccessLevelOption(prev => ([...prev, {
                    label: a.name,
                    value: a.componentId,
                    isTaken: false
                }]))
            })

        }
    }

    useEffect(() => {
        fetchAccessLevel();
    }, [])
    return (
        <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className='flex flex-col gap-5'>
                <div className='gap-3'>
                    <div className='flex flex-col gap-1 w-100'>

                        {addAccessLeveForm ?
                            <>
                                <div>
                                    <div>
                                        <Label>Access Group</Label>
                                        <Select
                                            isString={false}
                                            name="accessLevel"
                                            options={accessLevelOption}
                                            placeholder="Select Option"
                                            onChangeWithEvent={(value: string, e: React.ChangeEvent<HTMLSelectElement>) => setAccessGroupDto(prev => ({ ...prev, componentId: Number(value), name: accessLevelOption.find(x => x.value == Number(value))?.label ?? "" }))}
                                            className="dark:bg-dark-900"
                                            defaultValue={accessGroupDto.componentId}
                                        />
                                    </div>
                                    <div className='flex gap-4 justify-center mt-5'>
                                        <Button name='addAvl' onClickWithEvent={handleClick} size='sm'>Add</Button>
                                        <Button name='cancleAvl' onClickWithEvent={handleClick} size='sm' variant='danger'>Cancle</Button>
                                    </div>

                                </div>

                            </>

                            :

                            <>

                                <div className="flex flex-col gap-4 swim-lane">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                                            Access Groups
                                            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                                                {dto.accessLevels.length}/32
                                            </span>
                                        </h3>
                                        <a onClick={() => handleClickAccessLevel()} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                                    </div>
                                </div>


                                <div className='flex flex-col gap-1'>
                                    {/* Card */}
                                    {dto.accessLevels.map((a: AccessGroupDto, i: number) => (
                                        <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                                <div className="flex items-start w-full gap-4">
                                                    <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                                                        <div className="relative flex items-start">
                                                            <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                                                Access Level : {a.name}
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                                                    <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-theme-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                                                        Active
                                                    </span>
                                                    <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={{}} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </>
                        }

                    </div>
                </div>
            </div>
        </div>

    )

}