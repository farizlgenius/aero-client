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
import { DoorIcon, GroupIcon, TimeIcon } from "../../icons";
import React from "react";




const AccessLevelForm: React.FC<PropsWithChildren<FormProp<CreateUpdateAccessLevelDto>>> = ({ dto, setDto, handleClick, type }) => {
  const defaulComponent: AccessLevelComponentDto = {
    mac: "",
    doorId: -1,
    acrId: -1,
    timezoneId: -1,
    alvlId: -1
  }

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDto(prev => ({ ...prev, components: prev.components.filter(x => x.doorId != id) }));
  };
  const { locationId } = useLocation();
  const [doorOption, setDoorOption] = useState<Options[]>([]);
  const [timeZoneOption, setTimeZoneOption] = useState<Options[]>([]);
  const [selectComponent, setSelectComponent] = useState<AccessLevelComponentDto>(defaulComponent)



  const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.name)
    switch (e.target.name) {
      case "door":
        // setDoorTimezone(prev => ({ ...prev, doorId: Number(value), doorName: doorOption.find(a => a.value === Number(value))?.label ?? "", doorMacAddress: doorOption.find(a => a.value === Number(value))?.description ?? "" }))
        setSelectComponent(prev => ({ ...prev, mac: doorOption.find(a => a.value === Number(value))?.description ?? "", doorId: Number(value), acrId: doorOption.find(a => a.value === Number(value))?.additionalInfo ?? -1 }))
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
    let res = await send.get(DoorEndpoint.GET(locationId))
    if (res && res.data.data) {
      res.data.data.map((a: DoorDto) => {
        setDoorOption(prev => ([...prev, {
          value: a.componentId,
          label: a.name,
          description: a.mac,
          additionalInfo: a.acrId,
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

                  // setDto(prev => ({
                  //   ...prev,
                  //   components: prev.components.length === 0 ?
                  //     [{
                  //       mac: selectComponent.mac, doorComponent: [{
                  //         acrId: selectComponent.acrId,
                  //         doorId: selectComponent.doorId,
                  //         timezoneId: selectComponent.timezoneId
                  //       }]
                  //     }]
                  //     :
                  //     prev.components.map(x => x.mac === selectComponent.mac ? {
                  //       ...x,
                  //       doorComponent: [...x.doorComponent, selectComponent]
                  //     } : x)
                  // }));

                  setDto(prev => ({
                    ...prev,
                    components: prev.components.length != 0 ? [...prev.components, selectComponent] : [{
                      mac: selectComponent.mac,
                      doorId: selectComponent.doorId,
                      alvlId: selectComponent.alvlId,
                      acrId: selectComponent.acrId,
                      timezoneId: selectComponent.timezoneId
                    }]
                  }))

                }} name='addDoor' size='sm'>Add</Button>
              </div>

            </div>

            <div className="flex justify-stretch w-full">
              <div className="items-center w-full">
                <div>
                  <Label>Doors / Timezone</Label>

                  <div className="flex flex-col gap-2 overflow-auto scrollbar-thin scrollbar-transparent h-64 w-full rounded-lg border px-4 py-3 text-sm shadow-theme-xs bg-transparent">
                    {dto.components.map((item, i) => {
                      const isSelected = selectedId === item.doorId;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedId(item.doorId)}
                          onDoubleClick={() => handleDelete(item.doorId)}
                          className={`flex gap-4 rounded-lg border p-4 cursor-pointer transition select-none ${isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                            } hover:shadow-md`}
                        >
                          {/* Icon */}
                          <div className="pt-1">
                            <DoorIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-y-1 gap-x-4">
                            <Info label="Door" value={doorOption.find(x => x.value == item.doorId)?.label || "Unknown"} />
                          </div>
                          <div className="pt-1">
                            <TimeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-y-1 gap-x-4">
                            <Info label="Timezone" value={timeZoneOption.find(x => x.value == item.timezoneId)?.label || "Unknown"} />
                          </div>
                        </div>
                      )
                    }


                    )}
                  </div>
                </div>

              </div>
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