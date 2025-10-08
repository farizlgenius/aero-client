import React, { PropsWithChildren, useState } from 'react'
import { AccessGroupDto, CreateCardHolderDto, CreateCredentialDto,Option } from '../constants/types';
import axios from 'axios';
import { CredentialEndPoin, GET_ACCESS_LEVEL_LIST, HubEndPoint, Sex } from '../constants/constant';
import ScanCard from './ScanCard';
import ComponentCard from '../components/common/ComponentCard';
import Modals from '../pages/UiElements/Modals';
import Button from '../components/ui/button/Button';
import Label from '../components/form/Label';
import Input from '../components/form/input/InputField';
import Radio from '../components/form/input/Radio';
import { EnvelopeIcon } from '../icons';
import DatePicker from '../components/form/date-picker';
import Select from '../components/form/Select';
import ActionElement from '../pages/UiElements/ActionElement';
import TextArea from '../components/form/input/TextArea';
import * as signalR from '@microsoft/signalr';


// Global Variable

const server = import.meta.env.VITE_SERVER_IP;


interface AddCredentialProps {
  onSubmitHandle: () => void
}



const active = "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50";
const inactive = "inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"

const AddCredentialForm: React.FC<PropsWithChildren<AddCredentialProps>> = ({ onSubmitHandle }) => {
  let cardRunningNumber = 1;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string>("Male");
  const [addCardForm, setAddCardForm] = useState<boolean>(false);
  const [accessLevelOption, setAccessLevelOption] = useState<Option[]>([]);
  const [scanCard, setScanCard] = useState<boolean>(false);
  const [createCredentialDto, setCreateCredentialDto] = useState<CreateCredentialDto>({
    id: cardRunningNumber,
    cardHolderReferenceNumber: "",
    bits: 0,
    issueCode: 0,
    facilityCode: 0,
    cardNumber: 0,
    pin: "",
    activeDate: "",
    deactiveDate: "",
    accessLevel: 0,
    image: ""
  });
  const [createCredentialList, setCreateCredentialList] = useState<CreateCredentialDto[]>([]);
  const [createCardHolderDto, setCreateCardHolderDto] = useState<CreateCardHolderDto>({
    cardHolderId: "",
    cardHolderReferenceNumber: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    sex: "",
    email: "",
    phone: "",
    description: "",
    holderStatus: "",
    cards: []
  })

  function generateEmployeeId(): string {
  return `${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

  {/* Start Scan Card */ }
  const handleStartScan = () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(server + HubEndPoint.CREDENTIAL_HUB)
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR event hub");
    });
    connection.on("CardScanStatus", (ScpMac: string, FormatNumber: number, FacilityCode: number, CardHolderId: number, IssueCode: number, FloorNumber: number) => {
      console.log(FormatNumber);
      console.log(FacilityCode);
      console.log(CardHolderId);
      console.log(IssueCode);
      console.log(FloorNumber);
      setCreateCredentialDto({
        id: cardRunningNumber,
        cardHolderReferenceNumber: "",
        bits: 0,
        issueCode: IssueCode,
        facilityCode: FacilityCode,
        cardNumber: CardHolderId,
        pin: "",
        activeDate: "",
        deactiveDate: "",
        accessLevel: -1,
        image: ""
      })
      setScanCard(false);
      connection.stop();
    });

    return () => {
      connection.stop();
    };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateCredentialDto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleChangeCreateCardHolderData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateCardHolderDto((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }


  {/* Tab */ }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.name) {
      case "scanCard":
        setScanCard(true);
        break;
      case "addCard":
        setCreateCredentialList(prev => ([...prev, createCredentialDto]))
        cardRunningNumber++;
        setAddCardForm(false)
        break;
      default:
        break;
    }
  }
  const handleOnTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(Number(e.currentTarget.value));
    if (e.currentTarget.value == "2") {
      fetchAccessLevel();
    }
  }

  const handleOutsideSubmit = () => {
    //formRef.current?.requestSubmit();
    console.log("Yes")
    addCredentials(createCardHolderDto)
  }

  const handleClickCredential = () => {
    setAddCardForm(true);
  }


  const handleSelectChange = (value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.name);
    console.log(value);
    switch (e.target.name) {
      case "accessLevel":
        setCreateCredentialDto((prev) => ({...prev,[e.target.name]:value}))
        break;
      default:
        break;
    }
  }

  const fetchAccessLevel = async () => {
    try {
      const res = await axios.get(GET_ACCESS_LEVEL_LIST);
      console.log(res.data.content)
      res.data.content.map((a: AccessGroupDto) => {
        setAccessLevelOption(prev => ([...prev, {
          value: a.elementNo,
          label: a.name
        }]))
      })
    } catch (e) { console.log(e) }
  }

  {/* handle Table Action */ }
  const handleOnClickEdit = () => {

  }

  const handleOnClickRemove = (data: Object) => {
    console.log(data);
  }


  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    if (value == Sex.M) {
      setCreateCardHolderDto(prev => ({ ...prev, sex: Sex.M }));
    } else {

      setCreateCardHolderDto(prev => ({ ...prev, sex: Sex.F }));
    }
  }

  const addCredentials = async (data: CreateCardHolderDto) => {
    data.cards = createCredentialList;
    try {
      const res = await axios.post(server + CredentialEndPoin.POST_ADD_CREDENTIAL, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(res)
      if (res.status == 201 || res.status == 200) {
        onSubmitHandle()
      }
    } catch (e) {
      console.log(e);
    }
  }

  const toLocalISOWithOffset = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const offsetMinutes = pad(Math.abs(tzOffset) % 60);

    return (
      date.getFullYear() + "-" +
      pad(date.getMonth() + 1) + "-" +
      pad(date.getDate()) + "T" +
      pad(date.getHours()) + ":" +
      pad(date.getMinutes()) + ":" +
      pad(date.getSeconds()) +
      sign + offsetHours + ":" + offsetMinutes
    );
  }

  return (
    <ComponentCard title="Add Credentials">

      {scanCard && <Modals isWide={false} body={<ScanCard onStartScan={handleStartScan} />} closeToggle={() => setScanCard(false)} />}

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex-1 overflow-x-auto pb-2 sm:w-[200px]">
          <nav className="flex w-full flex-row sm:flex-col sm:space-y-2">
            <button value={0} className={activeTab === 0 ? active : inactive} onClick={handleOnTabClick}>
              Personal Information
            </button>
            <button value={1} className={activeTab === 1 ? active : inactive} onClick={handleOnTabClick}>
              Contact Detail
            </button>
            <button value={2} className={activeTab === 2 ? active : inactive} onClick={handleOnTabClick}>
              Credentials
            </button>
            <button value={3} className={activeTab === 3 ? active : inactive} onClick={handleOnTabClick}>
              Image
            </button>
            <Button onClick={handleOutsideSubmit} className="w-50" size="sm">Submit </Button>
          </nav>
        </div>
        <div className='flex-2'>
          <div className="space-y-6 flex justify-center">
            <div className='w-[60%]'>
              {activeTab == 0 &&

                <div className='flex flex-col gap-1'>
                  <div className='flex gap-2'>

                    <div className='flex-9'>
                      <Label htmlFor="cardHolderId">Cardholder ID / Employee ID</Label>
                      <Input name="cardHolderId" type="text" id="cardHolderId" onChange={handleChangeCreateCardHolderData} value={createCardHolderDto.cardHolderId} />
                    </div>
                    <div className='flex-1 flex items-end'>
                      <Button onClick={()=>setCreateCardHolderDto((prev) =>({...prev,cardHolderId:generateEmployeeId()}))}>Auto</Button>
                    </div>
                  </div>



                  <div className='flex-1'>
                    <Label htmlFor="title">Title</Label>
                    <Input name="title" type="text" id="title" onChange={handleChangeCreateCardHolderData} value={createCardHolderDto.title} />
                  </div>
                  <div className='flex-3'>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input name="firstName" type="text" id="firstName" onChange={handleChangeCreateCardHolderData} value={createCardHolderDto.firstName} />
                  </div>
                  <div className='flex-3 hidden'>
                    <Label className='hidden' htmlFor="cardHolderReferenceNumber">Card Holder Reference Number</Label>
                    <Input className='hidden' isReadOnly={true} name="cardHolderReferenceNumber" type="text" id="cardHolderReferenceNumber" onChange={handleChangeCreateCardHolderData} value={createCardHolderDto.cardHolderReferenceNumber} />
                  </div>
                  <div className='flex-3'>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input name="middleName" type="text" id="middleName" onChange={handleChangeCreateCardHolderData} value={createCardHolderDto.middleName} />
                  </div>
                  <div className='flex-3'>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input name="lastName" type="text" id="lastName" onChange={handleChangeCreateCardHolderData} value={createCardHolderDto.lastName} />
                  </div>


                  <div>
                    <Label htmlFor='scpIp'>Sex</Label>
                    <div className="flex justify-around gap-3 pb-3">
                      <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                          id="sex1"
                          name="sex"
                          value="Male"
                          checked={selectedValue === "Male"}
                          onChange={handleRadioChange}
                          label="Male"
                        />
                      </div>

                      <div className="flex flex-col flex-wrap gap-8">
                        <Radio
                          id="sex2"
                          name="sex"
                          value="Female"
                          checked={selectedValue === "Female"}
                          onChange={handleRadioChange}
                          label="Female"
                        />
                      </div>

                    </div>
                  </div>


                </div>
              }

              {activeTab === 1 &&
                <div className='flex flex-col gap-1'>

                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Input
                        name="email"
                        placeholder="info@gmail.com"
                        type="text"
                        className="pl-[62px]"
                        onChange={handleChangeCreateCardHolderData}
                        value={createCardHolderDto.email}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <EnvelopeIcon className="size-6" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      onChange={handleChangeCreateCardHolderData}
                      value={createCardHolderDto.phone}
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <TextArea
                      value={createCardHolderDto.description}
                      onChange={(value) => { setCreateCardHolderDto((prev) => ({ ...prev, description: value })) }}
                      rows={6}
                    />
                  </div>

                </div>
              }

              {activeTab === 2 &&

                <div className='flex flex-col gap-5'>
                  <div className='gap-3'>
                    <div className='flex flex-col gap-1 w-100'>

                      {addCardForm ?
                        <>
                          <div>

                            <Button name="scanCard" onClickWithEvent={handleClick} size='sm'>Scan Card</Button>


                          </div>

                          <div>

                            <div>
                              <Label>Bit number</Label>
                              <Input
                                name="bits"
                                placeholder="26"
                                onChange={handleChange}
                                value={createCredentialDto.bits}
                              />

                            </div>
                            <div className='flex gap-2'>
                              <div className='flex-1'>
                                <Label>Facility Code</Label>
                                <Input
                                  name="facilityCode"
                                  onChange={handleChange}
                                  value={createCredentialDto.facilityCode}
                                />
                              </div>
                              <div className='flex-3'>
                                <Label>Card number</Label>
                                <Input
                                  name="cardNumber"
                                  onChange={handleChange}
                                  value={createCredentialDto.cardNumber}
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Pin</Label>
                              <Input
                                name="pin"
                                onChange={handleChange}
                                value={createCredentialDto.pin}
                              />
                            </div>
                            <div className='flex gap-2'>
                              <div>
                                <DatePicker
                                  id="date-picker1"
                                  label="Activate Date"
                                  placeholder="Select a date"
                                  value={createCredentialDto.activeDate}
                                  onChange={(dates, currentDateString) => {
                                    // Handle your logic
                                    console.log({ dates, currentDateString });
                                    setCreateCredentialDto((prev) => ({ ...prev, activeDate: toLocalISOWithOffset(dates[0]) }));

                                  }}
                                />
                              </div>
                              <div>
                                <DatePicker
                                  id="date-picker2"
                                  label="Deactivate Date"
                                  placeholder="Select a date"
                                  value={createCredentialDto.deactiveDate}
                                  onChange={(dates, currentDateString) => {
                                    // Handle your logic
                                    console.log({ dates, currentDateString });
                                    setCreateCredentialDto((prev) => ({ ...prev, deactiveDate: toLocalISOWithOffset(dates[0]) }));
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Access Level</Label>
                              <Select
                                name="accessLevel"
                                options={accessLevelOption}
                                placeholder="Select Option"
                                onChangeWithEvent={handleSelectChange}
                                className="dark:bg-dark-900"
                                defaultValue={createCredentialDto.accessLevel}
                              />
                            </div>
                            <div className='mt-3'>
                              <Button onClickWithEvent={handleClick} name='addCard' size='sm'>Add Card</Button>
                            </div>

                          </div>

                        </>

                        :

                        <>

                          <div className="flex flex-col gap-4 swim-lane">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                                Credentials
                                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                                  1/10
                                </span>
                              </h3>
                              <a onClick={() => handleClickCredential()} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                            </div>
                          </div>


                          <div className='flex flex-col gap-1'>
                            {/* Card */}
                            {createCredentialList.map((a: CreateCredentialDto, i: number) => (
                              <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                  <div className="flex items-start w-full gap-4">
                                    <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                                      <div className="relative flex items-start">
                                        <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                          Card : {a.cardNumber}
                                        </p>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                                    <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-theme-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                                      Active
                                    </span>
                                    <ActionElement onEditClick={handleOnClickEdit} onRemoveClick={handleOnClickRemove} data={{}} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                        </>
                      }

                    </div>
                  </div>
                </div>
              }


            </div>
          </div >
        </div >

      </div >

    </ComponentCard >
  )
}

export default AddCredentialForm

function uuidv4() {
  throw new Error('Function not implemented.');
}
