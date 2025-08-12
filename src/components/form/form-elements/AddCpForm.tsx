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

interface CpModeDto {
  value:number;
  description:string;
}

interface AddCpDto {
  name: string;
  sioNumber: number;
  opNumber: number;
  mode: number;
  scpIp: string;
  defaultPulseTime: number;
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

const defaultAddCpDto: AddCpDto = {
  name: '',
  sioNumber: -1,
  opNumber: -1,
  mode: -1,
  scpIp: '',
  defaultPulseTime: 1
}



const AddCpForm: React.FC<PropsWithChildren<AddCpformProp>> = ({ onSubmitHandle }) => {
  const [formData, setFormData] = useState<AddCpDto>(defaultAddCpDto);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
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


  {/* Select */ }
  const [module, setModule] = useState<SioDto[]>([]);
  const [moduleOption, setModuleOption] = useState<Option[]>([]);
  const [relayOption, setRelayOption] = useState<Option[]>([]);
  const [relayModeOption, setRealyModeOption] = useState<Option[]>([]);

  const handleSelect = async (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    switch (e.target.name) {
      case "sioNumber":
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
        break;
      case "opNumber":
        break;
      default:

        break;
    }
  }


  {/* Module Data */ }
  const fetchModule = async () => {
    try {
      let res = await axios.get(`${server}/api/v1/sio/all`);
      console.log(res.data.content);
      setModule(res.data.content);
      res.data.content.map((a: SioDto) => {
        setModuleOption(prev => [...prev, {
          label: a.name,
          value: a.sioNumber.toString()
        }])
      });

    } catch (e) {
      console.log(e);
    }

  };

  const fetchRelayMode = async () => {
    let res = await axios.get(`${server}/api/v1/cp/mode`);
    console.log(res);
              res.data.content.map((a: CpModeDto) => {
            setRealyModeOption((prev) => [...prev, {
              label: a.description,
              value: a.value.toString()
            }]);
          });
  }

  {/* UseEffect */ }
  useEffect(() => {
    fetchModule();
    fetchRelayMode();
  }, []);

  return (
    <ComponentCard title="Add Control Point">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Control Point Name</Label>
          <Input name="name" value={formData.name} type="text" id="name" onChange={handleChange} />
        </div>
        <div>
          <Label>Module</Label>
          <Select
            name="sioNumber"
            options={moduleOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Relay</Label>
          <Select
            name="opNumber"
            options={relayOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Relay Mode</Label>
          <Select
            name="mode"
            options={relayModeOption}
            placeholder="Select Option"
            onChangeWithEvent={handleSelect}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label htmlFor="defaultPulseTime">Pulse Time (second)</Label>
          <Input defaultValue={0} value={formData.defaultPulseTime} min="0" max="500" name="defaultPulseTime" type="number" id="defaultPulseTime" onChange={handleChange} />
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