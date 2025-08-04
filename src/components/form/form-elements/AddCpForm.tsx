import { PropsWithChildren, useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Button from "../../ui/button/Button.tsx";
import axios from "axios";
import { useNavigate } from "react-router";
import Select from "../Select.tsx";
import Radio from "../input/Radio.tsx";

const server = import.meta.env.VITE_SERVER_IP;
let ScpIp: string = "";

// Interface

interface Option {
  value: string;
  label: string;
}


interface SioDto {
  acFail: string;
  address: number;
  battFail: string;
  baudRate: number;
  model: string;
  name: string;
  no: number;
  protoCol: number;
  scpIp: string;
  scpName: string;
  sioNumber: number;
  status: number;
  tamper: string;
}

interface AddCpformProp {
  onSubmitHandle: () => void
}



const AddCpForm: React.FC<PropsWithChildren<AddCpformProp>> = ({ onSubmitHandle }) => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await axios.post(`${server}/api/v1/cp/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status == 201 || res.status == 200) {
        onSubmitHandle()
      }
    } catch (e) {
      console.log(e);
    }
  }

  {/* Input */ }
  const [defaultPulse, setDefaultPulse] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "defaultPulseTime":
        setDefaultPulse(Number(e.target.value));
        break;
      default:
        console.log(e.target.name);
        break;
    }

  }



  {/* Select */ }
  const [module, setModule] = useState<SioDto[]>([]);
  const [moduleOption, setModuleOption] = useState<Option[]>([]);
  const [relayOption, setRelayOption] = useState<Option[]>([]);

  const handleSelectChangeModule = async (value: string) => {
    module.map((a) => {
      if (a.sioNumber == Number(value)) {
        ScpIp = a.scpIp;
      }
    })
    try {
      const res = await axios.get(`${server}/api/v1/cp/${value}`);
      console.log(res);
      res.data.content.map((a: number) => {
        setRelayOption((prev) => [...prev, {
          label: `Relay ${a + 1}`,
          value: a.toString()
        }]);
      });
    } catch (e) {
      console.log(e)
    }
  };
  const handleSelectChangeRelay = (value: string) => {
    console.log("Selected value:", value);
  };
  {/* Radio */ }
  const [selectedValue, setSelectedValue] = useState<string>("option2");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };



  {/* Module Data */ }
  const fetchModule = async () => {
    let res = await axios.get(`${server}/api/v1/sio/all`);
    console.log(res.data.content);
    setModule(res.data.content);
    res.data.content.map((a: SioDto) => {
      setModuleOption(prev => [...prev, {
        label: a.name,
        value: a.sioNumber.toString()
      }])
    });
  };

  {/* UseEffect */ }
  useEffect(() => {
    fetchModule();
  }, []);

  return (
    <ComponentCard title="Add Control Point">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Control Point Name</Label>
          <Input name="name" value={name} type="text" id="name" onChange={handleChange} />
        </div>
        <div>
          <Label>Module</Label>
          <Select
            name="sioNumber"
            options={moduleOption}
            placeholder="Select Option"
            onChange={handleSelectChangeModule}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Relay</Label>
          <Select
            name="opNumber"
            options={relayOption}
            placeholder="Select Option"
            onChange={handleSelectChangeRelay}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label className="pb-3">Mode</Label>
          <div className="flex justify-around">
            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="mode1"
                name="mode"
                value="0"
                checked={selectedValue === "0"}
                onChange={handleRadioChange}
                label="Normal (Offline: Nochange)"
              />
              <Radio
                id="mode2"
                name="mode"
                value="1"
                checked={selectedValue === "1"}
                onChange={handleRadioChange}
                label="Inverted (Offline: Nochange)"
              />
              <Radio
                id="mode3"
                name="mode"
                value="16"
                checked={selectedValue === "16"}
                onChange={handleRadioChange}
                label="Normal (Offline: off)"
              />
            </div>

            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="mode4"
                name="mode"
                value="17"
                checked={selectedValue === "17"}
                onChange={handleRadioChange}
                label="Inverted (Offline: off)"
              />
              <Radio
                id="mode5"
                name="mode"
                value="32"
                checked={selectedValue === "32"}
                onChange={handleRadioChange}
                label="Normal (Offline: on)"
              />
              <Radio
                id="mode6"
                name="mode"
                value="33"
                checked={selectedValue === "33"}
                onChange={handleRadioChange}
                label="Inverted (Offline: on)"
              />
            </div>

          </div>

        </div>
        <div>
          <Label htmlFor="defaultPulseTime">Pulse Time (second)</Label>
          <Input defaultValue={0} value={defaultPulse} min="0" max="500" name="defaultPulseTime" type="number" id="defaultPulseTime" onChange={handleChange} />
        </div>
        <div className="hidden">
          <Label htmlFor="ip">Scp Ip</Label>
          <Input name="scpIp" type="text" id="ip" value={ScpIp} onChange={handleChange} />
        </div>
        <div className="flex justify-center">
          <Button className="w-50" size="sm">Submit </Button>
        </div>
      </form>
    </ComponentCard>
  );
}

export default AddCpForm;