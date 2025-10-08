import { PropsWithChildren, useEffect, useState } from "react";
import { usePopupActions } from "../utility/PopupCalling";
import { CpDto, CpModeDto, ScpDto, SioDto,Option } from "../constants/types";
import { CPEndPoint, HttpCode, HttpMethod, PopUpMsg, ScpEndPoint, SioEndPoint } from "../constants/constant";
import HttpRequest from "../utility/HttpRequest";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import ComponentCard from "../components/common/ComponentCard";
import Select from "../components/form/Select";
import Button from "../components/ui/button/Button";





interface AddCpformProp {
  onSubmitHandle: () => void
}

const defaultAddCpDto: CpDto = {
  name: '',
  sioNo: -1,
  opNo: -1,
  relayMode: -1,
  offlineMode: -1,
  mac: '',
  defaultPulseTime: 1,
  componentNo: -1,
  sioName: "",
  cpNo: -1,
  mode: "",
  status: 0
}



const AddCpForm: React.FC<PropsWithChildren<AddCpformProp>> = ({ onSubmitHandle }) => {
  const { showPopup } = usePopupActions();
  const [formData, setFormData] = useState<CpDto>(defaultAddCpDto);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSubmit = async () => {
    const res = await HttpRequest.send(HttpMethod.POST, CPEndPoint.POST_ADD_CP, formData);
    if (res) {
      if (res.data.code == HttpCode.OK || res.data.code == HttpCode.CREATED) {
        onSubmitHandle()
        showPopup(true, [PopUpMsg.CREATE_CP]);
      } else {
        onSubmitHandle()
        showPopup(false, res.data.errors);
      }
    }
  }


  {/* Select */ }
  const [controllerOption, setControllerOption] = useState<Option[]>([])
  const [moduleOption, setModuleOption] = useState<Option[]>([]);
  const [relayOption, setRelayOption] = useState<Option[]>([]);
  const [relayModeOption, setRelyModeOption] = useState<Option[]>([]);
  const [offlineModeOption, setOfflineModeOption] = useState<Option[]>([]);

  const handleSelect = async (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    let res;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    switch (e.target.name) {
      case "mac":
        res = await HttpRequest.send(HttpMethod.GET, SioEndPoint.GET_SIO_BY_MAC + value);
        if (res) {
          res.data.data.map((a: SioDto) => {
            setModuleOption((prev) => [...prev, {
              label: a.name,
              value: a.componentNo
            }])
          })
        }
        break;
      case "sioNo":
        res = await HttpRequest.send(HttpMethod.GET, CPEndPoint.GET_CP_OUTPUT + formData.mac + "/" + value);
        if (res) {
          res.data.data.map((a: number) => {
            setRelayOption((prev) => [...prev, {
              label: `Relay ${a + 1}`,
              value: a.toString()
            }]);
          });
        }
        break;
      default:

        break;
    }
  }

  {/* Controller Data */ }
  const fetchController = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, ScpEndPoint.GET_SCP_LIST);
    if (res) {
      res.data.data.map((a: ScpDto) => {
        setControllerOption(prev => [...prev, {
          label: a.name,
          value: a.mac
        }])
      })

    }
  }

  const fetchRelayMode = async () => {
    let res = await HttpRequest.send(HttpMethod.GET, CPEndPoint.GET_RELAY_OP_MODE);
    if (res) {
      res.data.data.map((a: CpModeDto) => {
        setRelyModeOption((prev) => [...prev, {
          label: a.description,
          value: a.value.toString()
        }]);
      });
    }
        res = await HttpRequest.send(HttpMethod.GET, CPEndPoint.GET_OFFLINE_OP_MODE);
    if (res) {
      res.data.data.map((a: CpModeDto) => {
        setOfflineModeOption((prev) => [...prev, {
          label: a.description,
          value: a.value.toString()
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
          <Input name="name" value={formData.name} type="text" id="name" onChange={handleChange} />
        </div>
        <div>
          <Label>Controller</Label>
          <Select
          isString={true}
            name="mac"
            options={controllerOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Module</Label>
          <Select
          isString={true}
            name="sioNo"
            options={moduleOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Relay</Label>
          <Select
          isString={true}
            name="opNo"
            options={relayOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-full">
            <Label>Relay Mode</Label>
            <Select
            isString={true}
              name="relayMode"
              options={relayModeOption}
              placeholder="Select Option"
              onChangeWithEvent={handleSelect}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="w-full">
            <Label>Offline Mode</Label>
            <Select
            isString={true}
              name="offlineMode"
              options={offlineModeOption}
              placeholder="Select Option"
              onChangeWithEvent={handleSelect}
              className="dark:bg-dark-900"
            />
          </div>

        </div>

        <div>
          <Label htmlFor="defaultPulseTime">Pulse Time (second)</Label>
          <Input defaultValue={0} value={formData.defaultPulseTime} min="0" max="500" name="defaultPulseTime" type="number" id="defaultPulseTime" onChange={handleChange} />
        </div>
        <div className="hidden">
          <Label htmlFor="scpMac">Scp Mac</Label>
          <Input name="scpMac" type="text" id="ip" value={formData.mac} onChange={handleChange} />
        </div>
        <div className="flex justify-center">
          <Button className="w-50" size="sm" onClick={handleSubmit}>Submit </Button>
        </div>
      </div>
    </ComponentCard>
  );
}

export default AddCpForm;