import React, { PropsWithChildren, useRef, useState } from 'react'
import ComponentCard from '../../common/ComponentCard'
import Label from '../Label';
import Input from '../input/InputField';
import Radio from '../input/Radio';
import Button from '../../ui/button/Button';

interface AddDoorFormProps {
  onSubmitHandle?: () => void
}

const active = "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50";
const inactive = "inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"

const AddDoorForm: React.FC<PropsWithChildren<AddDoorFormProps>> = ({ onSubmitHandle }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isReaderInOut, setIsReaderInOut] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string>("1");

  const handleSubmit = () => {
    
  }

  const handleOutsideSubmit = () => {
    formRef.current?.requestSubmit();
  }

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    if (value == "0") {
      setIsReaderInOut(false);
    } else {
      setIsReaderInOut(true);
    }
  }

  const handleOnTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(Number(e.currentTarget.value));
  }


  const handleChange = () => {

  }

  return (
    <ComponentCard title="Add Doors">

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex-1 overflow-x-auto pb-2 sm:w-[200px]">
          <nav className="flex w-full flex-row sm:flex-col sm:space-y-2">
            <button value={0} className={activeTab === 0 ? active : inactive} onClick={handleOnTabClick}>
              General
            </button>
            <button value={1} className={activeTab === 1 ? active : inactive} onClick={handleOnTabClick}>
              Readers
            </button>
            <button value={2} className={activeTab === 2 ? active : inactive} onClick={handleOnTabClick}>
              Strike Relay
            </button>
            <button value={3} className={activeTab === 3 ? active : inactive} onClick={handleOnTabClick}>
              Sensor Input
            </button>
            <button value={4} className={activeTab === 4 ? active : inactive} onClick={handleOnTabClick}>
              Advance
            </button>
            <Button  onClick={handleOutsideSubmit} className="w-50" size="sm">Submit </Button>
          </nav>
        </div>
        <div className='flex-2'>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 flex justify-center">
                   <div className='w-[60%]'>
                {activeTab == 0 &&

                  <div className='flex flex-col gap-1'>
                    <Label htmlFor="name">Door Name</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Controller</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Access Config</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Paired Reader</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                  </div>


                }

                {activeTab == 1 &&
                  <div className='flex flex-col gap-5'>
                    <Label>Door Type</Label>
                    <div className="flex justify-around gap-3">
                      <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                          id="mode1"
                          name="mode"
                          value="0"
                          checked={selectedValue === "0"}
                          onChange={handleRadioChange}
                          label="Reader-In Exit-Out"
                        />
                      </div>

                      <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                          id="mode4"
                          name="mode"
                          value="1"
                          checked={selectedValue === "1"}
                          onChange={handleRadioChange}
                          label="Reader In-Out"
                        />
                      </div>

                    </div>
                    <div className='flex gap-3'>
                      <div className='flex flex-col gap-1'>

                        <Label htmlFor="name">{isReaderInOut ? "Reader In - Module" : "Reader Module"}</Label>
                        <Input name="name" type="text" id="name" onChange={handleChange} />
                        <Label htmlFor="name">{isReaderInOut ? "Reader In - No" : "Reader No"}</Label>
                        <Input name="name" type="text" id="name" onChange={handleChange} />

                      </div>

                      {isReaderInOut ?
                        <div className='flex flex-col gap-1'>
                          <Label htmlFor="name">Reader Out - Module</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />
                          <Label htmlFor="name">Reader Out - No</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />
                        </div>

                        :
                        <div className='flex flex-col gap-1'>
                          <Label htmlFor="name">REX 1 - Module</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />
                          <Label htmlFor="name">REX 1 - Input No</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />
                          <Label htmlFor="name">REX 1 - Time Zone</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />
                          <Label htmlFor="name">REX 2 - Module</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />
                          <Label htmlFor="name">REX 2 - Input No</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />
                          <Label htmlFor="name">REX 2 - Time Zone</Label>
                          <Input name="name" type="text" id="name" onChange={handleChange} />

                        </div>

                      }

                    </div>

                  </div>
                }


                {
                  activeTab == 2 &&
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor="name">Strike Module</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Relay No</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Minimum Strike Active Time</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Maximum Strike Active Time</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Strike Mode</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                  </div>

                }

                {activeTab == 3 &&
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor="name">Sensor Module</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Input No</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Delay before held open</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Request Exit Module</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Strike Mode</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                  </div>
                }

                {activeTab == 4 &&
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor="name">Anti-Passback Mode</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Offline Mode</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />
                    <Label htmlFor="name">Default Mode</Label>
                    <Input name="name" type="text" id="name" onChange={handleChange} />

                  </div>

                }




              </div>
          </form>
        </div>

      </div>

    </ComponentCard>




  )
}

export default AddDoorForm