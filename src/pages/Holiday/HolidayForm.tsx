import React, { PropsWithChildren } from 'react'

import ComponentCard from '../../components/common/ComponentCard';

import DatePicker from '../../components/form/date-picker';
import Button from '../../components/ui/button/Button';
import { HolidayDto } from '../../model/Holiday/HolidayDto';



// interface 

interface AddHolodayProps {
  isUpdate: boolean,
  handleClickWithEvent: (e: React.MouseEvent<HTMLButtonElement>) => void,
  setHolidayDto: React.Dispatch<React.SetStateAction<HolidayDto>>;
  data: HolidayDto
}



const HolidayForm: React.FC<PropsWithChildren<AddHolodayProps>> = ({ isUpdate, setHolidayDto, handleClickWithEvent, data }) => {
  // Alert Modal 
  return (
    <ComponentCard>
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
                  //value={createTimeZoneDto.activeTime}
                  // onChange={(dates, currentDateString) => {
                  //   // Handle your logic
                  //   console.log({ dates, currentDateString });
                  //   //handleChange((prev) => ({ ...prev, day: dates[0].getDate(), month: dates[0].getMonth() + 1, year: dates[0].getFullYear() }))
                  //   //handleChange
                  // }}
                  onChange={(date) => setHolidayDto((prev) => ({ ...prev, day: date[0].getDate(), month: date[0].getMonth() + 1, year: date[0].getFullYear() }))}
                />
              </div>
              <div className='flex gap-4'>
                <Button onClickWithEvent={handleClickWithEvent} name={isUpdate ? "update" : "create"} className="w-50" size="sm">{isUpdate ? "Update" : "Create"}</Button>
                <Button onClickWithEvent={handleClickWithEvent} variant='danger' name='close' className="w-50" size="sm">Cancle</Button>
              </div>

            </div>
          </div>
        </div >
      </div >

    </ComponentCard >
  )
}

export default HolidayForm