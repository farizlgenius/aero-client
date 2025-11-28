import { PropsWithChildren, useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { AccessGroupDto } from "../../model/AccessGroup/AccessGroupDto";
import { Options } from "../../model/Options";
import HttpRequest from "../../utility/HttpRequest";
import { DoorDto } from "../../model/Door/DoorDto";
import { TimeZoneDto } from "../../model/TimeZone/TimeZoneDto";
import { AccessLevelDoorTimeZoneDto } from "../../model/AccessGroup/AccessLevelDoorTimeZoneDto";
import { HttpMethod } from "../../enum/HttpMethod";
import { TimeZoneEndPoint } from "../../endpoint/TimezoneEndpoint";
import { DoorEndpoint } from "../../endpoint/DoorEndpoint";
import { CreateUpdateAccessGroupDto } from "../../model/AccessGroup/CreateUpdateAccessGroupDto";
import { CreateUpdateAccessGroupDoorTimezone } from "../../model/AccessGroup/CreateUpdateAccessGroupDoorTimezone";
import Helper from "../../utility/Helper";



interface AccessGroupFormProp {
  isUpdate: boolean,
  handleClickWithEvent: (e: React.MouseEvent<HTMLButtonElement>) => void,
  setAccessGroupDto: React.Dispatch<React.SetStateAction<CreateUpdateAccessGroupDto>>;
  data: CreateUpdateAccessGroupDto
}


const AccessGroupForm: React.FC<PropsWithChildren<AccessGroupFormProp>> = ({ isUpdate, handleClickWithEvent, setAccessGroupDto, data }) => {
  const [doorOption, setDoorOption] = useState<Options[]>([]);
  const [timeZoneOption, setTimeZoneOption] = useState<Options[]>([]);
  const [addDoorForm, setAddDoorForm] = useState<boolean>(false);
  const [doorTimezone, setDoorTimezone] = useState<CreateUpdateAccessGroupDoorTimezone>({
    doorId: -1,
    doorName: "",
    doorMacAddress: "",
    timeZoneName: "",
    timeZoneId: -1,
  });



  const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.name)
    switch (e.target.name) {
      case "door":
        setDoorTimezone(prev => ({ ...prev, doorId: Number(value), doorName: doorOption.find(a => a.value === Number(value))?.label ?? "",doorMacAddress:doorOption.find(a => a.value === Number(value))?.description ?? "" }))
        break;
      case "timezone":
        setDoorTimezone(prev => ({ ...prev, timeZoneId: Number(value), timeZoneName: timeZoneOption.find(a => a.value === Number(value))?.label ?? "" }))
        break;
      default:
        break;
    }

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessGroupDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }





  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.name) {
      case "addDoor":
        setAccessGroupDto(prev => ({...prev,createUpdateAccessLevelDoorTimeZoneDto:[...prev.createUpdateAccessLevelDoorTimeZoneDto,doorTimezone]}))
        setDoorTimezone({
          doorId: -1,
          doorName: "",
          doorMacAddress: "",
          timeZoneName: "",
          timeZoneId: -1,
        })
        setDoorOption(Helper.updateOptionByValue(doorOption,doorTimezone.doorId,true))
        setAddDoorForm(false)
        break;
      case "cancelDoor":
        setAddDoorForm(false)
        break;
      default:
        break;
    }
  }

  const handleClickAnchor = () => {
    setAddDoorForm(true);
  }




  // Fetch Data
  const fetchDoor = async () => {
    let res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACR_LIST)
    if (res && res.data.data) {
      res.data.data.map((a: DoorDto) => {
        setDoorOption(prev => ([...prev, {
          value: a.componentId,
          label: a.name,
          description:a.macAddress,
          isTaken: false
        }]))
      })
    }
  }

  const fetchTimeZone = async () => {
    let res = await HttpRequest.send(HttpMethod.GET, TimeZoneEndPoint.GET_TZ_LIST)
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

  useEffect(() => {
    fetchDoor();
    fetchTimeZone();
  }, [])

  return (
    <ComponentCard title="Add Access Level">

      {/*sm:flex-row sm:gap-8 */}
      <div className="flex flex-col justify-center items-center gap-6 ">
        {addDoorForm ?
          <div className='flex flex-col items-center gap-2 w-1/2'>
            <div className="flex gap-5 w-3/4">
              <div className='flex-1'>
                <Label>Door</Label>
                <Select
                  name="door"
                  options={doorOption.filter(x => x.isTaken == false)}
                  placeholder="Select Option"
                  onChangeWithEvent={handleSelect}
                  className="dark:bg-dark-900"
                  defaultValue={doorTimezone.doorId}
                />
              </div>
              <div className='flex-1'>
                <Label>Time Zone</Label>
                <Select
                  isString={false}
                  name="timezone"
                  options={timeZoneOption.filter(x => x.isTaken == false)}
                  placeholder="Select Option"
                  onChangeWithEvent={handleSelect}
                  className="dark:bg-dark-900"
                  defaultValue={doorTimezone.timeZoneId}
                />
              </div>
            </div>
            <div className="flex  flex-col w-1/5 gap-2">
              <Button onClickWithEvent={handleClick} name='addDoor' size='sm'>Add</Button>
              <Button onClickWithEvent={handleClick} name='cancelDoor' size='sm' variant='danger' >Cancel</Button>

            </div>

          </div>

          :
          <>
            <div className="flex flex-col w-1/2 gap-6">
              <div className='flex flex-col gap-1'>
                <Label htmlFor="name">Name</Label>
                <Input name="name" type="text" id="name" onChange={handleChange} value={data.name} />

              </div>
              <div className="flex flex-col gap-4 swim-lane">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                    Doors
                  </h3>
                  <a onClick={handleClickAnchor} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                {data.createUpdateAccessLevelDoorTimeZoneDto.map((a: CreateUpdateAccessGroupDoorTimezone, i: number) => (
                  <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex items-start w-full gap-4">
                        <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                          <div className="relative flex items-start">
                            <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                              {a.doorName}  {a.timeZoneName}
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
              <Button name="create" onClickWithEvent={handleClickWithEvent} className='w-50'>Create</Button>
              <Button name="cancle" onClickWithEvent={handleClickWithEvent} className='w-50' variant="danger">Cancle</Button>
            </div>
          </>

        }

      </div >

    </ComponentCard >
  )
}

export default AccessGroupForm