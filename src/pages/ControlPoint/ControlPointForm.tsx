import { PropsWithChildren, useEffect, useState } from "react";
import HttpRequest from "../../utility/HttpRequest";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { HardwareDto } from "../../model/Hardware/HardwareDto";
import { ModuleDto } from "../../model/Module/ModuleDto";
import { Options } from "../../model/Options";
import { ControlPointDto } from "../../model/ControlPoint/ControlPointDto";
import { ModeDto } from "../../model/ModeDto";
import { HardwareEndpoint } from "../../endpoint/HardwareEndpoint";
import { HttpMethod } from "../../enum/HttpMethod";
import { ControlPointEndpoint } from "../../endpoint/ControlPointEndpoint";
import { ModuleEndpoint } from "../../endpoint/ModuleEndpoint";


interface AddCpformProp {
  handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  data: ControlPointDto;
  setOutputDto: React.Dispatch<React.SetStateAction<ControlPointDto>>
}


const ControlPointForm: React.FC<PropsWithChildren<AddCpformProp>> = ({ handleClick, data, setOutputDto }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutputDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  {/* Select */ }
  const [controllerOption, setControllerOption] = useState<Options[]>([])
  const [moduleOption, setModuleOption] = useState<Options[]>([]);
  const [relayOption, setRelayOption] = useState<Options[]>([]);
  const [relayModeOption, setRelyModeOption] = useState<Options[]>([]);
  const [offlineModeOption, setOfflineModeOption] = useState<Options[]>([]);

  const handleSelect = async (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputDto((prev) => ({ ...prev, [e.target.name]: value }));
    switch (e.target.name) {
      case "macAddress":
        fetchModuleByMac(value)
        break;
      case "moduleId":
        fetchOutput(value);
        break;
      default:
        break;
    }
  }

  {/* Controller Data */ }
  const fetchController = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, HardwareEndpoint.GET_SCP_LIST);
    if (res) {
      res.data.data.map((a: HardwareDto) => {
        setControllerOption(prev => [...prev, {
          label: a.name,
          value: a.macAddress
        }])
      })

    }
  }

  const fetchRelayMode = async () => {
    let res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.GET_RELAY_OP_MODE);
    if (res) {
      res.data.data.map((a: ModeDto) => {
        setRelyModeOption((prev) => [...prev, {
          label: a.description,
          value: a.value.toString()
        }]);
      });
    }
    res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.GET_OFFLINE_OP_MODE);
    if (res) {
      res.data.data.map((a: ModeDto) => {
        setOfflineModeOption((prev) => [...prev, {
          label: a.description,
          value: a.value.toString()
        }]);
      });
    }

  }

  const fetchModuleByMac = async (value: string) => {
    var res = await HttpRequest.send(HttpMethod.GET, ModuleEndpoint.GET_SIO_BY_MAC + value);
    if (res) {
      res.data.data.map((a: ModuleDto) => {
        setModuleOption((prev) => [...prev, {
          label: `${a.model} ( ${a.address} )`,
          value: a.componentId
        }])
      })
    }
  }

  const fetchOutput = async (value: string) => {
    var res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.GET_CP_OUTPUT + data.macAddress + "/" + value);
    if (res) {
      res.data.data.map((a: number) => {
        setRelayOption((prev) => [...prev, {
          label: `Relay ${a + 1}`,
          value: a.toString()
        }]);
      });
    }
  }

  {/* UseEffect */ }
  useEffect(() => {
    fetchController();
    fetchRelayMode();
  }, []);

  return (
    <ComponentCard title="Add Control Point">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Control Point Name</Label>
          <Input name="name" value={data.name} type="text" id="name" onChange={handleChange} />
        </div>
        <div>
          <Label>Controller</Label>
          <Select
            isString={true}
            name="macAddress"
            options={controllerOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
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
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
            defaultValue={data.moduleId}
          />
        </div>
        <div>
          <Label>Relay</Label>
          <Select
            name="outputNo"
            options={relayOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
            defaultValue={data.outputNo}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-full">
            <Label>Relay Mode</Label>
            <Select
              name="relayMode"
              options={relayModeOption}
              placeholder="Select Option"
              onChangeWithEvent={handleSelect}
              className="dark:bg-dark-900"
              defaultValue={data.relayMode}
            />
          </div>
          <div className="w-full">
            <Label>Offline Mode</Label>
            <Select
              name="offlineMode"
              options={offlineModeOption}
              placeholder="Select Option"
              onChangeWithEvent={handleSelect}
              className="dark:bg-dark-900"
              defaultValue={data.offlineMode}
            />
          </div>

        </div>

        <div>
          <Label htmlFor="defaultPulseTime">Pulse Time (second)</Label>
          <Input defaultValue={0} value={data.defaultPulse} min="0" max="500" name="defaultPulseTime" type="number" id="defaultPulseTime" onChange={handleChange} />
        </div>
        <div className="flex justify-center gap-4">
          <Button name="create" className="w-50" size="sm" onClickWithEvent={handleClick}>Submit </Button>
          <Button name="close" className="w-50" variant="danger" size="sm" onClickWithEvent={handleClick}>Cancle </Button>
        </div>
      </div>
    </ComponentCard>
  );
}

export default ControlPointForm;