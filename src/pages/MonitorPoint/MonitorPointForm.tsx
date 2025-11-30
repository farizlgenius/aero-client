import { PropsWithChildren, useEffect, useState } from "react";
import HttpRequest from "../../utility/HttpRequest";
import ComponentCard from "../../components/common/ComponentCard";
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




interface MonitorPointForm {
  handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  data: MonitorPointDto;
  setMonitorPointDto: React.Dispatch<React.SetStateAction<MonitorPointDto>>
}


const MonitorPointForm: React.FC<PropsWithChildren<MonitorPointForm>> = ({ handleClick, data, setMonitorPointDto }) => {
  const {locationId} = useLocation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonitorPointDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  {/* Select */ }
  const [moduleOption, setModuleOption] = useState<Options[]>([]);
  const [controllerOption, setControllerOption] = useState<Options[]>([]);
  const [inputOption, setInputOption] = useState<Options[]>([]);
  const [inputModeOption, setInputModeOption] = useState<Options[]>([]);
  const [monitorPointModeOption, setMonitorPointModeOption] = useState<Options[]>([]);

  const handleSelectChange = async (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonitorPointDto((prev) => ({ ...prev, [e.target.name]: value }))
    switch (e.target.name) {
      case "macAddress":
        const res1 = await send.get(ModuleEndpoint.GET_MODULE_BY_MAC(value))
        if (res1?.data.data) {
          res1.data.data.map((a: ModuleDto) => {
            setModuleOption((prev) => [...prev, { label: `${a.model} ( ${a.address} )`, value: a.componentId }])
          })
        }
        break;
      case "moduleId":
        const res2 = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_IP_LIST + data.macAddress + "/" + value)
        if (res2?.data.data) {
          res2.data.data.map((a: number) => {
            setInputOption((prev) => [...prev, {
              label: `Input ${a + 1}`,
              value: a.toString()
            }]);
          })
        }
        break;
      default:
        break;
    }


  };


  {/* Controller Data */ }
  const fetchController = async () => {
    let res = await send.get(HardwareEndpoint.GET_SCP_LIST(locationId))
    if (res?.data.data) {
      res.data.data.map((a: HardwareDto) => {
        setControllerOption((prev) => [...prev, { label: a.name, value: a.macAddress }])
      })
    }
  }

  const fetchInputMode = async () => {
    let res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_IP_MODE);
    if (res?.data.data) {
      res.data.data.map((a: ModeDto) => {
        setInputModeOption((prev) => [...prev, { label: a.name, value: a.value }])
      })
    }
  }

  const fetchMonitorPointMode = async () => {
    let res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_MP_MODE);
    if (res?.data.data) {
      res.data.data.map((a: ModeDto) => {
        setMonitorPointModeOption((prev) => [...prev, { label: a.name, value: a.value }])
      })
    }
  }


  {/* UseEffect */ }
  useEffect(() => {
    fetchController();
    fetchInputMode();
    fetchMonitorPointMode();
  }, []);

  return (

    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Monitor Point Name</Label>
          <Input value={data.name} name="name" type="text" id="name" onChange={handleChange} />
        </div>
        <div>
          <Label>Controller</Label>
          <Select
            isString={true}
            name="macAddress"
            options={controllerOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={data.macAddress}
          />
        </div>
        <div>
          <Label>Module</Label>
          <Select
            name="moduleId"
            options={moduleOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={data.moduleId}
          />
        </div>
        <div>
          <Label>Input</Label>
          <Select
            name="inputNo"
            options={inputOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={data.inputNo}
          />
        </div>
        <div>
          <div>
            <Label>Input Mode</Label>
            <Select
              name="inputMode"
              options={inputModeOption}
              placeholder="Select Option"
              onChangeWithEvent={handleSelectChange}
              className="dark:bg-dark-900"
              defaultValue={data.inputMode}
            />
          </div>

        </div>
        <div>
          <Label className="pb-3">Monitor Point Mode</Label>
          <Select
            name="monitorPointMode"
            options={monitorPointModeOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={data.monitorPointMode}
          />

        </div>

        <div className={data.monitorPointMode == 1 || data.monitorPointMode == 2 ? "" : "hidden"}>
          <Label htmlFor="delayEntry">Delay Entry(s)</Label>
          <Input value={data.delayEntry} min="0" max="65535" name="delayEntry" type="number" id="delayEntry" onChange={handleChange} />
        </div>
        <div className={data.monitorPointMode == 1 || data.monitorPointMode == 2 ? "" : "hidden"}>
          <Label htmlFor="delayExit">Delay Exit(s)</Label>
          <Input value={data.delayExit} min="0" max="65535" name="delayExit" type="number" id="delayExit" onChange={handleChange} />
        </div>
        <div className="flex justify-center gap-4">
          <Button name="create" onClickWithEvent={handleClick} className="w-50" size="sm">Submit </Button>
          <Button name="cancle" onClickWithEvent={handleClick} variant="danger" className="w-50" size="sm">Cancle</Button>
        </div>
      </div>
    </div>


  );
}

export default MonitorPointForm;