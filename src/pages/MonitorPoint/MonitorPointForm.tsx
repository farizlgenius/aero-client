import { PropsWithChildren, useEffect, useState } from "react";
import HttpRequest from "../../utility/HttpRequest";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { Options } from "../../model/Options";
import { HardwareDto } from "../../model/Hardware/HardwareDto";
import { MonitorPointDto } from "../../model/MonitorPoint/MonitorPointDto";
import { ModeDto } from "../../model/ModeDto";
import { ModuleDto } from "../../model/Module/ModuleDto";
import { HttpMethod } from "../../enum/HttpMethod";
import { ModuleEndpoint } from "../../endpoint/ModuleEndpoint";
import { MonitorPointEndpoint } from "../../endpoint/MonitorPointEndpoint";
import { HardwareEndpoint } from "../../endpoint/HardwareEndpoint";
import { send } from "../../api/api";
import { useLocation } from "../../context/LocationContext";
import { FormProp, FormType } from "../../model/Form/FormProp";





const MonitorPointForm: React.FC<PropsWithChildren<FormProp<MonitorPointDto>>> = ({ handleClick,  dto, setDto,type }) => {
  const {locationId} = useLocation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  {/* Select */ }
  const [moduleOption, setModuleOption] = useState<Options[]>([]);
  const [controllerOption, setControllerOption] = useState<Options[]>([]);
  const [logFunctionOption,setLogFunctionOption] = useState<Options[]>([]);
  const [inputOption, setInputOption] = useState<Options[]>([]);
  const [inputModeOption, setInputModeOption] = useState<Options[]>([]);
  const [monitorPointModeOption, setMonitorPointModeOption] = useState<Options[]>([]);

  const handleSelectChange = async (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
   
    switch (e.target.name) {
      case "macAddress":
        setDto(prev => ({...prev,mac:value,hardwareName:controllerOption.find(x => x.value == value)?.label ?? ""}))
        const res1 = await send.get(ModuleEndpoint.GET_MAC(value))
        if (res1?.data.data) {
          res1.data.data.map((a: ModuleDto) => {
            setModuleOption((prev) => [...prev, { label: `${a.modelDescription} ( ${a.address} )`, value: a.componentId }])
          })
        }
        break;
      case "moduleId":
        setDto(prev => ({...prev,moduleId:Number(value)}))
        const res2 = await send.get(MonitorPointEndpoint.IP_LIST(dto.mac,Number(value)))
        if (res2?.data.data) {
          res2.data.data.map((a: number) => {
            setInputOption((prev) => [...prev, {
              label: `Input ${a + 1}`,
              value: a.toString()
            }]);
          })
        }
        break;
      case "monitorPointMode":
        setDto(prev => ({...prev,monitorPointMode:Number(value),monitorPointModeDescription: monitorPointModeOption.find(x => x.value == Number(value))?.label ?? "" }))
        break;
      case "inputMode":
        setDto(prev => ({...prev,inputMode:Number(value),inputModeDescription: inputModeOption.find(x => x.value == Number(value))?.label ?? "" }))
      break;
      case "logFunction":
        setDto(prev => ({...prev,logFunction:Number(value),logFunctionDescription:logFunctionOption.find(x => x.value == Number(value))?.label ?? ""}))
        break;
      default:
         setDto((prev) => ({ ...prev, [e.target.name]: value }))
        break;
    }


  };


  {/* Controller Data */ }
  const fetchController = async () => {
    let res = await send.get(HardwareEndpoint.GET(locationId))
    if (res?.data.data) {
      res.data.data.map((a: HardwareDto) => {
        setControllerOption((prev) => [...prev, { label: a.name, value: a.mac }])
      })
    }
  }

  const fetchInputMode = async () => {
    let res = await send.get(MonitorPointEndpoint.IP_MODE);
    if (res?.data.data) {
      res.data.data.map((a: ModeDto) => {
        setInputModeOption((prev) => [...prev, { label: a.name, value: a.value }])
      })
    }
  }

  const fetchMonitorPointMode = async () => {
    let res = await send.get(MonitorPointEndpoint.MP_MODE);
    if (res?.data.data) {
      res.data.data.map((a: ModeDto) => {
        setMonitorPointModeOption((prev) => [...prev, { label: a.name, value: a.value }])
      })
    }
  }

  const fetchLFMode = async () => {
    let res = await send.get(MonitorPointEndpoint.LOG_FUNCTION);
    if(res.data.data){
      res.data.data.map((a:ModeDto) => {
        setLogFunctionOption(prev => [...prev,{
          label:a.name,
          value:a.value,
          description:a.description
        }])
      })
    }
  }


  {/* UseEffect */ }
  useEffect(() => {
    fetchController();
    fetchInputMode();
    fetchMonitorPointMode();
    fetchLFMode();
  }, []);

  return (

    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Monitor Point Name</Label>
          <Input value={dto.name} name="name" type="text" id="name" onChange={handleChange} disabled={type==FormType.INFO} />
        </div>
        <div>
          <Label>Controller</Label>
          <Select
          disabled={type==FormType.INFO}
            isString={true}
            name="macAddress"
            options={controllerOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={dto.mac}
          />
        </div>
        <div>
          <Label>Module</Label>
          <Select
          disabled={type==FormType.INFO}
            name="moduleId"
            options={moduleOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={dto.moduleId}
          />
        </div>
        <div>
          <Label>Input</Label>
          <Select
          disabled={type==FormType.INFO}
            name="inputNo"
            options={inputOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={dto.inputNo}
          />
        </div>
        <div>
          <div>
            <Label>Input Mode</Label>
            <Select
            disabled={type==FormType.INFO}
              name="inputMode"
              options={inputModeOption}
              placeholder="Select Option"
              onChangeWithEvent={handleSelectChange}
              className="dark:bg-dark-900"
              defaultValue={dto.inputMode}
            />
          </div>

        </div>
        <div>
          <Label className="pb-3">Monitor Point Mode</Label>
          <Select
          disabled={type==FormType.INFO}
            name="monitorPointMode"
            options={monitorPointModeOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={dto.monitorPointMode}
          />

        </div>
        <div>
          <Label className="pb-3">Log Function Mode</Label>
          <Select
          disabled={type==FormType.INFO}
            name="logFunction"
            options={logFunctionOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={dto.logFunction}
          />

        </div>

        <div className={dto.monitorPointMode == 1 || dto.monitorPointMode == 2 ? "" : "hidden"}>
          <Label htmlFor="delayEntry">Delay Entry(s)</Label>
          <Input disabled={type==FormType.INFO} value={dto.delayEntry} min="0" max="65535" name="delayEntry" type="number" id="delayEntry" onChange={handleChange} />
        </div>
        <div className={dto.monitorPointMode == 1 || dto.monitorPointMode == 2 ? "" : "hidden"}>
          <Label htmlFor="delayExit">Delay Exit(s)</Label>
          <Input disabled={type==FormType.INFO} value={dto.delayExit} min="0" max="65535" name="delayExit" type="number" id="delayExit" onChange={handleChange} />
        </div>
        <div className="flex justify-center gap-4">
          <Button disabled={type==FormType.INFO} name={type == FormType.CREATE ? "create" : "update"} onClickWithEvent={handleClick} className="w-50" size="sm">{type == FormType.CREATE ? "create" : "update"}</Button>
          <Button name="cancel" onClickWithEvent={handleClick} variant="danger" className="w-50" size="sm">Cancel</Button>
        </div>
      </div>
    </div>


  );
}

export default MonitorPointForm;