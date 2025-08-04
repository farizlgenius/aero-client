import { HtmlHTMLAttributes, PropsWithChildren, useEffect, useState } from "react";
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

interface AddMpFormProps {
  onSubmitHandle:()=>void;
}


const AddMpForm:React.FC<PropsWithChildren<AddMpFormProps>> = ({onSubmitHandle}) => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await axios.post(`${server}/api/v1/mp/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status == 201 || res.status == 200) {
        onSubmitHandle();
      }
    } catch (e) {
      console.log(e);
    }
  }

  {/*Input */ }
  const [name, setName] = useState<string>("");
  const [debounce, setDebounce] = useState<number>(0);
  const [holdTime, setHoldtime] = useState<number>(0);
  const [lfCode, setLfCode] = useState<number>(0);
  const [delayEntry, setDelayEntry] = useState<number>(0);
  const [delayExit, setDelayExit] = useState<number>(0);
  const [mode, setMode] = useState<number>(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "debounce":
        setDebounce(Number(e.target.value));
        break;
      case "holdTime":
        setHoldtime(Number(e.target.value));
        break;
      case "lfCode":
        setLfCode(Number(e.target.value));
        break;
      case "delayEntry":
        setDelayEntry(Number(e.target.value));
        break;
      case "delayExit":
        setDelayExit(Number(e.target.value));
        break;
      case "mode":
        setMode(Number(e.target.value));
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
      const res = await axios.get(`${server}/api/v1/mp/${value}`);
      console.log(res);
      res.data.content.map((a: number) => {
        setRelayOption((prev) => [...prev, {
          label: `Input ${a + 1}`,
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
  const [selectedValue, setSelectedValue] = useState<string>("mode1");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

    const [selectedValueMode, setSelectedValueMode] = useState<string>("mode1");

  const handleRadioChangeMode = (value: string) => {
    setSelectedValueMode(value);
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
    <ComponentCard title="Add Monitor Point">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto">
        <div>
          <Label htmlFor="name">Monitor Point Name</Label>
          <Input value={name} name="name" type="text" id="name" onChange={handleChange} />
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
          <Label>Input</Label>
          <Select
            name="ipNumber"
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
                name="lcvtMode"
                value="0"
                checked={selectedValue === "0"}
                onChange={handleRadioChange}
                label="Normally closed"
              />
            </div>

            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="mode2"
                name="lcvtMode"
                value="1"
                checked={selectedValue === "1"}
                onChange={handleRadioChange}
                label="Normally open"
              />
            </div>

          </div>

        </div>
        <div className="hidden">
          <Label htmlFor="debounce">Debounce</Label>
          <Input defaultValue={6} value={debounce} min="0" max="15" name="debounce" type="number" id="debounce" onChange={handleChange} />
        </div>
        <div>

          <Label htmlFor="holdTime">Hold Time (Motion Detector)</Label>
          <Input value={holdTime} min="0" max="15" name="holdTime" type="number" id="holdTime" onChange={handleChange} />
        </div>
        <div className="hidden">
          <Label htmlFor="lfCode">LfCode</Label>
          <Input defaultValue={1} value={lfCode} min="0" max="2" name="lfCode" type="number" id="lfCode" onChange={handleChange} />
        </div>
        <div>
          <Label className="pb-3">Mode</Label>
          <div className="flex justify-around flex-col gap-4">
            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="latch1"
                name="mode"
                value="0"
                checked={selectedValueMode === "0"}
                onChange={handleRadioChangeMode}
                label="Normal mode (no exit or entry delay)"
              />
            </div>

            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="latch2"
                name="mode"
                value="1"
                checked={selectedValueMode === "1"}
                onChange={handleRadioChangeMode}
                label="Non-latching mode"
              />
            </div>
            <div className="flex flex-col flex-wrap gap-8">
              <Radio
                id="latch3"
                name="mode"
                value="2"
                checked={selectedValueMode === "2"}
                onChange={handleRadioChangeMode}
                label="Latching mode"
              />
            </div>

          </div>

        </div>
        <div className={selectedValueMode === "0" ? "hidden": ""}>
          <Label htmlFor="delayEntry">Delay Entry(s)</Label>
          <Input value={delayEntry} min="0" max="65535" name="delayEntry" type="number" id="delayEntry" onChange={handleChange} />
        </div>
        <div className={selectedValueMode === "0" ? "hidden": ""} >
          <Label htmlFor="delayExit">Delay Exit(s)</Label>
          <Input value={delayExit} min="0" max="65535" name="delayExit" type="number" id="delayExit" onChange={handleChange} />
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

export default AddMpForm;