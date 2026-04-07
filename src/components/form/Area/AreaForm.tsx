import React, { PropsWithChildren, useEffect, useState } from "react";
import { AreaDto } from "../../../model/Area/AreaDto";
import { FormProp, FormType } from "../../../model/Form/FormProp";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import Select from "../Select";
import { Options } from "../../../model/Options";
import { ModeDto } from "../../../model/ModeDto";
import Switch from "../switch/Switch";
import { Info2Icon } from "../../../icons";
import { AreaEndpoint } from "../../../endpoint/AreaEndpoint";
import { send } from "../../../api/api";

enum FormTab {
  General, Occupancy
}


const formSteps = [
  { tab: FormTab.General, title: 'General', detail: 'Basic area configuration' },
  { tab: FormTab.Occupancy, title: 'In', detail: 'Area Occupancy setting' }
];


export const AreaForm: React.FC<PropsWithChildren<FormProp<AreaDto>>> = ({ handleClick: handleClickWithEvent, setDto, dto, type }) => {
  const [areaFlag, setAreaFlag] = useState<ModeDto[]>([]);
  const [accessControlOption, setAccessControlOption] = useState<Options[]>([]);
  const [activeTab, setActiveTab] = useState<number>(FormTab.General);
  const [multiOccOption, setMultiOccOption] = useState<Options[]>([]);
  const [occControlOption, setOccControlOption] = useState<Options[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const fetchMultiOcc = async () => {
    const res = await send.get(AreaEndpoint.GET_MULTI_OCC);
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
    const res = await send.get(AreaEndpoint.GET_OCC_CONTROL);

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

  const fetchAreaFlag = async () => {
    const res = await send.get(AreaEndpoint.GET_ARE_FLAG);
    if (res && res.data.data) {
      setAreaFlag(res.data.data)

    }
  }
  const fetchAccessControl = async () => {
    const res = await send.get(AreaEndpoint.GET_ACCESS_CONTROL);
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
  const currentStepIndex = formSteps.findIndex((step) => step.tab === activeTab);
  const progress = ((currentStepIndex + 1) / formSteps.length) * 100;
  const currentStep = formSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === formSteps.length - 1;

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= formSteps.length) return;
    setActiveTab(formSteps[stepIndex].tab);
  }

  useEffect(() => {
    fetchAreaFlag();
    fetchAccessControl();
    fetchOccControl();
    fetchMultiOcc();
  }, [])


  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Step {currentStepIndex + 1} of {formSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
            <div className="h-2 rounded-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            {formSteps.map((step, index) => (
              <button
                key={step.tab}
                type="button"
                onClick={() => goToStep(index)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${activeTab === step.tab
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:border-brand-400 dark:bg-brand-400/20 dark:text-brand-300'
                  : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:text-gray-300'
                  }`}
              >
                <span>{index + 1}.</span>
                <span>{step.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 lg:p-6 w-full">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentStep?.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentStep?.detail}</p>
          </div>
          {activeTab == FormTab.General &&
            <div className='flex justify-center items-center flex-col gap-4'>
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
                  <div className="mt-4 grid grid-cols-1 gap-6">
                    {areaFlag.map((a: ModeDto, i: number) => {
                      return (

                        <div className="flex">
                          <Switch
                            key={i}
                            label={a.name}
                            defaultChecked={false}
                            onChange={(checked: boolean) => setDto(prev => ({ ...prev, areaFlag: checked ? prev.areaFlag | a.value : prev.areaFlag & (~a.value) }))}
                          />
                          {/* <div>
                      <Info2Icon />
                      <button data-popover="#popover-right" data-popover-placement="right" className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex rounded-lg px-4 py-3 text-sm font-medium text-white">
                        Popover on Right
                      </button>

                      <div className="absolute z-99999 bg-white border border-gray-200 rounded-xl dark:bg-[#1E2634] dark:border-gray-700 block">
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

                    </div> */}

                        </div>

                      )
                    })}
                  </div>
                </div>
              </div>
            </div>


          }

          {
            activeTab == FormTab.Occupancy &&
            <div className="flex flex-col justify-center items-center">
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
            </div>

          }

        </div>


        <div className="mt-6 flex w-full items-center justify-between gap-3">
          <div>
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={() => goToStep(currentStepIndex - 1)}
                className="min-w-[120px]"
                size="sm"
              >
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant='danger' onClickWithEvent={handleClickWithEvent} name='close' className="min-w-[120px]" size="sm">Cancel</Button>
            {isLastStep ? (
              <Button
                disabled={type == FormType.INFO}
                onClickWithEvent={handleClickWithEvent}
                name={type == FormType.UPDATE ? "update" : "create"}
                className="min-w-[120px]"
                size="sm"
              >
                {type == FormType.UPDATE ? "Update" : "Create"}
              </Button>
            ) : (
              <Button onClick={() => goToStep(currentStepIndex + 1)} className="min-w-[120px]" size="sm">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </>

  )
}