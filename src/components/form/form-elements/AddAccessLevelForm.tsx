import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import ComponentCard from '../../common/ComponentCard';
import Button from '../../ui/button/Button';
import Label from '../Label';
import axios from 'axios';
import Input from '../input/InputField';
import ActionElement from '../../../pages/UiElements/ActionElement';
import Select from '../Select';

// Global Variable

const server = import.meta.env.VITE_SERVER_IP;

// interface 
interface Option {
  value: string | number;
  label: string;
}

interface AddAccessLevelProp {
  onSubmitHandle: () => void
}

interface CreateAccessLevelDto {
  name: string;
  accessLevelNumber: number;
  mode:number;
  doors: CreateAccessLevelDoorDto[]
}

interface CreateAccessLevelDoorDto {
  scpIp:string;
  acrNumber: number;
  acrName:string;
  tzNumber: number;
  tzName:string;
}

interface TimeZoneDto {
    no:number;
    name:string;
    scpIp:string;
    tzNumber:number;
    mode:number;
    activeDate:string;
    deactiveDate:string;
    intervals:number;
}

interface DoorDto {
    name: string;
    scpIp: string;
    acrNumber: number;
    mode: number;
    acrModeDesc:string;
}


const AddAccessLevelForm: React.FC<PropsWithChildren<AddAccessLevelProp>> = ({ onSubmitHandle }) => {
  const [doorOption, setDoorOption] = useState<Option[]>([]);
  const [timeZoneOption, setTimeZoneOption] = useState<Option[]>([]);
  const [addDoorForm, setAddDoorForm] = useState<boolean>(false);
  const [createAccessLevelDoorDto, setCreateAccessLevelDoorDto] = useState<CreateAccessLevelDoorDto>({
    scpIp: "",
    acrNumber: 0,
    acrName: "",
    tzName: "",
    tzNumber: 0
  });
  const [createAccessLevelDoorList, setCreateAccessLevelDoorList] = useState<CreateAccessLevelDoorDto[]>([]);
  const [createAccessLevelDto, setCreateAccessLevelDto] = useState<CreateAccessLevelDto>({
  name: "",
  accessLevelNumber: 0,
  mode:0,
  doors: []
  })

  const handleSelect = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.name)
    if(e.target.name == "acrName"){
      const values = value.split(",");
      // Add if Empty
      if(createAccessLevelDoorDto.scpIp == ''){
        setCreateAccessLevelDoorDto(prev => ({...prev,scpIp:values[0],acrNumber:Number(values[1]),acrName:values[2]}))
      }
      createAccessLevelDoorList.map((a:CreateAccessLevelDoorDto) => {
        if(a.scpIp == values[0] && a.acrNumber == Number(values[1])){
          alert("Can't assign duplicate door to access level")
        }else{
          setCreateAccessLevelDoorDto(prev => ({...prev,scpIp:values[0],acrNumber:Number(values[1]),acrName:values[2]}))
        }
        console.log(createAccessLevelDoorDto)
      })
      
    }else if(e.target.name == "tzName"){
      const values = value.split(",");
      setCreateAccessLevelDoorDto(prev => ({...prev,tzNumber:Number(values[0]),tzName:values[1]}))
    }
    
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateAccessLevelDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }




  {/* Tab */ }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.name) {
      case "addDoor":
        setCreateAccessLevelDoorList((prev) => ([...prev, createAccessLevelDoorDto]))
        setAddDoorForm(false);
        break;
      case "cancelDoor":
        setAddDoorForm(false);
        break;
      default:
        break;
    }
  }


  const handleOutsideSubmit = () => {
    //formRef.current?.requestSubmit();
    console.log("Yes")
    addAccessLevel(createAccessLevelDto)
  }

  const handleClickAddDoor = () => {
    setAddDoorForm(true);
  }



  {/* handle Table Action */ }
  const handleOnClickEdit = (data:CreateAccessLevelDoorDto) => {
    console.log(data);
    setCreateAccessLevelDoorDto({
      scpIp: data.scpIp,
      acrNumber: data.acrNumber,
      acrName: data.acrName,
      tzNumber: data.tzNumber,
      tzName: data.tzName
    })
        setAddDoorForm(true);
  }

  const handleOnClickRemove = (data: CreateAccessLevelDoorDto) => {
    setCreateAccessLevelDoorList(createAccessLevelDoorList.filter((a:CreateAccessLevelDoorDto) => a.scpIp != data.scpIp && a.acrNumber != data.acrNumber ))
  }


  const addAccessLevel = async (data: CreateAccessLevelDto) => {
    data.doors = createAccessLevelDoorList;
    try {
      const res = await axios.post(`${server}/api/v1/acslv/add`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(res)
      if (res.status == 201 || res.status == 200) {
        onSubmitHandle();
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Fetch Data
  const fetchDoor = async () => {
    try{
      const res = await axios.get(`${server}/api/v1/acr/all`)
      console.log(res.data.content)
      res.data.content.map((a:DoorDto) => {
        setDoorOption((prev) => ([...prev,{
          value:a.scpIp +","+a.acrNumber+","+a.name,
          label:a.name,
        }]))
      })
    }catch(e){
      console.log(e)
    }
  }

    const fetchTimeZone = async () => {
    try{
      const res = await axios.get(`${server}/api/v1/tz/all`)
      console.log(res.data.content)
      res.data.content.map((a:TimeZoneDto) => {
        setTimeZoneOption((prev) => ([...prev,{
          value:a.tzNumber + "," + a.name,
          label:a.name
        }]))
      })
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    fetchDoor();
    fetchTimeZone();
  },[])

  return (
    <ComponentCard title="Add Access Level">

      {/* {scanCard && <Modals isWide={false} body={<ScanCard onStartScan={handleStartScan} />} closeToggle={() => setScanCard(false)} />} */}

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">

        <div /* ref={formRef} onSubmit={handleSubmit} */ >
          <div className='w-[60%]'>
            <div className='flex flex-col gap-1 w-100'>
              {addDoorForm ?
                <div>
                     <div className='flex gap-2 justify-center'>
                      <div className='flex-1'>
                        <Label>Door</Label>
                        <Select
                          name="acrName"
                          options={doorOption}
                          placeholder="Select Option"
                          onChangeWithEvent={handleSelect}
                          className="dark:bg-dark-900"
                          defaultValue={createAccessLevelDoorDto.acrName}
                        />
                      </div>
                      <div className='flex-1'> 
                        <Label>Time Zone</Label>
                        <Select
                          name="tzName"
                          options={timeZoneOption}
                          placeholder="Select Option"
                          onChangeWithEvent={handleSelect}
                          className="dark:bg-dark-900"
                          defaultValue={createAccessLevelDoorDto.tzName}
                        />
                      </div>

                    </div>
                  <div className='mt-3 flex gap-2'>
                    <Button onClickWithEvent={handleClick} name='addDoor' size='sm'>Add Doors</Button>
                    <Button variant='danger' onClickWithEvent={handleClick} name='cancelDoor' size='sm'>Cancel</Button>
                  </div>

                </div>
                :

                <div className="flex flex-col gap-2">
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} value={createAccessLevelDto.name} />
                  </div>
                  <br />
                  <div className="flex flex-col gap-4 swim-lane">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                        Doors
                      </h3>
                      <a onClick={() => handleClickAddDoor()} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    {createAccessLevelDoorList.map((a: CreateAccessLevelDoorDto, i: number) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex items-start w-full gap-4">
                            <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                              <div className="relative flex items-start">
                                <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                  {a.acrName}
                                </p>
                              </div>
                            </label>
                          </div>

                          <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                            <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={a} />
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

export default AddAccessLevelForm