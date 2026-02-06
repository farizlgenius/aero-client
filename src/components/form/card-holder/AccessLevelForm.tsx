import { PropsWithChildren, useEffect, useState } from "react";
import { FormProp } from "../../../model/Form/FormProp";
import { CardHolderDto } from "../../../model/CardHolder/CardHolderDto";
import { AccessLevelDto } from "../../../model/AccessGroup/AccessLevelDto";
import { Options } from "../../../model/Options";
import { useLocation } from "../../../context/LocationContext";
import { send } from "../../../api/api";
import { AccessLevelEndPoint } from "../../../endpoint/AccessLevelEndpoint";
import ListTransfer from "../list-transfer/ListTransfer";


export const AccessLevelForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({ dto, setDto, type, handleClick }) => {
    const { locationId } = useLocation();
    var defaultAccessLevel: AccessLevelDto = {
        name: '',
        componentId: -1,
        accessLevelDoorTimeZoneDto: [],
        locationId: locationId,
        isActive: true
    }


    const [addAccessLeveForm, setAddAccessLeveForm] = useState<boolean>(false);
    const [accessLevelOption, setAccessLevelOption] = useState<Options[]>([]);
    let op:Options[] = [];
    const [accessGroupDto, setAccessGroupDto] = useState<AccessLevelDto>(defaultAccessLevel);

    const handleClickAccessLevel = () => {
        setAddAccessLeveForm(true);
    }

    const handleListChange = (data:Options[]) => {
       
    }

    {/* handle Table Action */ }
    const handleOnClickEdit = () => {

    }

    const handleOnClickRemove = (data: Object) => {
        console.log(data);
    }

    const handleClickInternal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        const res = await send.get(AccessLevelEndPoint.GET(locationId))
        if (res && res.data.data) {
            res.data.data.map((a: AccessLevelDto) => {
                setAccessLevelOption(prev => ([...prev, {
                    label: a.name,
                    value: a.componentId,
                    isTaken: false
                }]))
                op.push({
                    label: a.name,
                    value: a.componentId,
                    isTaken: false
                });
            })

        }
    }

    useEffect(() => {
        fetchAccessLevel();
    }, [])
    return (
        <div className="flex gap-5 justify-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className='flex flex-col w-3/4'>

                {/* {addAccessLeveForm ?
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
                                        <Button name='addAvl' onClickWithEvent={handleClickInternal} size='sm'>Add</Button>
                                        <Button name='cancleAvl' onClickWithEvent={handleClickInternal} size='sm' variant='danger'>Cancle</Button>
                                    </div>

                                </div>

                            </>

                            :

                            <>




                            </>
                        }
                         */}
                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                        Access Levels
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                            {dto.accessLevels.length}/32
                        </span>
                    </h3>
                </div>
                <div className="flex justify-center">
                    <ListTransfer availableItems={op} onChange={handleListChange} />
                </div>

            </div>
        </div>

    )

}