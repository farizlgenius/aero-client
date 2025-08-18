import React, { useEffect, useState } from 'react'
import Label from '../Label'
import Select from '../Select'
import { Option } from '../../../constants/types'
import Button from '../../ui/button/Button'



const SelectDeviceForm = () => {
    const [deviceOption,setDeviceOption] = useState<Option[]>([]);
    const handleSelect = (value:string,e:React.ChangeEvent<HTMLSelectElement>) => {
        console.log(value);
    }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget.name);
    }
    useEffect(() => {
        setDeviceOption([{
            label:"HID Aero X1100",
            value:0
        },{
            label:"HID Amico",
            value:1
        }])
    },[])
  return (
    <div className='flex flex-col gap-4'>
        <Label>Device Type</Label>
        <Select
            name="type"
            options={deviceOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
          />
          <Button name='type' onClickWithEvent={handleClick}>Ok</Button>
    </div>
  )
}

export default SelectDeviceForm