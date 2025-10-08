import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ModeDto, ScpDto, SioDto, TimeZoneDto, Option, AcrRdrModeDto, AcrDto } from '../../constants/types';
import { ACREndPoint, CPEndPoint, HttpMethod, MPEndPoint, PopUpMsg, ScpEndPoint, SioEndPoint, TimeZoneEndPoint } from '../../constants/constant';
import Select from '../../components/form/Select';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Radio from '../../components/form/input/Radio';
import Button from '../../components/ui/button/Button';
import ComponentCard from '../../components/common/ComponentCard';
import HttpRequest from '../../utility/HttpRequest';
import Logger from '../../utility/Logger';



interface DoorFormProps {
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  data: AcrDto,
  setAcrDto: React.Dispatch<React.SetStateAction<AcrDto>>;
}

const active = "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50";
const inactive = "inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"

const DoorForm: React.FC<PropsWithChildren<DoorFormProps>> = ({ handleClick, data, setAcrDto }) => {
  const [isReaderInOut, setIsReaderInOut] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string>("1");
  const [selectedReaderType, setSelectedReaderType] = useState<string>("0");
  const [selectedAlterReaderType, setSelectedAlterReaderType] = useState<string>("0");
  const osdpBaudRateOption: Option[] = [
    {
      label: "9600",
      value: 0x01,
    }, {
      label: "19200",
      value: 0x02,
    }, {
      label: "38400",
      value: 0x03,
    }, {
      label: "115200",
      value: 0x04,
    }, {
      label: "57600",
      value: 0x05,
    }, {
      label: "230400",
      value: 0x06,
    }]



  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    if (value == "0") {
      setAcrDto(prev => ({ ...prev, isAlternateReaderUsed: false, iSREX0Used: true }));
      setIsReaderInOut(false);
    } else {
      setIsReaderInOut(true);
      setAcrDto(prev => ({ ...prev, isAlternateReaderUsed: true, iSREX0Used: false }));
    }
  }

  const handleRadioChangeReaderType = (value: string) => {
    setSelectedReaderType(value);
    if (value == "0") {
      setAcrDto(prev => ({ ...prev, isReaderOsdp: false }));

    } else if (value == "1") {

      setAcrDto(prev => ({ ...prev, isReaderOsdp: true }));
    }

    if (value == "2") {
      setAcrDto(prev => ({ ...prev, isAlternateReaderOsdp: false }));
    } else if (value == "3") {
      setAcrDto(prev => ({ ...prev, isAlternateReaderOsdp: true }));
    }
  }

  const handleRadioChangeAlternateReaderType = (value: string) => {
    setSelectedAlterReaderType(value);

    if (value == "0") {
      setAcrDto(prev => ({ ...prev, isAlternateReaderOsdp: false }));
    } else if (value == "1") {
      setAcrDto(prev => ({ ...prev, isAlternateReaderOsdp: true }));
    }
  }

  const handleOnTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(Number(e.currentTarget.value));
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcrDto(prev => ({ ...prev, [e.target.name]: e.target.value }));

  };

  {/* Reader Module */ }
  const [moduleOption, setModuleOption] = useState<Option[]>([]);
  const fetchSio = async (value: string) => {
    const res = await HttpRequest.send(HttpMethod.GET, SioEndPoint.GET_SIO_BY_MAC + value);
    if (res && res.data.data) {
      res.data.data.map((a: SioDto) => {
        setModuleOption((prev) => [...prev, {
          label: a.name,
          value: a.componentNo,
          isAvailale: true
        }]);
      });
    }
  }
  {/* SCP Data */ }
  const [controller, setController] = useState<ScpDto[]>([]);
  const [controllerOption, setControllerOption] = useState<Option[]>([]);
  const handleSelectChange = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(value);
    console.log(e.target.name);
    if (e?.target.name != null) {
      setAcrDto(prev => ({ ...prev, [e?.target.name]: value }));
    }
    switch (e?.target.name) {
      case "mac":
        fetchSio(value);
        fetchAcrByMac(value);
        setAcrDto(prev => ({ ...prev, mac: value }));
        break;
      case "accessConfig":
        if (Number(value) == 1 || Number(value) == 2) {
          setIsPairUse(true);
        } else {
          setIsPairUse(false);
          setAcrDto(prev => ({ ...prev, pairACRNo: -1 }));
        }
        break;
      case "rdrSio":
        fetchReaderIn(data.mac, Number(value));
        break;
      case "altRdrSioNo":
        fetchReaderOut(data.mac, Number(value));
        break;
      case "rdrNo":
        setAcrDto(prev => ({ ...prev, osdpAddress: Number(value) }))
        break;
      case "altRdrNo":
        setAcrDto(prev => ({ ...prev, alternateOsdpAddress: Number(value) }))
        break;
      case "strkSio":
        fetchOutput(data.mac, Number(value))
        break;
      case "rex0SioNo":
        fetchInputRex0(data.mac, Number(value));
        break;
      case "rex1SioNo":
        fetchInputRex1(data.mac, Number(value));
        break;
      case "sensorSio":
        fetchInputSensor(data.mac, Number(value));
        break;
      case "defaultMode":
        setAcrDto(prev => ({ ...prev, mode: Number(value) }));
        break;
      default:
        break;
    }

  }
  const fetchScp = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, ScpEndPoint.GET_SCP_LIST)
    Logger.info(res)
    if (res && res.data.data) {
      setController(res.data.data);
      res.data.data.map((a: ScpDto) => {
        setControllerOption(prev => [...prev, {
          label: a.name,
          value: a.mac,
          isAvailale: true
        }])
      });
    }

  }
  {/* Access Reader Config */ }
  const [accessReaderConfigOption, setAccessReaderConfigOption] = useState<Option[]>([]);
  const [isPairUse, setIsPairUse] = useState<boolean>(false);
  const fetchAccessReaderMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_ACCESS_READER_MODE)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: AcrRdrModeDto) => {
        setAccessReaderConfigOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      });
    }
  }
  {/* Pair Reader */ }
  const fetchAcrByMac = async (ScpMac: string) => {
    const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_ACR_BY_MAC + ScpMac)
    Logger.info(res)
  }
  {/* Reader In Out*/ }
  const [readerInOption, setReaderInOption] = useState<Option[]>([]);
  const [readerOutOption, setReaderOutOption] = useState<Option[]>([]);
  const fetchReaderIn = async (mac: string, sio: number) => {
    const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_ACR_READER + mac + "/" + sio)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setReaderInOption(prev => [...prev, {
          label: `Reader ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      });

    }
  }
  const fetchReaderOut = async (mac: string, sio: number) => {
    const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_ACR_READER + mac + "/" + sio)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setReaderOutOption(prev => [...prev, {
          label: `Reader ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      });

    }
  }
  {/* Input */ }
  const [inputRex0Option, setInputRex0Option] = useState<Option[]>([])
  const [inputRex1Option, setInputRex1Option] = useState<Option[]>([])
  const [inputSensorOption, setInputSensorOption] = useState<Option[]>([])
  const [inputModeOption, setInputModeOption] = useState<Option[]>([])
  const fetchInputRex0 = async (mac: string, sio: number) => {
    const res = await HttpRequest.send(HttpMethod.GET, MPEndPoint.GET_IP_LIST + mac + "/" + sio)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setInputRex0Option(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    }

  }
  const fetchInputRex1 = async (mac: string, sio: number) => {
    const res = await HttpRequest.send(HttpMethod.GET, MPEndPoint.GET_IP_LIST + mac + "/" + sio)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setInputRex1Option(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    }
  }
  const fetchInputSensor = async (mac: string, sio: number) => {
    const res = await HttpRequest.send(HttpMethod.GET, MPEndPoint.GET_IP_LIST + mac + "/" + sio)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setInputSensorOption(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    }
  }
  const fetchInputMode = async () => {

    const res = await HttpRequest.send(HttpMethod.GET, MPEndPoint.GET_IP_MODE)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setInputModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
    }
  }
  {/* Output */ }
  const [outputOption, setOutputOption] = useState<Option[]>([])
  const [relayMode, setRelayMode] = useState<Option[]>([])
  const [strikeModeOption, setStrikeModeOption] = useState<Option[]>([])
  const fetchOutput = async (mac: string, sio: number) => {
    const res = await HttpRequest.send(HttpMethod.GET, CPEndPoint.GET_CP_OUTPUT + mac + "/" + sio)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setOutputOption(prev => [...prev, {
          label: `Output ${a + 1}`,
          value: a,
          isAvailale: true
        }])
      })
    }
  }
  const fetchStrikeMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_STRK_MODE)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setStrikeModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
    }
  }
  const fetchRelayMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, CPEndPoint.GET_RELAY_OP_MODE)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setRelayMode(prev => [...prev, {
          label: a.description,
          value: a.value,
          isAvailale: true
        }])
      })
    }
  }
  {/* Time Zone */ }
  const [timeZoneOption, setTimeZoneOption] = useState<Option[]>([])
  const fetchTimeZone = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, TimeZoneEndPoint.GET_TZ_LIST)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: TimeZoneDto) => {
        setTimeZoneOption(prev => [...prev, {
          label: a.name,
          value: a.componentNo,
          isAvailale: true
        }])
      })
    }
  }
  {/* Access Control Reader */ }
  const [doorModeOption, setDoorModeOption] = useState<Option[]>([]);
  const fetchAcrMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_ACR_MODE)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setDoorModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
    }
  }
  // const [acs,setAcs] = useState<>()
  {/* Anti Passback */ }
  const [antipassbackOption, setAntipassbackMode] = useState<Option[]>([]);
  const fetchApbMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, ACREndPoint.GET_APB_MODE)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setAntipassbackMode(prev => [...prev, {
          label: a.name,
          value: a.value,
          isAvailale: true
        }])
      })
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
            <Button onClickWithEvent={handleClick} name='create' className="w-50" size="sm">Submit </Button>
          </nav>
        </div>
        <div className='flex-2'>
          <div className="space-y-6 flex justify-center">
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
                  <Input value={data.name} name="name" type="text" id="name" onChange={handleChange} />
                  <div>
                    <Label htmlFor='mac'>Controller</Label>
                    <Select
                      isString={true}
                      name="mac"
                      options={controllerOption}
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={data.mac}
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
                      defaultValue={data.accessConfig}
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

                      <Label htmlFor='rdrSio' >Reader In - Module</Label>
                      <Select
                        name="rdrSio"
                        options={moduleOption}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={data.rdrSio}
                      />
                      <Label htmlFor='rdrNo'>Reader In - No</Label>
                      <Select
                        name="rdrNo"
                        options={readerInOption}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={data.rdrNo}
                      />
                      {data.isReaderOsdp &&
                        <>
                          <Label htmlFor='osdpAddress'>Reader Address</Label>
                          <Input isReadOnly={true} value={data.osdpAddress} name="osdpAddress" type="number" id="osdpAddress" onChange={handleChange} />
                          <Label htmlFor='readerNumber'>Reader Baud Rate</Label>
                          <Select
                            name="osdpBaudRate"
                            options={osdpBaudRateOption}
                            placeholder="Select Option"
                            onChangeWithEvent={handleSelectChange}
                            className="dark:bg-dark-900"
                            defaultValue={data.osdpBaudRate}
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
                    <Label htmlFor='altRdrSioNo'>Reader Out - Module</Label>
                    <Select
                      name="altRdrSioNo"
                      options={moduleOption}
                      placeholder="Select Option"
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={data.altRdrSioNo}
                    />
                  </div>
                  <div>
                    <Label htmlFor='altRdrNo'>Reader Out - No</Label>
                    <Select
                      name="altRdrNo"
                      options={readerOutOption}
                      placeholder="Select Option"
                      onChangeWithEvent={handleSelectChange}
                      className="dark:bg-dark-900"
                      defaultValue={data.altRdrNo}
                    />
                  </div>

                  {data.isAltRdrOsdp &&
                    <>
                      <Label htmlFor='altOsdpAddress'>Reader Address</Label>
                      <Input isReadOnly={true} value={data.altOsdpAddress} name="altOsdpAddress" type="number" id="alternateOsdpAddress" onChange={handleChange} />
                      <Label htmlFor='altOsdpBaudRate'>Reader Baud Rate</Label>
                      <Select
                        name="altOsdpBaudRate"
                        options={osdpBaudRateOption}
                        placeholder="Select Option"
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={data.altOsdpBaudRate}
                      />
                    </>
                  }
                </div>

              }

              {activeTab === 3 &&

                <div className='flex flex-col gap-1'>
                  <Label htmlFor='rex0SioNo'>REX 1 - Module</Label>
                  <Select
                    name="rex0SioNo"
                    options={moduleOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.rex0SioNo}
                  />
                  <Label htmlFor='rex0No'>REX 1 - Input No</Label>
                  <Select
                    name="rex0No"
                    options={inputRex0Option}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.rex0No}
                  />
                  <Label htmlFor="rex0SensorMode">REX 1 - Input Mode</Label>
                  <Select
                    name="rex0SensorMode"
                    options={inputModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.rex0SensorMode}
                  />
                  {/* <Label htmlFor="rEX0TimeZone">REX 1 - Time Zone</Label>
                  <Select
                    name="rEX0TimeZone"
                    options={timeZoneOption}
                    onChange={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={formData.rEX0TimeZone}
                  /> */}

                  {data.isRex1Used &&
                    <>
                      <Label htmlFor="rex1SioNo">REX 2 - Module</Label>
                      <Select
                        name="rex1SioNo"
                        options={moduleOption}
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={data.rex1SioNo}
                      />
                      <Label htmlFor="rex1No">REX 2 - Input No</Label>
                      <Select
                        name="rex1No"
                        options={inputRex1Option}
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={data.rex1No}
                      />
                      <Label htmlFor="rex1SensorMode">REX 2 - Input Mode</Label>
                      <Select
                        name="rex1SensorMode"
                        options={inputModeOption}
                        onChangeWithEvent={handleSelectChange}
                        className="dark:bg-dark-900"
                        defaultValue={data.rex1SensorMode}
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
                  <Label htmlFor="strkSio">Strike Module</Label>
                  <Select
                    name="strkSio"
                    options={moduleOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.strkSio}
                  />
                  <Label htmlFor="strkNo">Relay No</Label>
                  <Select
                    name="strkNo"
                    options={outputOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.strkNo}
                  />
                  <Label htmlFor="strkMin">Minimum Strike Active Time</Label>
                  <Input defaultValue={0} value={data.strkMin} name="strkMin" type="number" id="strikeMinActiveTime" onChange={handleChange} />
                  <Label htmlFor="strkMax">Maximum Strike Active Time</Label>
                  <Input defaultValue={0} value={data.strkMax} name="strkMax" type="number" id="strikeMaxActiveTime" onChange={handleChange} />
                  <Label htmlFor="strkMode">Strike Mode</Label>
                  <Select
                    name="strkMode"
                    options={strikeModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.strkMode}
                  />
                  <Label htmlFor="relayMode">Relay Mode</Label>
                  <Select
                    name="relayMode"
                    options={relayMode}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.relayMode}
                  />
                </div>

              }

              {activeTab == 5 &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="sensorSio">Sensor Module</Label>
                  <Select
                    name="sensorSio"
                    options={moduleOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.sensorSio}
                  />
                  <Label htmlFor="sensorNo">Input No</Label>
                  <Select
                    name="sensorNo"
                    options={inputSensorOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.sensorNo}
                  />
                  <Label htmlFor="sensorMode">Input Mode</Label>
                  <Select
                    name="sensorMode"
                    options={inputModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.sensorMode}
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
                    defaultValue={data.antiPassbackMode}
                  />
                  <Label htmlFor="offlineMode">Offline Mode</Label>
                  <Select
                    name="offlineMode"
                    options={doorModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.offlineMode}
                  />
                  <Label htmlFor="defaultMode">Default Mode</Label>
                  <Select
                    name="defaultMode"
                    options={doorModeOption}
                    onChangeWithEvent={handleSelectChange}
                    className="dark:bg-dark-900"
                    defaultValue={data.defaultMode}
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default DoorForm