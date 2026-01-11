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
import api, { send } from "../../api/api";
import { useLocation } from "../../context/LocationContext";
import { FormProp, FormType } from "../../model/Form/FormProp";



const ControlPointForm: React.FC<PropsWithChildren<FormProp<ControlPointDto>>> = ({ handleClick, dto, setDto,type }) => {
  const {locationId} = useLocation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  {/* Select */ }
  const [controllerOption, setControllerOption] = useState<Options[]>([])
  const [moduleOption, setModuleOption] = useState<Options[]>([]);
  const [relayOption, setRelayOption] = useState<Options[]>([]);
  const [relayModeOption, setRelyModeOption] = useState<Options[]>([]);
  const [offlineModeOption, setOfflineModeOption] = useState<Options[]>([]);

  const handleSelect = async (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.name) {
      case "macAddress":
        fetchModuleByMac(value)
        setDto((prev) => ({...prev,mac:value,hardwareName:controllerOption.find(a => a.value == value)?.label ?? ""}))
        break;
      case "moduleId":
        fetchOutput(value);
        setDto((prev) => ({...prev,moduleId:Number(value),moduleDescription:moduleOption.find(a => a.value == Number(value))?.label ?? ""}))
        break;
      case "relayMode":
        setDto(prev => ({...prev,relayMode:Number(value),relayModeDescription:relayModeOption.find(a => a.value == Number(value))?.label ?? ""}))
        break;
      case "offlineMode":
        setDto(prev => ({...prev,offlineMode:Number(value),offlineModeDescription:offlineModeOption.find(a => a.value == Number(value))?.label ?? ""}))
        break;
      default:
        setDto((prev) => ({ ...prev, [e.target.name]: value }));
        break;
    }
  }

  {/* Controller Data */ }
  const fetchController = async () => {
    const res = await send.get(HardwareEndpoint.GET(locationId));
    if (res && res.data.data) {
      res.data.data.map((a: HardwareDto) => {
        setControllerOption(prev => [...prev, {
          label: a.name,
          value: a.mac
        }])
      })
    }
  }

  const fetchRelayMode = async () => {

    let res = await api.get(ControlPointEndpoint.GET_RELAY_OP_MODE);
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setRelyModeOption((prev) => [...prev, {
          label: a.description,
          value: a.value.toString()
        }]);
      });
    }

    res = await send.get(ControlPointEndpoint.GET_OFFLINE_OP_MODE);
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setOfflineModeOption((prev) => [...prev, {
          label: a.description,
          value: a.value.toString()
        }]);
      });
    }

  }

  const fetchModuleByMac = async (value: string) => {
    const res = await send.get(ModuleEndpoint.GET_MAC(value));
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
    var res = await send.get(ControlPointEndpoint.OUTPUT(dto.mac,Number(value)));
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
    if(type == FormType.INFO || type == FormType.UPDATE){
      fetchModuleByMac(dto.mac);
      fetchOutput(String(dto.moduleId));
    }
  }, []);

  return (
    <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Control Point Name</Label>
          <Input disabled={type == FormType.INFO} name="name" value={dto.name} type="text" id="name" onChange={handleChange} />
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
            defaultValue={dto.mac}
            disabled={type == FormType.INFO}
          />
        </div>
        <div>
          <Label>Module</Label>
          <Select
          isString={false}
            name="moduleId"
            options={moduleOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
            defaultValue={dto.moduleId}
            disabled={type == FormType.INFO}
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
            defaultValue={dto.outputNo}
            disabled={type == FormType.INFO}
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
              defaultValue={dto.relayMode}
              disabled={type == FormType.INFO}
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
              defaultValue={dto.offlineMode}
              disabled={type == FormType.INFO}
            />
          </div>

        </div>

        <div>
          <Label htmlFor="defaultPulseTime">Pulse Time (second)</Label>
          <Input disabled={type == FormType.INFO} defaultValue={0} value={dto.defaultPulse} min="0" max="500" name="defaultPulse" type="number" id="defaultPulse" onChange={handleChange} />
        </div>
        <div className="flex justify-center gap-4">
          <Button disabled={type == FormType.INFO} name={type == FormType.CREATE ? "create" : "update"} className="w-50" size="sm" onClickWithEvent={handleClick}>{type == FormType.UPDATE ? "Update" : "Create"}</Button>
          <Button name="close" className="w-50" variant="danger" size="sm" onClickWithEvent={handleClick}>Cancel </Button>
        </div>
      </div>
    </div>

  );
}

export default ControlPointForm;