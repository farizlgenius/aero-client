import React, { PropsWithChildren, useEffect, useState } from 'react'
import Label from '../Label'
import Select from '../Select'
import Button from '../../ui/button/Button'
import { Options } from '../../../model/Options'

interface SelectDeviceForm {
    handleClick:(e:React.MouseEvent<HTMLButtonElement,MouseEvent>)=>void;
    setDto:React.Dispatch<React.SetStateAction<number>>
}


const SelectDeviceForm:React.FC<PropsWithChildren<SelectDeviceForm>> = ({handleClick,setDto}) => {
    const [deviceOption,setDeviceOption] = useState<Options[]>([]);
    const handleSelect = (value:string) => {
        setDto(Number(value))
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
            onChange={handleSelect}
            className="dark:bg-dark-900"
          />
          <Button name='type' onClickWithEvent={handleClick}>Ok</Button>
    </div>
  )
}

export default SelectDeviceForm