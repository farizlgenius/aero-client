import React, { PropsWithChildren, useEffect, useState } from "react";
import { AreaDto } from "../../../model/Area/AreaDto";
import { FormProp } from "../../../model/Form/FormProp";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import Select from "../Select";
import { Options } from "../../../model/Options";
import { HttpMethod } from "../../../enum/HttpMethod";
import HttpRequest from "../../../utility/HttpRequest";
import { AreaEndPoint } from "../../../constants/constant";
import { ModeDto } from "../../../model/ModeDto";
import Switch from "../switch/Switch";
import { Info2Icon } from "../../../icons";


export const AreaForm: React.FC<PropsWithChildren<FormProp<AreaDto>>> = ({ handleClickWithEvent, setDto, dto }) => {
  const [areaFlag, setAreaFlag] = useState<ModeDto[]>([]);
  const [accessControlOption, setAccessControlOption] = useState<Options[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const fetchAreaFlag = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, AreaEndPoint.GET_ARE_FLAG)

    if (res && res.data.data) {
      setAreaFlag(res.data.data)

    }
  }
  const fetchAccessControl = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, AreaEndPoint.GET_ACCESS_CONTROL)

    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setAccessControlOption(prev => ([...prev, {
          label: a.name,
          value: a.value,
          description: a.description
        }]))
      })

    }
  }
  useEffect(() => {
    fetchAreaFlag();
    fetchAccessControl();
  }, [])
  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className='flex gap-2 mb-3 w-1/2'>
          <div className='flex-1'>
            <Label htmlFor="name">Name</Label>
            <Input name="name" type="text" id="name" onChange={handleChange} value={dto.name} />
          </div>
        </div>
        <div className='flex gap-2 mb-3 w-1/2'>
          <div className='flex-1'>
            <Label htmlFor="accessControl">Access Control</Label>
            <Select
              isString={false}
              name="accessControl"
              options={accessControlOption}
              defaultValue={dto.accessControl}
              onChange={(e: string) => setDto(prev => ({ ...prev, accessControl: Number(e) }))}
            />
          </div>
        </div>
        <div className='flex gap-2 mb-3 w-1/2'>
          <div className='flex-1'>
            <Label htmlFor="accessControl">Area Setting</Label>
            <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              {areaFlag.map((a: ModeDto, i: number) => {
                return (
                  <div className="flex justify-center items-center">
                    <Switch
                      key={i}
                      label={a.name}
                      defaultChecked={false}
                      onChange={(checked: boolean) => setDto(prev => ({ ...prev, areaFlag: checked ? prev.areaFlag | a.value : prev.areaFlag & (~a.value) }))}
                    />
                    <div>
                      <Info2Icon />
                      <button data-popover="#popover-right" data-popover-placement="right" className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex rounded-lg px-4 py-3 text-sm font-medium text-white">
                        Popover on Right
                      </button>

                      <div className="absolute z-99999 bg-white border border-gray-200 rounded-xl dark:bg-[#1E2634] dark:border-gray-700 block">
                        {/* style="left: 221.359px; top: 201.5px;" style="left: -6px; top: 68.5px;" */}
                        <div className="max-w-[300px]">
                          <div className="relative z-20 rounded-t-xl border-b border-gray-200 px-5 py-3 dark:border-white/[0.03]">
                            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                              Popover on Right
                            </h4>
                          </div>
                          <div className="p-5">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                              facilisis congue justo nec facilisis.
                            </p>
                          </div>
                        </div>

                        <div className="popover-arrow absolute h-3 w-3 rotate-45 bg-white dark:bg-[#1E2634] border-l border-b border-gray-200 dark:border-gray-700" ></div>
                      </div>

                    </div>

                  </div>
                )
              })}
            </div>
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