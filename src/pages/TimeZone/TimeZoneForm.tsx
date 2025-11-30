import React, { PropsWithChildren, useEffect, useState } from 'react'
import ComponentCard from '../../components/common/ComponentCard';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import DatePicker from '../../components/form/date-picker';
import HttpRequest from '../../utility/HttpRequest';
import Select from '../../components/form/Select';
import Modals from '../UiElements/Modals';
import { usePopupActions } from '../../utility/PopupCalling';
import Helper from '../../utility/Helper';
import ActionElement from '../UiElements/ActionElement';
import { IntervalDto } from '../../model/Interval/IntervalDto';
import { TimeZoneDto } from '../../model/TimeZone/TimeZoneDto';
import { Options } from '../../model/Options';
import { ModeDto } from '../../model/ModeDto';
import { HttpMethod } from '../../enum/HttpMethod';
import { TimeZoneEndPoint } from '../../endpoint/TimezoneEndpoint';
import { IntervalEndpoint } from '../../endpoint/IntervalEndpoint';
import { useLocation } from '../../context/LocationContext';


export interface TimeZoneFormProp {
  isUpdate?: boolean;
  data: TimeZoneDto
  setTimeZoneDto: React.Dispatch<React.SetStateAction<TimeZoneDto>>;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}




const TimeZoneForm: React.FC<PropsWithChildren<TimeZoneFormProp>> = ({ isUpdate = false, setTimeZoneDto, data, handleClick }) => {
  const { showPopup } = usePopupActions();
  const { locationId } = useLocation();
  const [modeDetail, setModeDetail] = useState<string>("");
  const [modeDetailPopup, setModeDetailPopup] = useState<boolean>(false);
  const [modeOption, setModeOption] = useState<Options[]>([])
  const [intervalOption, setIntervalOption] = useState<Options[]>([])
  const [intervalForm, setIntervalForm] = useState<boolean>(false);
  const defaultIntervalDto: IntervalDto = {
    uuid: "",
    locationId: locationId,
    isActive: true,
    componentId: -1,
    days: {
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false
    },
    daysDesc: "",
    startTime: "",
    endTime: ""
  }
  const [interval, setInterval] = useState<IntervalDto>(defaultIntervalDto);
  const [allIntervals, setAllIntervals] = useState<IntervalDto[]>([]);
  // const [intervalsDto, setIntervalsDto] = useState<IntervalDto[]>([]);



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


  const fetchMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, TimeZoneEndPoint.GET_MODE_TZ)
    if (res) {
      if (res.data.code == 200) {
        res.data.data.map((a: ModeDto) => {
          setModeOption((prev) => [...prev, {
            value: a.value,
            label: a.name,
            description: a.description
          }])
        })
      }
    }
  }

  const fetchInterval = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, IntervalEndpoint.GET_INTERVAL)
    if (res) {
      if (res.data.code == 200) {
        setAllIntervals(res.data.data)
        res.data.data.map((a: IntervalDto) => {
          setIntervalOption((prev) => [...prev, {
            label: a.startTime + " - " + a.endTime + " " + a.daysDesc,
            value: a.componentId,
          }])
        })
      }
    }
  }

  const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(value)
    setInterval(allIntervals.filter(a => a.componentId == Number(value))[0]);
  }

  const handleClickWithData = (data: IntervalDto) => {
    setIntervalOption(prev => Helper.updateOptionByValue(prev, data.componentId, false));
    setTimeZoneDto((prev: TimeZoneDto) => ({ ...prev, intervals: [...prev.intervals.filter(a => a.componentId !== data.componentId)] }));
  };
  const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e)
    switch (e.currentTarget.name) {
      case "close":
        setModeDetailPopup(false);
        break;
      case "detail":
        setModeDetail(modeOption.filter(a => a.value == data.mode)[0].description ?? "")
        console.log(e.currentTarget.name);
        setModeDetailPopup(true);
        break;
      case "interval":
        if (interval.componentId == -1) {
          showPopup(false, ["Please select interval"])
        }
        else {
          setTimeZoneDto((prev: TimeZoneDto) => ({ ...prev, intervals: [...prev.intervals, interval] }))
          setIntervalOption((prev) => Helper.updateOptionByValue(prev, interval.componentId, true))
          setIntervalForm(false);
          setInterval(defaultIntervalDto)
        }
        break;
      default:
        break;
    }

  }

  useEffect(() => {
    fetchMode()
    fetchInterval()
  }, [])

  return (
    <>
      {modeDetailPopup && <Modals isWide={false} header='Details' body={modeDetail} handleClickWithEvent={handleClickWithEvent} />}

      <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">


          <div className="flex flex-1 gap-6">
            {/* Normal Form */}
            <div className='flex-1'>
              <div className='flex flex-col gap-3'>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input name="name" type="text" id="name" onChange={(e) => setTimeZoneDto((prev: TimeZoneDto) => ({ ...prev, name: e.target.value }))} value={data.name} />
                </div>

                <div>
                  <DatePicker
                    id="activeTime"
                    label="Activate Date"
                    placeholder="Select a date"
                    value={data.activeTime}
                    onChange={(dates, currentDateString) => {
                      // Handle your logic
                      console.log({ dates, currentDateString });
                      setTimeZoneDto((prev: TimeZoneDto) => ({ ...prev, activeTime: toLocalISOWithOffset(dates[0]) }))
                    }}
                  />
                </div>
                <div>
                  <DatePicker
                    id="deactiveTime"
                    label="Deactive Date"
                    placeholder="Select a date"
                    value={data.deactiveTime}
                    onChange={(dates, currentDateString) => {
                      // Handle your logic
                      console.log({ dates, currentDateString });
                      setTimeZoneDto((prev: TimeZoneDto) => ({ ...prev, deactiveTime: toLocalISOWithOffset(dates[0]) }))
                    }}
                  />
                </div>
                <div >
                  <Label>TimeZone Mode</Label>
                  <div className='flex gap-2'>
                    <Select
                      name="mode"
                      options={modeOption}
                      placeholder="Select Option"
                      onChangeWithEvent={(e) => setTimeZoneDto((prev: TimeZoneDto) => ({ ...prev, mode: Number(e) }))}
                      className="dark:bg-dark-900"
                      defaultValue={data.mode == -1 ? -1 : data.mode}
                    />
                    <Button name='detail' onClickWithEvent={handleClickWithEvent}>Info</Button>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <Button onClickWithEvent={handleClick} name='create' className='w-50'>Create</Button>
                  <Button onClickWithEvent={handleClick} name='close' className='w-50 danger'>Cancel</Button>
                </div>
              </div>
            </div>
            {/* Interval */}
            <div className='flex-1'>
              {intervalForm ?
                <>
                  {/* Interval Form */}
                  <div>
                    <div className='flex flex-col gap-2'>
                      <Label>Intervals</Label>
                      <Select
                        isString={true}
                        name="intervals"
                        options={intervalOption.filter(a => a.isTaken != true)}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelect}
                        className="dark:bg-dark-900"
                      />
                    </div>
                    <div className='mt-3 flex gap-2'>
                      <Button onClickWithEvent={handleClickWithEvent} name='interval' size='sm'>Add Interval</Button>
                      <Button variant='danger' onClick={() => setIntervalForm(false)} name='cancelInterval' size='sm'>Cancel</Button>
                    </div>
                  </div>
                </>
                :
                <>
                  <div className="flex flex-col gap-4 swim-lane">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                        Intervals {data.intervals.length}/12
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                          {/* {createIntervalDtoList.length}/12 */}
                        </span>
                      </h3>
                      <a onClick={() => setIntervalForm(true)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    {data.intervals.map((a: IntervalDto, i: number) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex items-start w-full gap-4">
                            <label className="w-full cursor-pointer">
                              <div className="relative flex items-start">
                                <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                  {a.startTime} - {a.endTime} : {a.daysDesc}
                                </p>
                              </div>
                            </label>
                          </div>
                          <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                            <ActionElement<IntervalDto> onEditClick={(data) => handleClickWithData(data)} onRemoveClick={(data) => handleClickWithData(data)} data={a} RemoveOnly={true} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              }


            </div>
          </div>
        </div >

      </div>


    </>

  )
}

export default TimeZoneForm