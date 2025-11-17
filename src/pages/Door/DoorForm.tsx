import React, { ChangeEvent, PropsWithChildren, useEffect, useState } from 'react'
import Select from '../../components/form/Select';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Radio from '../../components/form/input/Radio';
import Button from '../../components/ui/button/Button';
import ComponentCard from '../../components/common/ComponentCard';
import HttpRequest from '../../utility/HttpRequest';
import Logger from '../../utility/Logger';
import Helper from '../../utility/Helper';
import { DoorDto } from '../../model/Door/DoorDto';
import { Options } from '../../model/Options';
import { ModuleDto } from '../../model/Module/ModuleDto';
import { HardwareDto } from '../../model/Hardware/HardwareDto';
import { ModeDto } from '../../model/ModeDto';
import { TimeZoneDto } from '../../model/TimeZone/TimeZoneDto';
import Switch from '../../components/form/switch/Switch';
import MultiSelect from '../../components/form/MultiSelect';
import { AxiosResponse } from 'axios';
import { ResponseDto } from '../../model/ResponseDto';
import { DeviceType } from '../../enum/DeviceType';
import { ReaderDto } from '../../model/Reader/ReaderDto';
import { ReaderType } from '../../enum/ReaderType';
import { RequestExitDto } from '../../model/RequestExit/RequestExitDto';
import { MultiselectOption } from '../../model/MultiselectOption';
import { CardFormatDto } from '../../model/CardFormat/CardFormatDto';
import { HttpMethod } from '../../enum/HttpMethod';
import { ModuleEndpoint } from '../../enum/endpoint/ModuleEndpoint';
import { HardwareEndpoint } from '../../enum/endpoint/HardwareEndpoint';
import { DoorEndpoint } from '../../enum/endpoint/DoorEndpoint';
import { MonitorPointEndpoint } from '../../enum/endpoint/MonitorPointEndpoint';
import { ControlPointEndpoint } from '../../enum/endpoint/ControlPointEndpoint';
import { TimeZoneEndPoint } from '../../enum/endpoint/TimezoneEndpoint';
import { CardFormatEndpoint } from '../../enum/endpoint/CardFormatEndpoint';



interface DoorFormProps {
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  data: DoorDto;
  setDoorDto: React.Dispatch<React.SetStateAction<DoorDto>>;
}

enum FormTab {
  General, Inside, Outside, Strike, Antipassback, Monitor, Advance, Mode
}

var defaultRequestExit: RequestExitDto = {
  // base 
  uuid: "",
  componentId: -1,
  macAddress: "",
  locationId: 1,
  locationName: "Main Location",
  isActive: true,

  // Detail
  moduleId: -1,
  inputNo: -1,
  inputMode: -1,
  debounce: 0,
  holdTime: 0,
  maskTimeZone: -1
}
var defaultReader: ReaderDto = {
  // base 
  uuid: "",
  componentId: -1,
  macAddress: "",
  locationId: 1,
  locationName: "Main Location",
  isActive: true,

  // Detail
  moduleId: -1,
  readerNo: -1,
  dataFormat: -1,
  keypadMode: -1,
  ledDriveMode: -1,
  osdpFlag: false,
  osdpAddress: 0x00,
  osdpDiscover: 0x00,
  osdpTracing: 0x00,
  osdpBaudrate: 0x00,
  osdpSecureChannel: 0x00
}

const active = "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50";
const inactive = "inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"

const DoorForm: React.FC<PropsWithChildren<DoorFormProps>> = ({ handleClick, data, setDoorDto }) => {
  {/* In */ }
  const [insideType, setInsideType] = useState<string>(DeviceType.None);
  const [readerInFlag, setReaderInFlag] = useState<boolean>(false);
  const [readerInType, setReaderInType] = useState<string>(ReaderType.Wiegand)
  const handleInsideDeviceType = (value: string) => {
    setInsideType(value);
    if (value == DeviceType.Reader) {
      setReaderInFlag(true);
    };
    if (value == DeviceType.None) {
      setReaderInFlag(false);
      setDoorDto(prev => ({ ...prev, readers: prev.readers.map((reader, index) => index === 0 ? defaultReader : reader) }))
    }
  }

  {/* Out */ }
  const [outsideType, setOutsideType] = useState<string>(DeviceType.None);
  const [readerOutFlag, setReaderOutFlag] = useState<boolean>(false);
  const [readerOutType, setReaderOutType] = useState<string>(ReaderType.Wiegand);
  const [requestExitOneFlag, setRequestExitOneFlag] = useState<boolean>(false);
  const [requestExitTwoFlag, setRequestExitTwoFlag] = useState<boolean>(false);
  const handleOutsideDeviceType = (value: string) => {
    setOutsideType(value);
    if (value == DeviceType.Reader) {
      setReaderOutFlag(true);
      setRequestExitOneFlag(false);
      setRequestExitTwoFlag(false);
      setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((rex, index) => index === 0 || index === 1 ? defaultRequestExit : rex) }))
    }
    if (value == DeviceType.None) {
      setReaderOutFlag(false);
      setRequestExitOneFlag(false);
      setRequestExitTwoFlag(false);
      setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((rex, index) => index === 0 || index === 1 ? defaultRequestExit : rex), readers: prev.readers.map((re, index) => index === 1 ? defaultReader : re) }))
    }
    if (value == DeviceType.REX) {
      setRequestExitOneFlag(true);
      setReaderOutFlag(false);
      setDoorDto(prev => ({ ...prev, readers: prev.readers.map((re, index) => index === 1 ? defaultReader : re) }))
    }
  }

  const [activeTab, setActiveTab] = useState<number>(0);
  const [osdpBaudRateOption, setOsdpBaudRateOption] = useState<Options[]>([])


  {/* Card format */ }
  const [formatsOption, setFormatsOption] = useState<MultiselectOption[]>([]);

  {/* Advance */ }
  const [spareFlag, setSpareFlag] = useState<ModeDto[]>([]);
  const [accessFlag, setAccessFlag] = useState<ModeDto[]>([]);


  const handleOnTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(Number(e.currentTarget.value));
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoorDto(prev => ({ ...prev, [e.target.name]: e.target.value }));

  };


  {/* Reader Module */ }
  const [moduleOption, setModuleOption] = useState<Options[]>([]);
  const fetchModule = async (value: string) => {
    const res = await HttpRequest.send(HttpMethod.GET, ModuleEndpoint.GET_SIO_BY_MAC + value);
    if (res && res.data.data) {
      res.data.data.map((a: ModuleDto) => {
        setModuleOption((prev) => [...prev, {
          label: `${a.model} ( ${a.address} )`,
          value: a.componentId,
          isTaken: false
        }]);
      });
    }
  }
  {/* SCP Data */ }
  const [controller, setController] = useState<HardwareDto[]>([]);
  const [controllerOption, setControllerOption] = useState<Options[]>([]);

  const fetchScp = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, HardwareEndpoint.GET_SCP_LIST)
    Logger.info(res)
    if (res && res.data.data) {
      setController(res.data.data);
      res.data.data.map((a: HardwareDto) => {
        setControllerOption(prev => [...prev, {
          label: a.name,
          value: a.macAddress,
          isTaken: false
        }])
      });
    }

  }
  {/* Access Reader Config */ }
  const [accessReaderConfigOption, setAccessReaderConfigOption] = useState<Options[]>([]);
  const [isPairUse, setIsPairUse] = useState<boolean>(false);
  const fetchAccessReaderMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACCESS_READER_MODE)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setAccessReaderConfigOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isTaken: false
        }])
      });
    }
  }
  {/* Pair Reader */ }
  const fetchDoorByMac = async (ScpMac: string) => {
    const res: AxiosResponse<ResponseDto<DoorDto[]>, any> | null | undefined = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACR_BY_MAC + ScpMac)
    res?.data.data.map((a: DoorDto) => {
      setDoorOption(prev => [...prev, {
        label: a.name,
        value: a.componentId,
        description: '',
        isTaken: false
      }])
    })
  }
  {/* Reader In Out*/ }
  const [readerInOption, setReaderInOption] = useState<Options[]>([]);
  const [doorOption, setDoorOption] = useState<Options[]>([]);
  const [readerOutOption, setReaderOutOption] = useState<Options[]>([]);
  const [readerOutConfigurationOption, setReaderOutConfigurationOption] = useState<Options[]>([]);
  const fetchReaderIn = async (mac: string, sio: number) => {
    if (readerInOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACR_READER + mac + "/" + sio)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setReaderInOption(prev => [...prev, {
          label: `Reader ${a + 1}`,
          value: a,
          isTaken: false
        }])
      });

    }
  }
  const fetchReaderOut = async (mac: string, sio: number) => {
    if (readerOutOption.length !== 0) return;
    if (data.readers[0].moduleId == sio) {
      setReaderOutOption(readerInOption.filter((a) => a.isTaken === false))
      return;
    }
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACR_READER + mac + "/" + sio)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setReaderOutOption(prev => [...prev, {
          label: `Reader ${a + 1}`,
          value: a,
          isTaken: false
        }])
      });

    }
  }
  {/* Input */ }
  const [inputRex0Option, setInputRex0Option] = useState<Options[]>([])
  const [inputRex1Option, setInputRex1Option] = useState<Options[]>([])
  const [inputSensorOption, setInputSensorOption] = useState<Options[]>([])
  const [inputModeOption, setInputModeOption] = useState<Options[]>([])
  const fetchInputRex0 = async (mac: string, sio: number) => {
    if (inputRex0Option.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_IP_LIST + mac + "/" + sio)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setInputRex0Option(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isTaken: false
        }])
      })
    }

  }
  const fetchInputRex1 = async (mac: string, sio: number) => {
    if (inputRex1Option.length !== 0) return;
    if (data.requestExits[0].moduleId === sio) {
      setInputRex1Option(inputRex0Option.filter((a) => a.isTaken === false));
      return;
    }
    const res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_IP_LIST + mac + "/" + sio)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setInputRex1Option(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isTaken: false
        }])
      })
    }
  }
  const fetchInputSensor = async (mac: string, sio: number) => {
    if (inputSensorOption.length !== 0) return;
    if (data.requestExits[1].moduleId == sio && inputRex1Option.length !== 0) {
      setInputSensorOption(inputRex1Option.filter(a => a.isTaken == false));
      return;
    } else if (data.requestExits[0].moduleId == sio) {
      setInputSensorOption(inputRex0Option.filter(a => a.isTaken == false));
      return;
    }
    const res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_IP_LIST + mac + "/" + sio)
    if (res && res.data.data) {
      res.data.data.map((a: number) => {
        setInputSensorOption(prev => [...prev, {
          label: `Input ${a + 1}`,
          value: a,
          isTaken: false
        }])
      })
    }
  }
  const fetchInputMode = async () => {
    if (inputModeOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, MonitorPointEndpoint.GET_IP_MODE)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setInputModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isTaken: false
        }])
      })
    }
  }
  {/* Output */ }
  const [outputOption, setOutputOption] = useState<Options[]>([])
  const [relayMode, setRelayMode] = useState<Options[]>([])
  const [strikeModeOption, setStrikeModeOption] = useState<Options[]>([])
  const fetchOutput = async (mac: string, sio: number) => {
    if (outputOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.GET_CP_OUTPUT + mac + "/" + sio)
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
    if (strikeModeOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_STRK_MODE)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setStrikeModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isTaken: false
        }])
      })
    }
  }
  const fetchRelayMode = async () => {
    if (relayMode.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, ControlPointEndpoint.GET_RELAY_OP_MODE)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setRelayMode(prev => [...prev, {
          label: a.description,
          value: a.value,
          isTaken: false
        }])
      })
    }
  }
  {/* Time Zone */ }
  const [timeZoneOption, setTimeZoneOption] = useState<Options[]>([])
  const fetchTimeZone = async () => {
    if (timeZoneOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, TimeZoneEndPoint.GET_TZ_LIST)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: TimeZoneDto) => {
        setTimeZoneOption(prev => [...prev, {
          label: a.name,
          value: a.componentId,
          isTaken: false
        }])
      })
    }
  }
  {/* Access Control Reader */ }
  const [doorModeOption, setDoorModeOption] = useState<Options[]>([]);
  const fetchAcrMode = async () => {
    if (doorModeOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACR_MODE)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setDoorModeOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isTaken: false
        }])
      })
    }
  }
  // const [acs,setAcs] = useState<>()
  {/* Anti Passback */ }
  const [antipassbackOption, setAntipassbackMode] = useState<Options[]>([]);
  const [areaOption, setAreaOption] = useState<Options[]>([]);
  const fetchApbMode = async () => {
    if (antipassbackOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_APB_MODE)
    Logger.info(res)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setAntipassbackMode(prev => [...prev, {
          label: a.name,
          value: a.value,
          isTaken: false
        }])
      })
    }
  }

  const fetchOsdpBaudrateOption = async () => {
    if (osdpBaudRateOption.length !== 0) return;
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_BAUD_RATE)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setOsdpBaudRateOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isTaken: false
        }])
      })
    }
  }

  const fetchReaderOutConfigurationOption = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_READER_OUT_CONFIG)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setReaderOutConfigurationOption(prev => [...prev, {
          label: a.name,
          value: a.value,
          isTaken: false
        }])
      })
    }
  };

  const fetchCardFormat = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, CardFormatEndpoint.GET_ALL_CARDFORMAT)
    if (res && res.data.data) {
      res.data.data.map((a: CardFormatDto) => {
        setFormatsOption(prev => [...prev, {
          selected: false,
          value: String(a.componentId),
          text: String(a.name)
        }])
      })
    }
  }

  const fetchSpareMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_SPARE_FLAG)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setSpareFlag(prev => [...prev, {
          description: a.description,
          value: a.value,
          name: a.name
        }])
      })
    }
  }
  const fetchAccessControlMode = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, DoorEndpoint.GET_ACCESS_CONTROL_FLAG)
    if (res && res.data.data) {
      res.data.data.map((a: ModeDto) => {
        setAccessFlag(prev => [...prev, {
          description: a.description,
          value: a.value,
          name: a.name
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
    fetchOsdpBaudrateOption();
    fetchReaderOutConfigurationOption();
    fetchCardFormat();
    fetchSpareMode();
    fetchAccessControlMode();
  }, [])

  return (
    <ComponentCard title="Add Doors">

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex-1 overflow-x-auto pb-2 sm:w-[200px]">
          <nav className="flex w-full flex-row sm:flex-col sm:space-y-2">
            <button value={FormTab.General} className={activeTab === FormTab.General ? active : inactive} onClick={handleOnTabClick}>
              General
            </button>

            <button value={FormTab.Outside} className={activeTab === FormTab.Outside ? active : inactive} onClick={handleOnTabClick}>
              In
            </button>
            <button value={FormTab.Inside} className={activeTab === FormTab.Inside ? active : inactive} onClick={handleOnTabClick}>
              Out
            </button>
            <button value={FormTab.Monitor} className={activeTab === FormTab.Monitor ? active : inactive} onClick={handleOnTabClick}>
              Monitor
            </button>
            <button value={FormTab.Strike} className={activeTab === FormTab.Strike ? active : inactive} onClick={handleOnTabClick}>
              Strike
            </button>
            <button value={FormTab.Antipassback} className={activeTab === FormTab.Antipassback ? active : inactive} onClick={handleOnTabClick}>
              Anti-passback
            </button>
            <button value={FormTab.Mode} className={activeTab === FormTab.Mode ? active : inactive} onClick={handleOnTabClick}>
              Door Mode
            </button>
            <button value={FormTab.Advance} className={activeTab === FormTab.Advance ? active : inactive} onClick={handleOnTabClick}>
              Advance Setting
            </button>
            <div className='flex gap-3'>
              <Button onClickWithEvent={handleClick} name='create' className="w-50" size="sm">Create </Button>
              <Button variant='danger' onClickWithEvent={handleClick} name='close' className="w-50" size="sm">Cancel </Button>
            </div>

          </nav>
        </div>
        <div className='flex-2'>
          <div className="space-y-6 flex justify-center">
            <div className='w-[60%]'>
              {activeTab == FormTab.General &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="name">Door Name</Label>
                  <Input value={data.name} name="name" type="text" id="name" onChange={
                    (e: React.ChangeEvent<HTMLInputElement>) =>
                      setDoorDto(prev => ({ ...prev, name: e.target.value }))
                  } />
                  <div>
                    <Label htmlFor='macAddress'>Controller</Label>
                    <Select
                      isString={true}
                      id='macAddress'
                      name="macAddress"
                      options={controllerOption}
                      onChange={(value: string) => {
                        setDoorDto(prev => ({ ...prev, macAddress: value }))
                        fetchModule(value);
                        fetchDoorByMac(value);
                      }}
                      className="dark:bg-dark-900"
                      defaultValue={data.macAddress}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accessConfig">Access Config</Label>
                    <Select
                      id='accessConfig'
                      name="accessConfig"
                      options={accessReaderConfigOption}
                      //placeholder="Select Option"
                      onChange={(value: string) => {
                        setDoorDto(prev => ({ ...prev, accessConfig: Number(value) }))
                        if (Number(value) == 1 || Number(value) == 2) {
                          setIsPairUse(true);
                        } else {
                          setIsPairUse(false);
                          setDoorDto(prev => ({ ...prev, pairDoorNo: -1 }));
                        }
                      }}
                      className="dark:bg-dark-900"
                      defaultValue={data.accessConfig}
                    />
                  </div>

                  {isPairUse &&
                    <>
                      <Label htmlFor="pairDoorNo">Paired Reader</Label>
                      {doorOption.length <= 0 ?
                        <Input disabled placeholder="No Door Available" />
                        :
                        <Select
                          name="pairDoorNo"
                          options={doorOption}
                          placeholder="Select Option"
                          onChange={(value: string | number | ReaderType) => setDoorDto(prev => ({ ...prev, pairDoorNo: Number(value) }))}
                          className="dark:bg-dark-900"
                          defaultValue={data.pairDoorNo}
                        />
                      }

                    </>
                  }
                  <div>
                    <MultiSelect
                      label="Specific Supported Card Format"
                      options={formatsOption}
                      defaultSelected={[]}
                      onChange={(values) => {
                        values.map(a => {
                          setDoorDto(prev => ({ ...prev, cardFormat: prev.cardFormat | Number(a) }))
                        })
                      }}
                    />
                  </div>
                </div>
              }

              {activeTab === FormTab.Outside &&
                <div className='flex flex-col gap-5'>
                  <div className='gap-3'>
                    <div className='flex flex-col gap-1'>
                      <Label htmlFor='mode' >Type</Label>
                      <div className="flex justify-around gap-3 pb-3">
                        <div className="flex flex-col flex-wrap gap-8">
                          <Radio
                            id="insideType1"
                            name="insideType1"
                            value="None"
                            checked={insideType === DeviceType.None}
                            onChange={handleInsideDeviceType}
                            label="None"
                          />
                        </div>

                        <div className="flex flex-col flex-wrap gap-8">
                          <Radio
                            id="insideType2"
                            name="insideType2"
                            value="Reader"
                            checked={insideType === DeviceType.Reader}
                            onChange={handleInsideDeviceType}
                            label="Reader"
                          />
                        </div>

                      </div>

                      {readerInFlag &&
                        <>
                          <div>
                            <Label htmlFor='ReaderType' >Reader Type</Label>
                            <Select
                              name="ReaderType"
                              options={[
                                {
                                  label: "Wiegand",
                                  value: ReaderType.Wiegand,
                                  description: "",
                                  isTaken: false,
                                }, {
                                  label: "OSDP",
                                  value: ReaderType.OSDP,
                                  description: "",
                                  isTaken: false,
                                }
                              ]}
                              placeholder="Select Option"
                              onChange={(value: string) => {
                                if (value == ReaderType.Wiegand) {
                                  setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, osdpFlag: false, osdpAddress: 0x00, altOsdpBaudRate: 0x00, osdpDiscover: 0x00, osdpSecureChannel: 0x00, osdpTracing: 0x00 } : r) }))
                                } else {
                                  setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, osdpFlag: true } : r) }))
                                }
                                setReaderInType(value)
                              }}
                              className="dark:bg-dark-900"
                              defaultValue={readerInType}
                            />
                          </div>
                          <div>
                            <Label htmlFor='readerIn.moduleId' >Reader In - Module</Label>
                            <Select
                              name="readerIn.moduleId"
                              options={moduleOption}
                              placeholder="Select Option"
                              onChange={(value: string) => {
                                setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, macAddress: prev.macAddress, moduleId: Number(value) } : r) }))
                                fetchReaderIn(data.macAddress, Number(value));
                              }}
                              className="dark:bg-dark-900"
                              defaultValue={data.readers[0].moduleId}
                            />
                          </div>
                          <div>
                            <Label htmlFor='readerIn.readerNo'>Reader In - No</Label>
                            <Select
                              name="readerIn.readerNo"
                              options={readerInOption}
                              placeholder="Select Option"
                              onChange={(value: string) => {
                                setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, readerNo: Number(value) } : r) }))
                                setReaderInOption(prev => Helper.updateOptionByValue(prev, Number(value), true))
                              }}
                              className="dark:bg-dark-900"
                              defaultValue={data.readers[0].readerNo}
                            />
                          </div>

                          {readerInType == ReaderType.OSDP &&
                            <>
                              <Label htmlFor='readerIn.osdpAddress'>Reader Address</Label>
                              <Input value={data.readers[0].osdpAddress} name="readerIn.osdpAddress" type="number" id="osdpAddress" onChange={handleChange} />
                              <Label htmlFor='readerNumber'>Reader Baud Rate</Label>
                              <Select
                                name="readerIn.osdpBaudrate"
                                options={osdpBaudRateOption}
                                placeholder="Select Option"
                                onChange={(value: string) => {
                                  setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, osdpBaudrate: Number(value) } : r) }))
                                }}
                                className="dark:bg-dark-900"
                                defaultValue={data.readers[0].osdpBaudrate}
                              />
                              <div className='mt-3'>
                                <Switch
                                  label="Auto Discover"
                                  defaultChecked={true}
                                  onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, osdpDiscover: checked ? 0x00 : 0x80 } : r) }))}
                                />
                              </div>
                              <div className='mt-3'>
                                <Switch
                                  label="Tracing"
                                  defaultChecked={false}
                                  onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, osdpTracing: checked ? 0x10 : 0x00 } : r) }))}
                                />
                              </div>
                              <div className='mt-3'>
                                <Switch
                                  label="Secure Channel"
                                  defaultChecked={false}
                                  onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 0 ? { ...r, osdpSecureChannel: checked ? 0x80 : 0x00 } : r) }))}
                                />
                              </div>

                            </>

                          }
                        </>
                      }
                    </div>
                  </div>

                </div>
              }

              {activeTab === FormTab.Inside &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor='mode' >Type</Label>
                  <div className="flex justify-around gap-3 pb-3">
                    <div className="flex flex-col flex-wrap gap-8">
                      <Radio
                        id="outsideType1"
                        name="outsideType1"
                        value={DeviceType.None}
                        checked={outsideType === DeviceType.None}
                        onChange={handleOutsideDeviceType}
                        label={DeviceType.None}
                      />
                    </div>

                    <div className="flex flex-col flex-wrap gap-8">
                      <Radio
                        id="outsideType2"
                        name="outsideType2"
                        value={DeviceType.Reader}
                        checked={outsideType === DeviceType.Reader}
                        onChange={handleOutsideDeviceType}
                        label={DeviceType.Reader}
                      />
                    </div>
                    <div className="flex flex-col flex-wrap gap-8">
                      <Radio
                        id="outsideType3"
                        name="outsideType3"
                        value={DeviceType.REX}
                        checked={outsideType === DeviceType.REX}
                        onChange={handleOutsideDeviceType}
                        label={DeviceType.REX}
                      />
                    </div>

                  </div>
                  {readerOutFlag &&
                    <>
                      <div>
                        <Label htmlFor='ReaderType' >Reader Type</Label>
                        <Select
                          name="ReaderType"
                          options={[
                            {
                              label: "Wiegand",
                              value: ReaderType.Wiegand,
                              description: "",
                              isTaken: false,
                            }, {
                              label: "OSDP",
                              value: ReaderType.OSDP,
                              description: "",
                              isTaken: false,
                            }
                          ]}
                          placeholder="Select Option"
                          onChange={(value: string) => {
                            if (value == ReaderType.Wiegand) {
                              setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, osdpFlag: false, osdpAddress: 0x00, altOsdpBaudRate: 0x00, osdpDiscover: 0x00, osdpSecureChannel: 0x00, osdpTracing: 0x00 } : r) }))
                            } else {
                              setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, osdpFlag: true } : r) }))
                            }
                            setReaderOutType(value)
                          }}
                          className="dark:bg-dark-900"
                          defaultValue={readerOutType}
                        />
                      </div>
                      <div>
                        <Label htmlFor='readerOut.moduleId'>Reader Out - Module</Label>
                        <Select
                          name="readerOut.moduleId"
                          options={moduleOption}
                          placeholder="Select Option"
                          onChangeWithEvent={(value: string) => {
                            setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, macAddress: prev.macAddress, moduleId: Number(value) } : r) }))
                            fetchReaderOut(data.macAddress, Number(value));
                          }}
                          className="dark:bg-dark-900"
                          defaultValue={data.readers[1].moduleId}
                        />
                      </div>
                      <div>
                        <Label htmlFor='readerOut.readerNo'>Reader Out - No</Label>
                        <Select
                          name="readerOut.readerNo"
                          options={readerOutOption}
                          placeholder="Select Option"
                          onChange={(value: string) => {
                            setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, readerNo: Number(value) } : r) }))
                          }}
                          className="dark:bg-dark-900"
                          defaultValue={data.readers[1].readerNo}
                        />
                      </div>
                      <div>
                        <Label htmlFor='readerOutConfiguration'>Reader Out - Configuration</Label>
                        <Select
                          name="readerOutConfiguration"
                          options={readerOutConfigurationOption}
                          placeholder="Select Option"
                          onChange={(value: string) => {
                            setDoorDto(prev => ({ ...prev, readerOutConfiguration: Number(value) }))
                          }}
                          className="dark:bg-dark-900"
                          defaultValue={data.readerOutConfiguration}
                        />
                      </div>

                      {data.readers[1].osdpFlag &&
                        <>
                          <Label htmlFor='readerOut.osdpAddress'>Reader Address</Label>
                          <Input value={data.readers[1].osdpAddress} name="readerOut.osdpAddress" type="number" id="alternateOsdpAddress" onChange={handleChange} />
                          <Label htmlFor='readerOut.osdpBaudrate'>Reader Baud Rate</Label>
                          <Select
                            name="readerOut.osdpBaudrate"
                            options={osdpBaudRateOption}
                            placeholder="Select Option"
                            onChange={(value: string) => {
                              setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, osdpBaudrate: Number(value) } : r) }))
                            }}
                            className="dark:bg-dark-900"
                            defaultValue={data.readers[1].osdpBaudrate}
                          />
                          <div className='mt-3'>
                            <Switch
                              label="Auto Discover"
                              defaultChecked={true}
                              onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, osdpDiscover: checked ? 0x00 : 0x80 } : r) }))}
                            />
                          </div>
                          <div className='mt-3'>
                            <Switch
                              label="Tracing"
                              defaultChecked={false}
                              onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, osdpTracing: checked ? 0x10 : 0x00 } : r) }))}
                            />
                          </div>
                          <div className='mt-3'>
                            <Switch
                              label="Secure Channel"
                              defaultChecked={false}
                              onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, readers: prev.readers.map((r, i) => i === 1 ? { ...r, osdpSecureChannel: checked ? 0x80 : 0x00 } : r) }))}
                            />
                          </div>
                        </>
                      }

                    </>

                  }

                  {requestExitOneFlag &&
                    <div className='flex flex-col gap-1'>
                      <Label htmlFor='rex0.moduleId'>REX - Module</Label>
                      <Select
                        name="rex0.moduleId"
                        options={moduleOption}
                        onChange={(value: string) => {
                          fetchInputRex0(data.macAddress, Number(value));
                          setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 0 ? { ...r, macAddress: prev.macAddress, moduleId: Number(value) } : r) }))
                        }}
                        className="dark:bg-dark-900"
                        defaultValue={data.requestExits[0].moduleId}
                      />
                      <Label htmlFor='rex0.inputNo'>REX - Input No</Label>
                      <Select
                        name="rex0.inputNo"
                        options={inputRex0Option}
                        onChange={(value: string) => {
                          setInputRex0Option(prev => Helper.updateOptionByValue(prev, Number(value), true));
                          setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 0 ? { ...r, inputNo: Number(value) } : r) }))
                        }}
                        className="dark:bg-dark-900"
                        defaultValue={data.requestExits[0].inputNo}
                      />
                      <Label htmlFor="rex0.inputMode">REX - Input Mode</Label>
                      <Select
                        name="rex0.inputMode"
                        options={inputModeOption}
                        onChange={(value: string) => {
                          setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 0 ? { ...r, inputMode: Number(value) } : r) }))
                        }}
                        className="dark:bg-dark-900"
                        defaultValue={data.requestExits[0].inputMode}
                      />
                      <Label htmlFor="rex0MaskTimeZone">REX - Mask Time Zone</Label>
                      <Select
                        name="rex0MaskTimeZone"
                        options={timeZoneOption}
                        onChange={(value: string) => {
                          setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 0 ? { ...r, maskTimeZone: Number(value) } : r) }))
                        }}
                        className="dark:bg-dark-900"
                        defaultValue={data.requestExits[0].maskTimeZone}
                      />

                      {requestExitTwoFlag &&
                        <>
                          <Label htmlFor="rex1.moduleId">Alter REX - Module</Label>
                          <Select
                            name="rex1.moduleId"
                            options={moduleOption}
                            onChange={(value: string) => {
                              fetchInputRex1(data.macAddress, Number(value));
                              setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 1 ? { ...r, macAddress: prev.macAddress, moduleId: Number(value) } : r) }))
                            }}
                            className="dark:bg-dark-900"
                            defaultValue={data.requestExits[1].moduleId}
                          />
                          <Label htmlFor="rex1.inputNo">Alter REX - Input No</Label>
                          <Select
                            name="rex1.inputNo"
                            options={inputRex1Option}
                            onChange={(value: string) => {
                              setInputRex1Option(prev => Helper.updateOptionByValue(prev, Number(value), true));
                              setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 1 ? { ...r, inputNo: Number(value) } : r) }))
                            }}
                            className="dark:bg-dark-900"
                            defaultValue={data.requestExits[1].inputNo}
                          />
                          <Label htmlFor="rex1.inputMode">Alter REX - Input Mode</Label>
                          <Select
                            name="rex1.inputMode"
                            options={inputModeOption}
                            onChange={(value: string) => {
                              setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 1 ? { ...r, inputMode: Number(value) } : r) }))
                            }}
                            className="dark:bg-dark-900"
                            defaultValue={data.requestExits[1].inputMode}
                          />
                          <Label htmlFor="rex1MaskTimeZone">Alter REX - Time Zone</Label>
                          <Select
                            name="rex1MaskTimeZone"
                            options={timeZoneOption}
                            onChangeWithEvent={(value: string) => {
                              setDoorDto(prev => ({ ...prev, requestExits: prev.requestExits.map((r, i) => i === 1 ? { ...r, maskTimeZone: Number(value) } : r) }))
                            }}
                            className="dark:bg-dark-900"
                            defaultValue={data.requestExits[1].maskTimeZone}
                          />
                        </>
                      }

                    </div>
                  }

                </div>

              }


              {
                activeTab === FormTab.Strike &&
                <div className='flex flex-col gap-1 max-h-[60vh] overflow-y-auto overflow-y-auto hidden-scroll'>
                  <Label htmlFor="strk.moduleId">Strike Module</Label>
                  <Select
                    name="strk.moduleId"
                    options={moduleOption}
                    onChange={(value: string) => {
                      fetchOutput(data.macAddress, Number(value))
                      setDoorDto(prev => ({ ...prev, strk: { ...prev.strk, macAddress: prev.macAddress, moduleId: Number(value) } }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.strk.moduleId}
                  />
                  <Label htmlFor="strk.outputNo">Relay No</Label>
                  <Select
                    name="strk.outputNo"
                    options={outputOption}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, strk: { ...prev.strk, outputNo: Number(value) } }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.strk.outputNo}
                  />
                  <Label htmlFor="strkMin">Minimum Strike Active Time</Label>
                  <Input defaultValue={1} value={data.strk.strkMin} name="strkMin" type="number" id="strikeMinActiveTime"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setDoorDto(prev => ({ ...prev, strk: { ...prev.strk, strkMin: Number(e.target.value) } }))
                    }} />
                  <Label htmlFor="strkMax">Maximum Strike Active Time</Label>
                  <Input defaultValue={5} value={data.strk.strkMax} name="strkMax" type="number" id="strikeMaxActiveTime" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setDoorDto(prev => ({ ...prev, strk: { ...prev.strk, strkMax: Number(e.target.value) } }))
                  }} />
                  <Label htmlFor="strkMode">Strike Mode</Label>
                  <Select
                    name="strkMode"
                    options={strikeModeOption}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, strk: { ...prev.strk, strkMode: Number(value) } }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.strk.strkMode}
                  />
                  <Label htmlFor="strk.relayMode">Relay Mode</Label>
                  <Select
                    name="strk.relayMode"
                    options={relayMode}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, strk: { ...prev.strk, relayMode: Number(value) } }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.strk.relayMode}
                  />
                </div>

              }

              {activeTab == FormTab.Monitor &&
                <div className='flex flex-col gap-1'>
                  <Label htmlFor="sensor.moduleId">Sensor Module</Label>
                  <Select
                    name="sensor.moduleId"
                    options={moduleOption}
                    onChange={(value: string) => {
                      fetchInputSensor(data.macAddress, Number(value));
                      setDoorDto(prev => ({ ...prev, sensor: { ...prev.sensor, macAddress: prev.macAddress, moduleId: Number(value) } }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.sensor.moduleId}
                  />
                  <Label htmlFor="sensor.inputNo">Input No</Label>
                  <Select
                    name="sensor.inputNo"
                    options={inputSensorOption}
                    onChange={(value: string) => {
                      fetchInputSensor(data.macAddress, Number(value));
                      setDoorDto(prev => ({ ...prev, sensor: { ...prev.sensor, inputNo: Number(value) } }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.sensor.inputNo}
                  />
                  <Label htmlFor="sensor.inputMode">Input Mode</Label>
                  <Select
                    name="sensor.inputMode"
                    options={inputModeOption}
                    onChange={(value: string) => {
                      fetchInputSensor(data.macAddress, Number(value));
                      setDoorDto(prev => ({ ...prev, sensor: { ...prev.sensor, inputMode: Number(value) } }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.sensor.inputMode}
                  />
                </div>
              }

              {activeTab == FormTab.Antipassback &&

                <div className='flex flex-col gap-1'>
                  <Label htmlFor="antiPassbackMode">Anti-Passback Mode</Label>
                  <Select
                    name="antiPassbackMode"
                    options={antipassbackOption}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, antiPassbackMode: Number(value) }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.antiPassbackMode}
                  />
                  <Label htmlFor="antiPassBackIn">Area From</Label>
                  <Select
                    isString={false}
                    name="antiPassBackIn"
                    options={areaOption}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, antiPassBackIn: Number(value) }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.antiPassBackIn}
                  />
                  <Label htmlFor="antiPassBackOut">Area To</Label>
                  <Select
                    isString={false}
                    name="antiPassBackOut"
                    options={areaOption}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, antiPassBackOut: Number(value) }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.antiPassBackOut}
                  />

                </div>
              }
              {activeTab == FormTab.Mode &&
                <div className='flex flex-col gap-1'>

                  <Label htmlFor="offlineMode">Offline Mode</Label>
                  <Select
                    isString={false}
                    name="offlineMode"
                    options={doorModeOption}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, offlineMode: Number(value) }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.offlineMode}
                  />
                  <Label htmlFor="defaultMode">Default Mode</Label>
                  <Select
                    isString={false}
                    name="defaultMode"
                    options={doorModeOption}
                    onChange={(value: string) => {
                      setDoorDto(prev => ({ ...prev, defaultMode: Number(value) }))
                    }}
                    className="dark:bg-dark-900"
                    defaultValue={data.defaultMode}
                  />
                </div>

              }

              {activeTab == FormTab.Advance &&
                <>
                  <Label>Door Setting</Label>
                  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className='flex gap-1'>
                      <div className='flex-1'>
                        <Label htmlFor="defaultMode">Access Control Mode</Label>
                        {accessFlag.map((d, i) => <div className='m-3'>
                          <Switch
                            key={i}
                            label={d.name}
                            defaultChecked={false}
                            onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, accessControlFlags: checked ? prev.accessControlFlags | d.value : prev.accessControlFlags & (~d.value) }))}
                          />
                          
                        </div>)}
                      </div>
                      <div className='flex-1'>
                        <Label htmlFor="defaultMode">Advance Mode</Label>
                        {spareFlag.map((d, i) => <div className='m-3'>
                          <Switch
                            key={i}
                            label={d.name}
                            defaultChecked={false}
                            onChange={(checked: boolean) => setDoorDto(prev => ({ ...prev, spareTags: checked ? prev.spareTags | d.value : prev.spareTags & (~d.value) }))}
                          />
                        </div>)}
                      </div>

                    </div>
                  </div>
                </>

              }
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default DoorForm