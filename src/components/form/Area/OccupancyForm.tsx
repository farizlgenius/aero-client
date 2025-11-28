import React, { PropsWithChildren, useEffect, useState } from "react";
import { AreaDto } from "../../../model/Area/AreaDto";
import { FormProp } from "../../../model/Form/FormProp";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import HttpRequest from "../../../utility/HttpRequest";
import { HttpMethod } from "../../../enum/HttpMethod";
import { AreaEndPoint } from "../../../constants/constant";
import { Options } from "../../../model/Options";
import { ModeDto } from "../../../model/ModeDto";
import Select from "../Select";


export const OccupancyForm: React.FC<PropsWithChildren<FormProp<AreaDto>>> = ({ handleClick: handleClickWithEvent, setDto, dto }) => {
  const [multiOccOption, setMultiOccOption] = useState<Options[]>([]);
  const [occControlOption, setOccControlOption] = useState<Options[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const fetchMultiOcc = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, AreaEndPoint.GET_MULTI_OCC)

    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setMultiOccOption(prev => ([...prev, {
          label: a.name,
          value: a.value,
          description: a.description
        }]))
      })

    }
  }
  const fetchOccControl = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, AreaEndPoint.GET_OCC_CONTROL)

    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setOccControlOption(prev => ([...prev, {
          label: a.name,
          value: a.value,
          description: a.description
        }]))
      })

    }
  }
  useEffect(() => {
    fetchOccControl();
    fetchMultiOcc();
  }, [])
  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className='flex gap-2 mb-3 w-1/2'>
          <div className='flex-1'>
            <Label htmlFor="multiOccupancy">Multi Occupancy</Label>
            <Select
              isString={false}
              name="multiOccupancy"
              options={multiOccOption}
              defaultValue={dto.multiOccupancy}
              onChange={(e: string) => setDto(prev => ({ ...prev, multiOccupancy: Number(e) }))}
            />
          </div>
        </div>
        <div className='flex gap-2 mb-3 w-1/2'>
          <div className='flex-1'>
            <Label htmlFor="occControl">Occupancy Control</Label>
            <Select
              isString={false}
              name="occControl"
              options={occControlOption}
              defaultValue={dto.occControl}
              onChange={(e: string) => setDto(prev => ({ ...prev, occControl: Number(e) }))}
            />
          </div>
        </div>
        <div className='flex gap-2 mb-3 w-1/2'>
          <div className='flex-1'>
            <Label htmlFor="occMax">Max Occupancy</Label>
            <Input name="occMax" type="number" id="occMax" onChange={handleChange} value={dto.occMax} />
          </div>
        </div>
        <div className='flex gap-2 mb-3 w-1/2'>
          <div className='flex-1'>
            <Label htmlFor="occUp">Highest Occupancy Before Create Event</Label>
            <Input name="occUp" type="number" id="occUp" onChange={handleChange} value={dto.occUp} />
          </div>
          <div className='flex-1'>
            <Label htmlFor="occDown">Lowest Occupancy Before Create Event</Label>
            <Input name="occDown" type="number" id="occDown" onChange={handleChange} value={dto.occDown} />
          </div>
        </div>
        <div className='flex m-5 gap-5 justify-center items-center'>
          <Button name='create' onClickWithEvent={handleClickWithEvent} className="w-50" size="sm">Create</Button>
          <Button name='cancle' onClickWithEvent={handleClickWithEvent} className="w-50" size="sm" variant='danger'>Cancle</Button>
        </div>
      </div>
    </>

  )
}