import { PropsWithChildren } from "react"
import { TimeIcon } from "../../../icons"
import { DaysInWeekDto } from "../../../model/Interval/DaysInWeekDto"
import Button from "../../ui/button/Button"
import Checkbox from "../input/Checkbox"
import Input from "../input/InputField"
import Label from "../Label"
import { FormProp } from "../../../model/Form/FormProp"
import { IntervalDto } from "../../../model/Interval/IntervalDto"
import Helper from "../../../utility/Helper"

const daysInWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

export const IntervalForm: React.FC<PropsWithChildren<FormProp<IntervalDto>>> = ({ isUpdate, handleClick: handleClickWithEvent, setDto, dto }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name)
        console.log(e.target.value);
        switch (e.target.name) {
            case "startTime":
            case "endTime":
                setDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                break;
            default:
                setDto((prev) => ({ ...prev, days: { ...prev.days, [e.target.name]: e.target.checked } }))
                break;
        }
    }

    return (
        <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 items-center">

                <div>
                    <div className='w-100'>
                        <div className='flex flex-col gap-5 w-100'>
                            <div>
                                <div className='flex flex-col gap-2'>
                                    <Label>Days</Label>
                                    {daysInWeek.map((d: string, i: number) =>
                                        <div key={i} className='flex gap-2 justify-around items-center'>
                                            <div className='flex-1' >
                                                <Checkbox
                                                    name={d}
                                                    checked={dto.days[d as keyof DaysInWeekDto]}
                                                    onChange={handleChange}
                                                    label={Helper.toCapitalCase(d)}
                                                />
                                            </div>
                                        </div>
                                    )}


                                    <div className='flex gap-2'>
                                        <div className="relative flex-1">
                                            <Label>Start Time</Label>
                                            <Input
                                                type="time"
                                                id="tm"
                                                name="startTime"
                                                onChange={handleChange}
                                                defaultValue={"00:00"}
                                                value={dto.startTime}
                                                min='00:00'
                                            />
                                            <span className="absolute text-gray-500  pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                <TimeIcon className="size-6" />
                                            </span>
                                        </div>
                                        <div className="relative flex-1">
                                            <Label>End Time</Label>
                                            <Input
                                                type="time"
                                                id="tm"
                                                name="endTime"
                                                onChange={handleChange}
                                                defaultValue={"23:59"}
                                                max='23:59'
                                                value={dto.endTime}
                                            />
                                            <span className="absolute text-gray-500 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                <TimeIcon className="size-6" />
                                            </span>
                                        </div>

                                    </div>

                                </div>
                                <div className='mt-3 flex gap-2'>
                                    <Button onClickWithEvent={handleClickWithEvent} name={isUpdate ? "update" : "create"} size='sm'>{isUpdate ? "Update" : "Create"}</Button>
                                    <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                                </div>

                            </div>
                        </div>

                    </div>

                </div >

            </div >
        </div>


    )
}