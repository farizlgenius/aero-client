import { PropsWithChildren, useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { Options } from "../../model/Options";
import { DoorDto } from "../../model/Door/DoorDto";
import { TimeZoneDto } from "../../model/TimeZone/TimeZoneDto";
import { TimeZoneEndPoint } from "../../endpoint/TimezoneEndpoint";
import { DoorEndpoint } from "../../endpoint/DoorEndpoint";
import { CreateUpdateAccessLevelDto } from "../../model/AccessGroup/CreateUpdateAccessLevelDto";
import { AccessLevelComponentDto } from "../../model/AccessGroup/AccessLevelComponentDto";
import { send } from "../../api/api";
import { useLocation } from "../../context/LocationContext";
import { FormProp, FormType } from "../../model/Form/FormProp";
import { AccessLevelDoorComponentDto } from "../../model/AccessGroup/AccessLevelDoorComponentDto";
import { GroupIcon } from "../../icons";




const AccessLevelForm: React.FC<PropsWithChildren<FormProp<CreateUpdateAccessLevelDto>>> = ({ dto, setDto, handleClick, type }) => {
  const defaulComponent: AccessLevelComponentDto = {
    mac: "",
    doorComponent: []
  }
  const defaultDoorComponent: AccessLevelDoorComponentDto = {
    acrId: -1,
    timezoneId: -1
  }
  const { locationId } = useLocation();
  const [doorOption, setDoorOption] = useState<Options[]>([]);
  const [timeZoneOption, setTimeZoneOption] = useState<Options[]>([]);
  const [components, setComponents] = useState<AccessLevelComponentDto[]>([]);
  const [doorComponent, setDoorComponent] = useState<AccessLevelDoorComponentDto>(defaultDoorComponent);
  const [selectComponent, setSelectComponent] = useState({
    mac: "",
    acrId: -1,
    timezoneId: -1
  })



  const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.name)
    switch (e.target.name) {
      case "door":
        // setDoorTimezone(prev => ({ ...prev, doorId: Number(value), doorName: doorOption.find(a => a.value === Number(value))?.label ?? "", doorMacAddress: doorOption.find(a => a.value === Number(value))?.description ?? "" }))
        setSelectComponent(prev => ({ ...prev, mac: doorOption.find(a => a.value === Number(value))?.description ?? "", acrId: Number(value) }))
        break;
      case "timezone":
        // setDoorTimezone(prev => ({ ...prev, timeZoneId: Number(value), timeZoneName: timeZoneOption.find(a => a.value === Number(value))?.label ?? "" }))
        setSelectComponent(prev => ({ ...prev, timezoneId: Number(value) }))
        break;
      default:
        break;
    }

  }




  // Fetch Data
  const fetchDoor = async () => {
    let res = await send.get(DoorEndpoint.GET_ACR_LIST(locationId))
    if (res && res.data.data) {
      res.data.data.map((a: DoorDto) => {
        setDoorOption(prev => ([...prev, {
          value: a.componentId,
          label: a.name,
          description: a.mac,
          isTaken: false
        }]))
      })
    }
  }

  const fetchTimeZone = async () => {
    let res = await send.get(TimeZoneEndPoint.GET)
    if (res && res.data.data) {
      res.data.data.map((a: TimeZoneDto) => {
        setTimeZoneOption(prev => ([...prev, {
          value: a.componentId,
          label: a.name,
          isTaken: false
        }]))
      })
    }
  }

  const Info = ({ label, value }: { label: string; value: any }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="font-medium text-gray-800 dark:text-white/90">
        {value}
      </span>
    </div>
  );

  useEffect(() => {
    fetchDoor();
    fetchTimeZone();
  }, [])

  return (
    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {/*sm:flex-row sm:gap-8 */}
      <div className="flex flex-col justify-center items-center gap-6 ">
        <>
          <div className="flex flex-col gap-6 w-full">
            <div className='flex flex-col gap-1'>
              <Label htmlFor="name">Name</Label>
              <Input disabled={type == FormType.INFO} name="name" type="text" id="name" value={dto.name} onChange={e => setDto(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            {/* <div className="flex flex-col gap-4 swim-lane">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                    Doors / Timezone
                  </h3>

                </div>
              </div> */}
            {/* List Transfer */}
            <div className='flex gap-2 items-end'>
              <div className='flex-2'>
                <Label>Door</Label>
                <Select
                  disabled={type == FormType.INFO}
                  name="door"
                  options={doorOption.filter(x => x.isTaken == false)}
                  placeholder="Select Option"
                  onChangeWithEvent={handleSelect}
                  className="dark:bg-dark-900"
                  defaultValue={selectComponent.acrId}
                />
              </div>
              <div className='flex-2'>
                <Label>Time Zone</Label>
                <Select
                  disabled={type == FormType.INFO}
                  isString={false}
                  name="timezone"
                  options={timeZoneOption.filter(x => x.isTaken == false)}
                  placeholder="Select Option"
                  onChangeWithEvent={handleSelect}
                  className="dark:bg-dark-900"
                  defaultValue={selectComponent.timezoneId}
                />

              </div>
              <div>
                <Button onClickWithEvent={() => {
                  if (dto.components.length > 0) {
                    dto.components.forEach(element => {
                      if (element.mac == selectComponent.mac) {
                        element.doorComponent.push({
                          acrId: selectComponent.acrId,
                          timezoneId: selectComponent.timezoneId
                        });
                      }
                    });
                  } else {
                    dto.components.push({
                      mac: selectComponent.mac,
                      doorComponent: [
                        {
                          acrId: selectComponent.acrId,
                          timezonId: selectComponent.timezoneId
                        }
                      ]
                    })
                  }

                }} name='addDoor' size='sm'>Add</Button>
              </div>

            </div>

            <div className="flex justify-stretch w-full">
              <div className="items-center w-full">
                <div>
                  <Label>Doors / Timezone</Label>
                  <div className="flex flex-col gap-2 overflow-auto scrollbar-thin scrollbar-transparent h-64 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs bg-transparent">
                    {dto.components.map((item) => (
                      <div
                        key={Number(item.mac)}
                      // onClick={() => toggle(setSelectedLeft, Number(item.value))}
                      // className={itemClass(selectedLeft.has(Number(item.value)))}
                      >
                        {/* Icon */}
                        <div className="pt-1">
                          <GroupIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 grid grid-cols-2 gap-y-1 gap-x-4">
                          <Info label="Name" value={item.name} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>


            <div className='flex flex-col gap-1'>
              {dto.components.map((a: AccessLevelComponentDto, i: number) => (
                <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-start w-full gap-4">
                      <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                        <div className="relative flex items-start">
                          <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                            {a.mac}  {a.mac}
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                      {/* <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={a} /> */}
                    </div>
                  </div>
                </div>

              ))}

            </div>
          </div>
          <div className="flex gap-5">
            <Button name="create" onClickWithEvent={handleClick} className='w-50'>Create</Button>
            <Button name="cancle" onClickWithEvent={handleClick} className='w-50' variant="danger">Cancel</Button>
          </div>
        </>

      </div >
    </div>


  )
}

export default AccessLevelForm