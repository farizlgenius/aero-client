import React, { PropsWithChildren, useEffect, useState } from 'react'
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Button from '../../components/ui/button/Button';
import DatePicker from '../../components/form/date-picker';
import Select from '../../components/form/Select';
import Modals from '../UiElements/Modals';
import { usePopupActions } from '../../utility/PopupCalling';
import Helper from '../../utility/Helper';
import ActionElement from '../UiElements/ActionElement';
import { IntervalDto } from '../../model/Interval/IntervalDto';
import { TimeZoneDto } from '../../model/TimeZone/TimeZoneDto';
import { Options } from '../../model/Options';
import { ModeDto } from '../../model/ModeDto';
import { TimeZoneEndPoint } from '../../endpoint/TimezoneEndpoint';
import { IntervalEndpoint } from '../../endpoint/IntervalEndpoint';
import { useLocation } from '../../context/LocationContext';
import { FormProp, FormType } from '../../model/Form/FormProp';
import { send } from '../../api/api';
import { CalenderIcon, TimeIcon } from '../../icons';
import TextArea from '../../components/form/input/TextArea';
import { useToast } from '../../context/ToastContext';



const TimeZoneForm: React.FC<PropsWithChildren<FormProp<TimeZoneDto>>> = ({ type, setDto, dto, handleClick }) => {
  const { toggleToast} = useToast();
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
    const res = await send.get(TimeZoneEndPoint.GET_MODE);
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
    const res = await send.get(IntervalEndpoint.LOCATION(locationId))
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
    setDto((prev: TimeZoneDto) => ({ ...prev, intervals: [...prev.intervals.filter(a => a.componentId !== data.componentId)] }));
  };
  const handleClickWithEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e)
    switch (e.currentTarget.name) {
      case "close":
        setModeDetailPopup(false);
        break;
      case "detail":
        setModeDetail(modeOption.filter(a => a.value == dto.mode)[0].description ?? "")
        // setModeDetailPopup(true);
        break;
      case "interval":
        if (interval.componentId == -1) {
          toggleToast("warning", "Please select interval")
        }
        else {
          setDto((prev: TimeZoneDto) => ({ ...prev, intervals: [...prev.intervals, interval] }))
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
        <div className="flex w-full p-7 flex-col sm:flex-row sm:gap-8">

          {/* Normal Form */}
          <div className='flex-1'>
            <div className='flex flex-col gap-3'>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input disabled={type == FormType.INFO} name="name" type="text" id="name" onChange={(e) => setDto((prev: TimeZoneDto) => ({ ...prev, name: e.target.value }))} value={dto.name} />
              </div>

              <div>
                <DatePicker
                  id="activeTime"
                  label="Activate Date"
                  placeholder="Select a date"
                  value={dto.activeTime}
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                    setDto((prev: TimeZoneDto) => ({ ...prev, activeTime: toLocalISOWithOffset(dates[0]) }))
                  }}
                />
              </div>
              <div>
                <DatePicker
                  id="deactiveTime"
                  label="Deactive Date"
                  placeholder="Select a date"
                  value={dto.deactiveTime}
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                    setDto((prev: TimeZoneDto) => ({ ...prev, deactiveTime: toLocalISOWithOffset(dates[0]) }))
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
                    onChangeWithEvent={(e) => {
                      setDto((prev: TimeZoneDto) => ({ ...prev, mode: Number(e) }));
                      setModeDetail(modeOption.filter(a => a.value == dto.mode)[0].description ?? "")
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={dto.mode == -1 ? -1 : dto.mode}
                  />
                </div>
              </div>
              <div>
                <TextArea disabled={true} value={modeDetail} placeholder='Detail info will show here'/>
              </div>
              <div className='flex gap-4'>
                <Button disabled={type == FormType.INFO} onClickWithEvent={handleClick} name={type == FormType.UPDATE ? "update" : "create"} className='w-50'>{type == FormType.UPDATE ? "Update" : "Create"}</Button>
                <Button variant='danger' onClickWithEvent={handleClick} name='close' className='w-50 danger'>Cancel</Button>
              </div>
            </div>
          </div>
          {/* Interval */}
          <div className="flex-1 flex flex-col gap-5 items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className='w-full'>
              {intervalForm ?
                <>
                  {/* Interval Form */}
                  <div>
                    <div className='flex flex-col gap-2'>
                      <Label>Intervals</Label>
                      <Select
                        isString={false}
                        name="intervals"
                        options={intervalOption.filter(a => a.isTaken != true)}
                        defaultValue={interval.componentId}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelect}
                        className="dark:bg-dark-900"
                      />
                    </div>
                    <div className='mt-3 flex gap-2'>
                      <Button disabled={type == FormType.INFO} onClickWithEvent={handleClickWithEvent} name='interval' size='sm'>Add</Button>
                      <Button disabled={type == FormType.INFO} variant='danger' onClick={() => setIntervalForm(false)} name='cancelInterval' size='sm'>Cancel</Button>
                    </div>
                  </div>
                </>
                :
                <>
                  <div className="flex flex-col gap-4 swim-lane">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                        Intervals {dto.intervals.length}/12
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                          {/* {createIntervalDtoList.length}/12 */}
                        </span>
                      </h3>
                      <a onClick={() => setIntervalForm(true)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    {dto.intervals.map((a: IntervalDto, i: number) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex items-start w-full gap-4">
                            <label className="w-full cursor-pointer">
                              <div className="relative flex flex-col items-start gap-3">
                                <div className='flex justify-center items-center gap-5'>
                                  <TimeIcon fontSize={25}/>
                                  <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                    {a.startTime} - {a.endTime}
                                  </p>
                                </div>
                                <div className='flex justify-center items-center gap-5'>
                                  <CalenderIcon fontSize={25}/>
                                  <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                    {a.daysDesc}
                                  </p>
                                </div>

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