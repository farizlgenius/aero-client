import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import ComponentCard from '../../common/ComponentCard'
import Label from '../Label';
import Input from '../input/InputField';
import Radio from '../input/Radio';
import Button from '../../ui/button/Button';
import axios from 'axios';
import Select from '../Select';


// Global Variable

const server = import.meta.env.VITE_SERVER_IP;

// Interface 

interface Option {
  value: string | number;
  label: string;
  isAvailale: boolean;
}

interface ScpDto {
  no: number;
  scpId: number;
  name: string;
  model: number;
  mac: string;
  ipAddress: string;
  serialNumber: string;
  status: number;
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

interface AcsRdrModeDto {
  name: string;
  value: number;
  description: string;
}

interface AddAcrDto {
  name: string;
  scpIp: string;
  accessConfig: number;
  pairACRNo: number;
  isReaderOsdp: boolean;
  readerSioNumber: number;
  readerNumber: number;
  readerDataFormat: number;
  keyPadMode: number;
  osdpBaudRate: number;
  osdpNoDiscover: number;
  osdpTracing: number;
  osdpAddress: number;
  osdpSecureChannel: number;
  isAlternateReaderUsed: boolean;
  isAlternateReaderOsdp: boolean;
  alternateReaderSioNumber: number;
  alternateReaderNumber: number;
  alternateReaderConfig: number;
  alternateReaderDataFormat: number;
  alternateKeyPadMode: number;
  alternateOsdpBaudRate: number;
  alternateOsdpNoDiscover: number;
  alternateOsdpTracing: number;
  alternateOsdpAddress: number;
  alternateOsdpSecureChannel: number;
  iSREX0Used: boolean;
  rEX0SioNumber: number;
  rEX0Number: number;
  rEX0SensorMode: number;
  rEX0TimeZone: number;
  iSREX1Used: boolean;
  rEX1SioNumber: number;
  rEX1Number: number;
  rEX1TimeZone: number;
  rEX1SensorMode:number;
  strikeSioNumber: number;
  strikeNumber: number;
  strikeMinActiveTime: number;
  strikeMaxActiveTime: number;
  strikeMode: number;
  strikeRalayDriveMode: number;
  strikeRelayOfflineMode: number;
  relayMode: number;
  sensorSioNumber: number;
  sensorNumber: number;
  heldOpenDelay: number;
  sensorMode: number;
  sensorDebounce: number;
  sensorHoldTime: number;
  antiPassbackMode: number;
  offlineMode: number;
  defaultMode: number;
}

interface ModeDto {
  description: string;
  value: number;
  name: string;
}

interface Object {
  [key: string]: any
}

interface TimeZoneDto {
  tzNumber: number;
  name: string;
}

interface AddDoorFormProps {
  onSubmitHandle?: () => void
}

const defaultAcrDto: AddAcrDto = {
  name: '',
  scpIp: "",
  accessConfig: 0,
  pairACRNo: -1,
  readerSioNumber: -1,
  readerNumber: -1,
  readerDataFormat: 0x01,
  keyPadMode: 2,
  isReaderOsdp: false,
  osdpBaudRate: 0x00,
  osdpNoDiscover: 0x00,
  osdpTracing: 0x00,
  osdpAddress: 0x00,
  osdpSecureChannel: 0x00,
  isAlternateReaderUsed: false,
  isAlternateReaderOsdp: false,
  alternateReaderSioNumber: -1,
  alternateReaderNumber: -1,
  alternateReaderConfig: -1,
  alternateReaderDataFormat: 0x01,
  alternateKeyPadMode: 2,
  alternateOsdpBaudRate: 0x00,
  alternateOsdpNoDiscover: 0x00,
  alternateOsdpTracing: 0x00,
  alternateOsdpAddress: 0x00,
  alternateOsdpSecureChannel: 0x00,
  iSREX0Used: false,
  rEX0SioNumber: -1,
  rEX0Number: -1,
  rEX0TimeZone: -1,
  rEX0SensorMode: 0,
  iSREX1Used: false,
  rEX1SioNumber: -1,
  rEX1Number: -1,
  rEX1TimeZone: -1,
  rEX1SensorMode: 0,
  strikeSioNumber: -1,
  strikeNumber: -1,
  strikeMinActiveTime: 1,
  strikeMaxActiveTime: 5,
  strikeMode: 0,
  strikeRalayDriveMode: 0,
  strikeRelayOfflineMode: 0,
  relayMode: -1,
  sensorSioNumber: -1,
  sensorNumber: -1,
  heldOpenDelay: 0,
  sensorMode: 0,
  sensorDebounce: 4,
  sensorHoldTime: 2,
  antiPassbackMode: 0,
  offlineMode: 8,
  defaultMode: 8
}

const active = "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50";
const inactive = "inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"

const AddDoorForm: React.FC<PropsWithChildren<AddDoorFormProps>> = ({ onSubmitHandle }) => {
  const [formData, setFormData] = useState<Object>({
  })
  const formRef = useRef<HTMLFormElement>(null);
  const [isReaderInOut, setIsReaderInOut] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string>("1");
  const [selectedReaderType, setSelectedReaderType] = useState<string>("0");
  const [selectedAlterReaderType, setSelectedAlterReaderType] = useState<string>("0");
  const osdpBaudRateOption: Option[] = [
    {
      label: "9600",
      value: 0x01,
      isAvailale: true
    }, {
      label: "19200",
      value: 0x02,
      isAvailale: true
    }, {
      label: "38400",
      value: 0x03,
      isAvailale: true
    }, {
      label: "115200",
      value: 0x04,
      isAvailale: true
    }, {
      label: "57600",
      value: 0x05,
      isAvailale: true
    }, {
      label: "230400",
      value: 0x06,
      isAvailale: true
    }]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString())
    })
    try {
      const res = await axios.post(`${server}/api/v1/acr/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res)
      if (res.status == 201 || res.status == 200) {
        if (onSubmitHandle)
          onSubmitHandle();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleOutsideSubmit = () => {
    formRef.current?.requestSubmit();
  }

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    if (value == "0") {
      setFormData(prev => ({ ...prev, isAlternateReaderUsed: false, iSREX0Used: true }));
      setIsReaderInOut(false);
    } else {
      setIsReaderInOut(true);
      setFormData(prev => ({ ...prev, isAlternateReaderUsed: true, iSREX0Used: false }));
    }
  }

  const handleRadioChangeReaderType = (value: string) => {
    setSelectedReaderType(value);
    if (value == "0") {
      setFormData(prev => ({ ...prev, isReaderOsdp: false }));

    } else if (value == "1") {

      setFormData(prev => ({ ...prev, isReaderOsdp: true }));
    }

    if (value == "2") {
      setFormData(prev => ({ ...prev, isAlternateReaderOsdp: false }));
    } else if (value == "3") {
      setFormData(prev => ({ ...prev, isAlternateReaderOsdp: true }));
    }
  }

  const handleRadioChangeAlternateReaderType = (value: string) => {
    setSelectedAlterReaderType(value);

    if (value == "0") {
      setFormData(prev => ({ ...prev, isAlternateReaderOsdp: false }));
    } else if (value == "1") {
      setFormData(prev => ({ ...prev, isAlternateReaderOsdp: true }));
    }
  }

  const handleOnTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(Number(e.currentTarget.value));
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  };

  {/* Reader Module */ }
  const [moduleOption, setModuleOption] = useState<Option[]>([

  ]);
  const fetchSio = async (value: string) => {
    try {
      const res = await axios.get(`${server}/api/v1/sio/${value}`);
      console.log(res);
      res.data.content.map((a: SioDto) => {
        setModuleOption((prev) => [...prev, {
          label: a.name,
          value: a.sioNumber,
          isAvailale: true
        }]);
        // fetchReaderIn(res.data.content[0].sioNumber);
        // fetchReaderOut(res.data.content[0].sioNumber);
        // fetchInput(res.data.content[0].sioNumber);
        // fetchOutput(res.data.content[0].sioNumber);
      });
    } catch (e) {
      console.log(e)
    }
  }
  {/* SCP Data */ }
  const [controller, setController] = useState<ScpDto[]>([
  ]);
  const [controllerOption, setControllerOption] = useState<Option[]>([
  ]);
  const handleSelectChange = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(value);
    console.log(e.target.name);
    if (e?.target.name != null) {
      setFormData(prev => ({ ...prev, [e?.target.name]: value }));
    }
    switch (e?.target.name) {
      case "scpIp":
        fetchSio(value);
        fetchAcrByIp(value);
        break;
      case "accessConfig":
        if (Number(value) == 1 || Number(value) == 2) {
          setIsPairUse(true);
        } else {
          setIsPairUse(false);
          setFormData(prev => ({ ...prev, pairACRNo: -1 }));
        }
        break;
      case "readerSioNumber":
        fetchReaderIn(Number(value));
        break;
      case "alternateReaderSioNumber":
        fetchReaderOut(Number(value));
        break;
      case "readerNumber":
        setFormData(prev => ({ ...prev, osdpAddress: Number(value) }))
        break;
      case "alternateReaderNumber":
        setFormData(prev => ({ ...prev, alternateOsdpAddress: Number(value) }))
        break;
      case "strikeSioNumber":
        fetchOutput(Number(value))
        break;
      case "rEX0SioNumber":
        fetchInputRex0(Number(value));
        break;
      case "rEX1SioNumber":
        fetchInputRex1(Number(value));
        break;
      case "sensorSioNumber":
        fetchInputSensor(Number(value));
        break;
      default:
        break;
    }

  }
  const fetchScp = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/scp/all`);
      console.log(res.data.content);
      setController(res.data.content);
      res.data.content.map((a: ScpDto) => {
        setControllerOption(prev => [...prev, {
          label: a.name,
          value: a.ipAddress,
          isAvailale: true
        }])
      });
    } catch (e) {
      console.log(e);
    }
  }
  {/* Access Reader Config */ }
  const [accessReaderConfigOption, setAccessReaderConfigOption] = useState<Option[]>([
  ]);
  const [isPairUse, setIsPairUse] = useState<boolean>(false);
  const fetchAccessReaderMode = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/acr/reader/mode`);
      console.log(res.data.content);
      res.data.content.map((a: AcsRdrModeDto) => {
        setAccessReaderConfigOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      });
    } catch (e) {
      console.log(e);
    }
  }
  {/* Pair Reader */ }
  const fetchAcrByIp = async (ScpIp: string) => {
    try {
      const res = await axios.get(`${server}/api/v1/acr/${ScpIp}`);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
  {/* Reader In Out*/ }
  const [readerInOption, setReaderInOption] = useState<Option[]>([
  ]);


  const [readerOutOption, setReaderOutOption] = useState<Option[]>([
  ]);


  const fetchReaderIn = async (sio: number) => {
    try {
      const res = await axios.get(`${server}/api/v1/acr/reader/${sio}`);
      console.log(res.data.content);
      res.data.content.map((a: number) => {
        setReaderInOption(prev => [...prev, {
          label: `Reader ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      });
    } catch (e) {
      console.log(e);
    }
  }
  const fetchReaderOut = async (sio: number) => {
    try {
      const res = await axios.get(`${server}/api/v1/acr/reader/${sio}`);
      console.log(res.data.content);
      res.data.content.map((a: number) => {
        setReaderOutOption(prev => [...prev, {
          label: `Reader ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      });
    } catch (e) {
      console.log(e);
    }
  }
  {/* Input */ }
  const [inputRex0Option, setInputRex0Option] = useState<Option[]>([])
  const [inputRex1Option, setInputRex1Option] = useState<Option[]>([])
  const [inputSensorOption, setInputSensorOption] = useState<Option[]>([])
  const [inputModeOption, setInputModeOption] = useState<Option[]>([])
  const fetchInputRex0 = async (sio: number) => {
    try {
      const res = await axios.get(`${server}/api/v1/mp/${sio}`)
      console.log(res.data.content)
      res.data.content.map((a: number) => {
        setInputRex0Option(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e);
    }
  }
  const fetchInputRex1 = async (sio: number) => {
    try {
      const res = await axios.get(`${server}/api/v1/mp/${sio}`)
      console.log(res.data.content)
      console.log("##############");
      res.data.content.map((a: number) => {
        setInputRex1Option(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e);
    }
  }
  const fetchInputSensor = async (sio: number) => {
    try {
      const res = await axios.get(`${server}/api/v1/mp/${sio}`)
      console.log(res.data.content)
      res.data.content.map((a: number) => {
        setInputSensorOption(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e);
    }
  }
  const fetchInputMode = async () => {
        try {
      const res = await axios.get(`${server}/api/v1/mp/mode`)
      console.log(res.data.content)
      res.data.content.map((a: ModeDto) => {
        setInputModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e);
    }
  }
  {/* Output */ }
  const [outputOption, setOutputOption] = useState<Option[]>([

  ])
  const [relayMode, setRelayMode] = useState<Option[]>([

  ])
  const [strikeModeOption, setStrikeModeOption] = useState<Option[]>([

  ])
  const fetchOutput = async (sio: number) => {
    try {
      const res = await axios.get(`${server}/api/v1/cp/${sio}`);
      console.log(res.data.content);
      res.data.content.map((a: number) => {
        setOutputOption(prev => [...prev, {
          label: `Output ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e);
    }
  }
  const fetchStrikeMode = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/acr/strike/mode`);
      console.log(res.data.content);
      res.data.content.map((a: ModeDto) => {
        setStrikeModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e)
    }
  }
  const fetchRelayMode = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/cp/mode`);
      console.log(res.data.content);
      res.data.content.map((a: ModeDto) => {
        setRelayMode(prev => [...prev, {
          label: a.description,
          value: a.value,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e)
    }
  }
  {/* Time Zone */ }
  const [timeZoneOption, setTimeZoneOption] = useState<Option[]>([

  ])
  const fetchTimeZone = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/tz/all`)
      console.log(res.data.content)
      res.data.content.map((a: TimeZoneDto) => {
        setTimeZoneOption(prev => [...prev, {
          label: a.name,
          value: a.tzNumber,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e);
    }
  }
  {/* Access Control Reader */ }
  const [doorModeOption, setDoorModeOption] = useState<Option[]>([

  ]);
  const fetchAcrMode = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/acr/mode`);
      console.log(res.data.content)
      res.data.content.map((a: ModeDto) => {
        setDoorModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e)
    }
  }
  // const [acs,setAcs] = useState<>()
  {/* Anti Passback */ }
  const [antipassbackOption, setAntipassbackMode] = useState<Option[]>([

  ]);
  const fetchApbMode = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/acr/apb/mode`);
      console.log(res.data.content)
      res.data.content.map((a: ModeDto) => {
        setAntipassbackMode(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
    } catch (e) {
      console.log(e)
    }
  }
  {/* UseEffect */ }
  useEffect(() => {
    fetchScp();
    fetchAccessReaderMode();
    fetchTimeZone()
    fetchStrikeMode()
    fetchApbMode();
    fetchAcrMode();
    fetchRelayMode();
    fetchInputMode();
  }, [])

  return (
    <ComponentCard title="Add Doors">

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex-1 overflow-x-auto pb-2 sm:w-[200px]">
          <nav className="flex w-full flex-row sm:flex-col sm:space-y-2">
            <button value={0} className={activeTab === 0 ? active : inactive} onClick={handleOnTabClick}>
              General
            </button>
            <button value={1} className={activeTab === 1 ? active : inactive} onClick={handleOnTabClick}>
              Reader In
            </button>
            {isReaderInOut ?
              <button value={2} className={activeTab === 2 ? active : inactive} onClick={handleOnTabClick}>
                Reader Out
              </button>
              :
              <button value={3} className={activeTab === 3 ? active : inactive} onClick={handleOnTabClick}>
                REX
              </button>
            }
            <button value={4} className={activeTab === 4 ? active : inactive} onClick={handleOnTabClick}>
              Strike Relay
            </button>
            <button value={5} className={activeTab === 5 ? active : inactive} onClick={handleOnTabClick}>
              Sensor Input
            </button>
            <button value={6} className={activeTab === 6 ? active : inactive} onClick={handleOnTabClick}>
              Advance
            </button>
            <Button onClick={handleOutsideSubmit} className="w-50" size="sm">Submit </Button>
          </nav>
        </div>
        <div className='flex-2'>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 flex justify-center">
            <div className='w-[60%]'>
              {activeTab == 0 &&

                <div className='flex flex-col gap-1'>
                  <Label htmlFor='mode' >Door Type</Label>
                  <div className="flex justify-around gap-3 pb-3">
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
                  <Label htmlFor="name">Door Name</Label>
                  <Input value={formData.name} name="name" type="text" id="name" onChange={handleChange} />
                  <div>
                    <Label htmlFor='scpIp'>Controller</Label>
                    <Select
                      name="scpIp"
                      options={controllerOption}
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={formData.scpIp}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accessConfig">Access Config</Label>
                    <Select
                      name="accessConfig"
                      options={accessReaderConfigOption}
                      //placeholder="Select Option"
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={formData.accessConfig}
                    />
                  </div>
                  {isPairUse &&
                    <>
                      <Label htmlFor="pare">Paired Reader</Label>
                      <Input name="pare" type="text" id="pare" onChange={handleChange} />
                    </>
                  }

                </div>


              }

              {activeTab === 1 &&
                <div className='flex flex-col gap-5'>
                  <div className='gap-3'>
                    <div className='flex flex-col gap-1'>
                      <Label htmlFor='mode' >Reader Type</Label>
                      <div className="flex justify-around gap-3 pb-3">
                        <div className="flex flex-col flex-wrap gap-8">
                          <Radio
                            id="readerType1"
                            name="readerType"
                            value="0"
                            checked={selectedReaderType === "0"}
                            onChange={handleRadioChangeReaderType}
                            label="Wiegand"
                          />
                        </div>

                        <div className="flex flex-col flex-wrap gap-8">
                          <Radio
                            id="readerType2"
                            name="readerType"
                            value="1"
                            checked={selectedReaderType === "1"}
                            onChange={handleRadioChangeReaderType}
                            label="OSDP"
                          />
                        </div>

                      </div>

                      <Label htmlFor='readerSioNumber' >Reader In - Module</Label>
                      <Select
                        name="readerSioNumber"
                        options={moduleOption}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={formData.readerSioNumber}
                      />
                      <Label htmlFor='readerNumber'>Reader In - No</Label>
                      <Select
                        name="readerNumber"
                        options={readerInOption}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={formData.readerNumber}
                      />
                      {formData.isReaderOsdp &&
                        <>
                          <Label htmlFor='osdpAddress'>Reader Address</Label>
                          <Input isReadOnly={true} value={formData.osdpAddress} name="osdpAddress" type="number" id="osdpAddress" onChange={handleChange} />
                          <Label htmlFor='readerNumber'>Reader Baud Rate</Label>
                          <Select
                            name="osdpBaudRate"
                            options={osdpBaudRateOption}
                            placeholder="Select Option"
                            onChangeWithEvent={handleSelectChange}
                            className="dark:bg-dark-900"
                            defaultValue={formData.osdpBaudRate}
                          />
                        </>

                      }


                    </div>
                  </div>

                </div>
              }

              {activeTab === 2 &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor='mode' >Reader Type</Label>
                  <div className="flex justify-around gap-3 pb-3">
                    <div className="flex flex-col flex-wrap gap-8">
                      <Radio
                        id="readerType1"
                        name="readerType"
                        value="0"
                        checked={selectedAlterReaderType === "0"}
                        onChange={handleRadioChangeAlternateReaderType}
                        label="Wiegand"
                      />
                    </div>

                    <div className="flex flex-col flex-wrap gap-8">
                      <Radio
                        id="readerType2"
                        name="readerType"
                        value="1"
                        checked={selectedAlterReaderType === "1"}
                        onChange={handleRadioChangeAlternateReaderType}
                        label="OSDP"
                      />
                    </div>

                  </div>
                  <div>
                    <Label htmlFor='alternateReaderSioNumber'>Reader Out - Module</Label>
                    <Select
                      name="alternateReaderSioNumber"
                      options={moduleOption}
                      placeholder="Select Option"
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={formData.alternateReaderSioNumber}
                    />
                  </div>
                  <div>
                    <Label htmlFor='alternateReaderNumber'>Reader Out - No</Label>
                    <Select
                      name="alternateReaderNumber"
                      options={readerOutOption}
                      placeholder="Select Option"
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={formData.alternateReaderNumber}
                    />
                  </div>

                  {formData.isAlternateReaderOsdp &&
                    <>
                      <Label htmlFor='alternateOsdpAddress'>Reader Address</Label>
                      <Input isReadOnly={true} value={formData.alternateOsdpAddress} name="alternateOsdpAddress" type="number" id="alternateOsdpAddress" onChange={handleChange} />
                      <Label htmlFor='alternateOsdpBaudRate'>Reader Baud Rate</Label>
                      <Select
                        name="alternateOsdpBaudRate"
                        options={osdpBaudRateOption}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={formData.alternateOsdpBaudRate}
                      />
                    </>
                  }
                </div>

              }

              {activeTab === 3 &&

                <div className='flex flex-col gap-1'>
                  <Label htmlFor='rEX0SioNumber'>REX 1 - Module</Label>
                  <Select
                    name="rEX0SioNumber"
                    options={moduleOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.rEX0SioNumber}
                  />
                  <Label htmlFor='rEX0Number'>REX 1 - Input No</Label>
                  <Select
                    name="rEX0Number"
                    options={inputRex0Option}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.rEX0Number}
                  />
                                    <Label htmlFor="rEX0SensorMode">REX 1 - Input Mode</Label>
                  <Select
                    name="rEX0SensorMode"
                    options={inputModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.rEX0SensorMode}
                  />
                  {/* <Label htmlFor="rEX0TimeZone">REX 1 - Time Zone</Label>
                  <Select
                    name="rEX0TimeZone"
                    options={timeZoneOption}
                    onChange={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.rEX0TimeZone}
                  /> */}

                  { formData.iSREX1Used && 
                                    <>
                    <Label htmlFor="rEX1SioNumber">REX 2 - Module</Label>
                    <Select
                      name="rEX1SioNumber"
                      options={moduleOption}
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={formData.rEX1SioNumber}
                    />
                    <Label htmlFor="rEX1Number">REX 2 - Input No</Label>
                    <Select
                      name="rEX1Number"
                      options={inputRex1Option}
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={formData.rEX1Number}
                    />
                                                        <Label htmlFor="rEX1SensorMode">REX 2 - Input Mode</Label>
                  <Select
                    name="rEX1SensorMode"
                    options={inputModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.rEX1SensorMode}
                  />
                    {/* <Label htmlFor="rEX1TimeZone">REX 2 - Time Zone</Label>
                    <Select
                      name="rEX1TimeZone"
                      options={timeZoneOption}
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={formData.rEX1TimeZone}
                    /> */}
                  </>

                  
                  }




                </div>

              }


              {
                activeTab === 4 &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="strikeSioNumber">Strike Module</Label>
                  <Select
                    name="strikeSioNumber"
                    options={moduleOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.strikeSioNumber}
                  />
                  <Label htmlFor="strikeNumber">Relay No</Label>
                  <Select
                    name="strikeNumber"
                    options={outputOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.strikeNumber}
                  />
                  <Label htmlFor="strikeMinActiveTime">Minimum Strike Active Time</Label>
                  <Input defaultValue={0} value={formData.strikeMinActiveTime} name="strikeMinActiveTime" type="number" id="strikeMinActiveTime" onChange={handleChange} />
                  <Label htmlFor="strikeMaxActiveTime">Maximum Strike Active Time</Label>
                  <Input defaultValue={0} value={formData.strikeMaxActiveTime} name="strikeMaxActiveTime" type="number" id="strikeMaxActiveTime" onChange={handleChange} />
                  <Label htmlFor="strikeMode">Strike Mode</Label>
                  <Select
                    name="strikeMode"
                    options={strikeModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.strikeMode}
                  />
                  <Label htmlFor="relayMode">Relay Mode</Label>
                  <Select
                    name="relayMode"
                    options={relayMode}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.relayMode}
                  />
                </div>

              }

              {activeTab == 5 &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="sensorSioNumber">Sensor Module</Label>
                  <Select
                    name="sensorSioNumber"
                    options={moduleOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.sensorSioNumber}
                  />
                  <Label htmlFor="sensorNumber">Input No</Label>
                  <Select
                    name="sensorNumber"
                    options={inputSensorOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.sensorNumber}
                  />
                  <Label htmlFor="sensorMode">Input Mode</Label>
                  <Select
                    name="sensorMode"
                    options={inputModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.sensorMode}
                  />
                </div>
              }

              {activeTab == 6 &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="antiPassbackMode">Anti-Passback Mode</Label>
                  <Select
                    name="antiPassbackMode"
                    options={antipassbackOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.antiPassbackMode}
                  />
                  <Label htmlFor="offlineMode">Offline Mode</Label>
                  <Select
                    name="offlineMode"
                    options={doorModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.offlineMode}
                  />
                  <Label htmlFor="defaultMode">Default Mode</Label>
                  <Select
                    name="defaultMode"
                    options={doorModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.defaultMode}
                  />
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