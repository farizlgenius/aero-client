import React, { PropsWithChildren} from 'react'
import ComponentCard from '../../components/common/ComponentCard';
import {  DaysInWeek, IntervalDto } from '../../constants/types';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Checkbox from '../../components/form/input/Checkbox';
import Input from '../../components/form/input/InputField';
import { TimeIcon } from '../../icons';
import Modals from '../UiElements/Modals';
import Helper from '../../utility/Helper';



// interface 

interface IntervalProp {
  isUpdate:boolean,
  handleClickWithEvent: (e: React.MouseEvent<HTMLButtonElement>)=>void,
  handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
  data:IntervalDto
}


const daysInWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]




const intervalForm: React.FC<PropsWithChildren<IntervalProp>> = ({ handleClickWithEvent,handleChange,data,isUpdate }) => {

  return (
    <ComponentCard>      
      <div className="flex flex-col gap-6 items-center">

        <div>
          <div className='w-100'>
            <div className='flex flex-col gap-5 w-100'>
              <div>
                <div className='flex flex-col gap-2'>
                  <Label>Days</Label>
                  {daysInWeek.map((d:string,i:number) => 
                    <div key={i} className='flex gap-2 justify-around items-center'>
                      <div className='flex-1' >
                        <Checkbox
                          name={d}
                          checked={data.days[d as keyof DaysInWeek]}
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
                        value={data.startTime}
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
                        value={data.endTime}
                      />
                      <span className="absolute text-gray-500 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <TimeIcon className="size-6" />
                      </span>
                    </div>

                  </div>

                </div>
                <div className='mt-3 flex gap-2'>
                  <Button onClickWithEvent={handleClickWithEvent} name={isUpdate ? "update" : "create" } size='sm'>{isUpdate ? "Update" : "Create"}</Button>
                  <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='cancel' size='sm'>Cancel</Button>
                </div>

              </div>
            </div>

          </div>

        </div >

      </div >

    </ComponentCard >
  )
}

export default intervalForm