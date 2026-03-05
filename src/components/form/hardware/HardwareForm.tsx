import { ChangeEvent, PropsWithChildren, useEffect, useState } from "react";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Button from "../../ui/button/Button.tsx";
import { HardwareDto } from "../../../model/Hardware/HardwareDto.ts";
import { FormProp, FormType } from "../../../model/Form/FormProp.ts";
import Select from "../Select.tsx";
import { Options } from "../../../model/Options.ts";
import { send } from "../../../api/api.ts";
import { HardwareEndpoint } from "../../../endpoint/HardwareEndpoint.ts";
import { ModeDto } from "../../../model/ModeDto.ts";
import Switch from "../switch/Switch.tsx";
import { ModuleEndpoint } from "../../../endpoint/ModuleEndpoint.ts";
import { CreateHardwareDto } from "../../../model/Hardware/CreateHardwareDto.ts";







const HardwareForm: React.FC<PropsWithChildren<FormProp<HardwareDto | CreateHardwareDto>>> = ({ dto, type, handleClick, setDto }) => {
  const [device, setDevice] = useState<number>(-1);
  const [deviceOptions, setDeviceOptions] = useState<Options[]>([])
  const [protocol, setProtocol] = useState<Options[]>([]);
  const [baudrate, setBaudrate] = useState<Options[]>([]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDto(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const fetchType = async () => {
    const res = await send.get(HardwareEndpoint.TYPE);
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setDeviceOptions(prev => ([...prev, {
          label: a.name,
          value: a.value,
          description: a.description
        }]))
      })

    }
  }

  const fetchProtocol = async () => {
    const res = await send.get(ModuleEndpoint.PROTOCOL);
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setProtocol(prev => ([...prev, {
          label: a.name,
          value: a.value,
          description: a.description
        }]))
      })
    }
  }

  const fetchBaudrate = async () => {
    const res = await send.get(ModuleEndpoint.BAUDRATE);
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setBaudrate(prev => ([...prev, {
          label: a.name,
          value: a.value,
          description: a.description
        }]))
      })
    }
  }

  useEffect(() => {
    fetchType();
    fetchProtocol();
    fetchBaudrate();
  }, [])

  return (
    <>


      <div className="grid grid-cols-2 gap-10 w-full">
        <div className="flex flex-col gap-5 items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">Hardware Detail</h3>
          <div className="flex flex-col gap-5 w-3/4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input disabled={type == FormType.INFO} name="name" value={dto.name} type="text" id="name" onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="componentId">Scp Id</Label>
              <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="driverId" value={dto.driverId} type="text" id="driverId" onChange={handleChange} isReadOnly={true} />
            </div>
            <div>
              <Label htmlFor="mac">Mac</Label>
              <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="mac" value={dto.mac} type="text" id="mac" onChange={handleChange} isReadOnly={true} />
            </div>
            <div>
              <Label htmlFor="ipAddress">Ip</Label>
              <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="ip" value={dto.ip} type="text" id="ipAddress" onChange={handleChange} isReadOnly={true} />
            </div>
            <div>
              <Label htmlFor="firmware">Firmware</Label>
              <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="ip" value={dto.firmware} type="text" id="firmware" onChange={handleChange} isReadOnly={true} />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="ip" value={dto.port} type="text" id="port" onChange={handleChange} isReadOnly={true} />
            </div>
            <div>
              <Label htmlFor="serialnumber">Serial Number</Label>
              <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="serialnumber" value={dto.serialNumber} type="text" id="serialnumber" onChange={handleChange} isReadOnly={true} />
            </div>
            <div >
              <Label htmlFor="model">Type</Label>
              <Input disabled={type == FormType.INFO || type == FormType.UPDATE} name="model" value={dto.hardwareTypeDetail} type="text" id="model" onChange={handleChange} isReadOnly={true} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h3 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90">Module Configuration</h3>
          <div className="flex flex-col gap-5 w-3/4">
            <div>
              <Switch onChange={(check) => {
                if(check){
                  setDto(prev => ({ ...prev, portOne: check }))
                }else{
                  setDto(prev => ({ ...prev, portOne: check,protocolOne:0,protocolOneDetail:"",baudRateOne:-1 }))
                }
              }} defaultChecked={dto.portOne} label="PORT 1" />
            </div>
            {
              dto.portOne &&

              <>
                <div>
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select 
                  name="protocolOne" 
                  options={protocol} 
                  isString={false} 
                  defaultValue={dto.protocolOne} 
                  onChange={(e) => setDto(prev => ({...prev,protocolOne:Number(e),protocolOneDetail: protocol.find(x => x.value == Number(e))?.description ?? "" }))} />

                </div>
                <div>
                  <Label htmlFor="baudRate">Baud Rate</Label>
                  <Select 
                  name="baudRateOne" 
                  options={baudrate} 
                  isString={false} 
                  defaultValue={dto.baudRateOne}
                  onChange={(e) => setDto(prev => ({...prev,baudRateOne:Number(e)}))} 
                  />
                </div>
              </>
            }


            <div>
              <Switch onChange={(check) => {
                if(check){
                  setDto(prev => ({ ...prev, portTwo: check }))
                }else{
                  setDto(prev => ({ ...prev, portTwo: check,protocolTwo:0,protocolTwoDetail:"",baudRateTwo:-1 }))
                }
              }} defaultChecked={dto.portTwo} label="PORT 2" />
            </div>
            {
              dto.portTwo &&

              <>
                <div>
                  <Label htmlFor="protocol">Protocol</Label>
                  <Select 
                  name="port2Protocol" 
                  options={protocol} 
                  isString={false} 
                  defaultValue={dto.protocolTwo}
                  onChange={(e) => setDto(prev => ({...prev,protocolTwo:Number(e),protocolTwoDetail: protocol.find(x => x.value == Number(e))?.description ?? "" }))}
                  />
                </div>

                <div>
                  <Label htmlFor="baudRate">Baud Rate</Label>
                  <Select name="port2baudRate" options={baudrate} isString={false}  defaultValue={dto.baudRateTwo}  onChange={(e) => setDto(prev => ({...prev,baudRateTwo:Number(e)}))} />

                </div>
              </>
            }


          </div>
        </div>
        <div className="col-span-full flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex justify-center gap-5">
            <Button onClickWithEvent={handleClick} disabled={type == FormType.INFO} name={type == FormType.UPDATE ? "update" : "create"} className="w-50" size="sm">{type == FormType.UPDATE ? "Update" : "Create"}</Button>
            <Button onClickWithEvent={handleClick} name="close" variant="danger" className="w-50" size="sm">Cancel</Button>
          </div>
        </div>

      </div>





  </>);
}

export default HardwareForm;