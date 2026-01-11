import React, { PropsWithChildren, useState } from 'react'

import DatePicker from '../../components/form/date-picker';
import Button from '../../components/ui/button/Button';
import { HolidayDto } from '../../model/Holiday/HolidayDto';
import { FormProp, FormType } from '../../model/Form/FormProp';


const HolidayForm: React.FC<PropsWithChildren<FormProp<HolidayDto>>> = ({ type, setDto, handleClick,dto }) => {
  const [date,setDate] = useState<Date>();
  // Alert Modal 
  return (

    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 items-center">
        <div>
          <div className='w-100'>
            <div className='flex flex-col gap-5 w-100'>
              <div>
                <DatePicker
                  isTime={false}
                  id="Date"
                  label="Selected Date"
                  placeholder="Select a date"
                  defaultDate={new Date(dto.year,dto.month -1,dto.day)}
                  value={`${dto.year}-${dto.month}-${dto.day} ${"00"}:${"00"}`}
                  //value={createTimeZoneDto.activeTime}
                  // onChange={(dates, currentDateString) => {
                  //   // Handle your logic
                  //   console.log({ dates, currentDateString });
                  //   //handleChange((prev) => ({ ...prev, day: dates[0].getDate(), month: dates[0].getMonth() + 1, year: dates[0].getFullYear() }))
                  //   //handleChange
                  // }}
                  onChange={(date) => {
                    setDto((prev) => ({ ...prev, day: date[0].getDate(), month: date[0].getMonth() + 1, year: date[0].getFullYear() }));
                    setDate(date[0])
                    console.log(date[0])
                  }}
                />
              </div>
              <div className='flex gap-4'>
                <Button disabled={type == FormType.INFO} onClickWithEvent={handleClick} name={type == FormType.UPDATE ? "update" : "create"} className="w-50" size="sm">{type == FormType.UPDATE ? "Update" : "Create"}</Button>
                <Button onClickWithEvent={handleClick} variant='danger' name='close' className="w-50" size="sm">Cancel</Button>
              </div>

            </div>
          </div>
        </div >
      </div >
    </div>


  )
}

export default HolidayForm