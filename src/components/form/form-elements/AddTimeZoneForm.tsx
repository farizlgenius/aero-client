import React, { PropsWithChildren, useRef, useState } from 'react'
import ComponentCard from '../../common/ComponentCard';
import Button from '../../ui/button/Button';
import Label from '../Label';
import axios from 'axios';
import Input from '../input/InputField';
import { TimeIcon } from '../../../icons';
import ActionElement from '../../../pages/UiElements/ActionElement';

import Checkbox from '../input/Checkbox';
import DatePicker from '../date-picker';

// Global Variable

const server = import.meta.env.VITE_SERVER_IP;

// interface 
interface Option {
  value: string | number;
  label: string;
}

interface AddCredentialProps {
  onSubmitHandle?: () => void
}

interface CreateTimeZoneDto {
  name: string;
  tzNumber: number;
  activeTime: string;
  deactiveTime: string;
  intervals: number;
  intervalsDetail: CreateIntervalDto[]
}

interface CreateIntervalDto {
  tzNumber: number;
  intervalNumber: number;
  Days: DaysInWeek;
  iStart: string;
  iEnd: string;
}

interface DaysInWeek {
  Sunday: boolean;
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean
}

const daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const AddTimeZoneForm: React.FC<PropsWithChildren<AddCredentialProps>> = ({ onSubmitHandle }) => {
  const [dayChecked, setDayChecked] = useState<DaysInWeek>({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false
  });
  const [addIntervalForm, setAddIntervalForm] = useState<boolean>(false);
  const [createIntervalDto, setCreateIntervalDto] = useState<CreateIntervalDto>({
    tzNumber: 0,
    intervalNumber: 0,
    Days: dayChecked,
    iStart: "",
    iEnd: ""
  });
  const [createIntervalDtoList, setCreateIntervalDtoList] = useState<CreateIntervalDto[]>([]);
  const [createTimeZoneDto, setCreateTimeZoneDto] = useState<CreateTimeZoneDto>({
    tzNumber: 0,
    name: "",
    activeTime: "",
    deactiveTime: "",
    intervals: 0,
    intervalsDetail: []
  })

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.name);
    setDayChecked((prev) => ({ ...prev, [e.target.name]: e.target.checked }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateTimeZoneDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "IStart":
        setCreateIntervalDto((prev) => ({ ...prev, iStart: e.target.value }))
        break;
      case "IEnd":
        setCreateIntervalDto((prev) => ({ ...prev, iEnd: e.target.value }))
        break;
    }
  }




  {/* Tab */ }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.name) {
      case "addInterval":
        createIntervalDto.Days = dayChecked;
        setCreateIntervalDtoList((prev) => ([...prev, createIntervalDto]))
        setAddIntervalForm(false);
        break;
      case "cancelInterval":
        setAddIntervalForm(false);
        break;
      default:
        break;
    }
  }


  const handleOutsideSubmit = () => {
    //formRef.current?.requestSubmit();
    console.log("Yes")
    addTimeZone(createTimeZoneDto)
  }

  const handleClickCredential = () => {
    setAddIntervalForm(true);
  }



  {/* handle Table Action */ }
  const handleOnClickEdit = () => {

  }

  const handleOnClickRemove = (data: Object) => {
    console.log(data);
  }

  const toLocalISOWithOffset = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const offsetMinutes = pad(Math.abs(tzOffset) % 60);

    return (
      date.getFullYear() + "-" +
      pad(date.getMonth() + 1) + "-" +
      pad(date.getDate()) + "T" +
      pad(date.getHours()) + ":" +
      pad(date.getMinutes()) + ":" +
      pad(date.getSeconds()) +
      sign + offsetHours + ":" + offsetMinutes
    );
  }



  const addTimeZone = async (data: CreateTimeZoneDto) => {
    data.intervalsDetail = createIntervalDtoList;
    try {
      const res = await axios.post(`${server}/api/v1/tz/add`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(res)
      if (res.status == 201 || res.status == 200) {

      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ComponentCard title="Add Time Zone">

      {/* {scanCard && <Modals isWide={false} body={<ScanCard onStartScan={handleStartScan} />} closeToggle={() => setScanCard(false)} />} */}

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">

        <div /* ref={formRef} onSubmit={handleSubmit} */ >
          <div className='w-[60%]'>
            <div className='flex flex-col gap-1 w-100'>
              {addIntervalForm ?
                <div>
                  <div className='flex flex-col gap-2'>
                    <Label>Days</Label>
                    {daysInWeek.map((a: string, i: number) => (
                      <div key={i} className='flex gap-2 justify-around items-center'>
                        <div className='flex-1' >
                          <Checkbox
                            name={a}
                            checked={dayChecked[a as keyof DaysInWeek]}
                            onChange={handleCheck}
                            label={a}
                          />
                        </div>
                      </div>
                    ))}
                    <div className='flex gap-2'>
                      <div className="relative flex-1">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          id="tm"
                          name="IStart"
                          onChange={handleChangeTime}
                          defaultValue={"00:00"}
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
                          name="IEnd"
                          onChange={handleChangeTime}
                          defaultValue={"23:59"}
                        />
                        <span className="absolute text-gray-500 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <TimeIcon className="size-6" />
                        </span>
                      </div>

                    </div>



                  </div>
                  <div className='mt-3 flex gap-2'>
                    <Button onClickWithEvent={handleClick} name='addInterval' size='sm'>Add Interval</Button>
                    <Button variant='danger' onClickWithEvent={handleClick} name='cancelInterval' size='sm'>Cancel</Button>
                  </div>

                </div>
                :

                <div className="flex flex-col gap-2">
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} value={createTimeZoneDto.name} />

                    <div>
                      <DatePicker
                        id="activeTime"
                        label="Activate Date"
                        placeholder="Select a date"
                        onChange={(dates, currentDateString) => {
                          // Handle your logic
                          console.log({ dates, currentDateString });
                          setCreateTimeZoneDto((prev) => ({ ...prev, activeTime: toLocalISOWithOffset(dates[0]) }))
                        }}
                      />
                    </div>
                    <div>
                      <DatePicker
                        id="deactiveTime"
                        label="Deactive Date"
                        placeholder="Select a date"
                        onChange={(dates, currentDateString) => {
                          // Handle your logic
                          console.log({ dates, currentDateString });
                          setCreateTimeZoneDto((prev) => ({ ...prev, deactiveTime: toLocalISOWithOffset(dates[0]) }))
                        }}

                      />
                    </div>
                  </div>
                  <br />
                  <div className="flex flex-col gap-4 swim-lane">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                        Intervals
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                          0/12
                        </span>
                      </h3>
                      <a onClick={() => handleClickCredential()} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    {createIntervalDtoList.map((a: CreateIntervalDto, i: number) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex items-start w-full gap-4">
                            <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                              <div className="relative flex items-start">
                                <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                  {a.iStart} - {a.iEnd}
                                </p>
                              </div>
                            </label>
                          </div>

                          <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={{}} />
                          </div>
                        </div>
                      </div>

                    ))}


                  </div>
                  <Button onClickWithEvent={handleOutsideSubmit} className='w-50'>Add Time Zone</Button>
                </div>

              }

            </div>
          </div>
        </div >

      </div >

    </ComponentCard >
  )
}

export default AddTimeZoneForm