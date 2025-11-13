import React, { PropsWithChildren, useEffect, useState } from 'react'
import ComponentCard from '../../components/common/ComponentCard';
import Modals from '../UiElements/Modals';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Radio from '../../components/form/input/Radio';
import { CamIcon, EnvelopeIcon, FileIcon } from '../../icons';
import DatePicker from '../../components/form/date-picker';
import Select from '../../components/form/Select';
import ActionElement from '../UiElements/ActionElement';
import TextArea from '../../components/form/input/TextArea';
import { Options } from '../../model/Options';
import ScanCardModal from '../UiElements/ScanCardModal';
import { CardHolderDto } from '../../model/CardHolder/CardHolderDto';
import { FormProp } from '../../model/FormProp';
import { CredentialDto } from '../../model/CardHolder/CredentialDto';
import { AccessGroupDto } from '../../model/AccessGroup/AccessGroupDto';
import SignalRService from '../../services/SignalRService';
import HttpRequest from '../../utility/HttpRequest';
import { HttpMethod } from '../../enum/HttpMethod';
import { AccessLevelEndPoint } from '../../constants/constant';
import { Sex } from '../../enum/Sex';
import Switch from '../../components/form/switch/Switch';
import { ModeDto } from '../../model/ModeDto';
import DropzoneComponent from '../../components/form/form-elements/DropZone';


enum formTab {
  Info, AccessLevel, Credentials, UserSetting
}



const active = "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50";
const inactive = "inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"

const CardHolderForm: React.FC<PropsWithChildren<FormProp<CardHolderDto>>> = ({ handleClickWithEvent, setDto, dto }) => {

  var defaultCredential: CredentialDto = {
    componentId: 0,
    bits: 0,
    issueCode: 0,
    facilityCode: -1,
    cardNo: 0,
    pin: 0,
    activeDate: new Date().toISOString(),
    deactiveDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString(),
    accessLevels: [],
    uuid: '',
    locationId: 1,
    locationName: 'Main Location',
    isActive: true
  }

  var defaultAccessLevel: AccessGroupDto = {
    name: '',
    componentId: -1,
    accessLevelDoorTimeZoneDto: [],
    uuid: '',
    locationId: 1,
    locationName: 'Main Location',
    isActive: true
  }


  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string>(Sex.M);
  const [addCardForm, setAddCardForm] = useState<boolean>(false);
  const [addAccessLeveForm, setAddAccessLeveForm] = useState<boolean>(false);
  const [accessLevelOption, setAccessLevelOption] = useState<Options[]>([]);
  const [scanCard, setScanCard] = useState<boolean>(false);
  const [credentialDto, setCredentialDto] = useState<CredentialDto>(defaultCredential);
  const [accessGroupDto, setAccessGroupDto] = useState<AccessGroupDto>(defaultAccessLevel);
  const [userFlag,setUserFlag] = useState<ModeDto[]>([])
  const [file,setFile] = useState<boolean>(false);
  const [cam,setCam] = useState<boolean>(false);


  function generateEmployeeId(): string {
    console.log("123")
    return `${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  {/* Start Scan Card */ }
  const handleStartScan = () => {
    var connection = SignalRService.getConnection();

    connection.on("CardScanStatus", (ScpMac: string, FormatNumber: number, FacilityCode: number, CardHolderId: number, IssueCode: number, FloorNumber: number) => {
      console.log(FormatNumber);
      console.log(FacilityCode);
      console.log(CardHolderId);
      console.log(IssueCode);
      console.log(FloorNumber);
      setCredentialDto(prev => ({
        ...prev,
        issueCode: IssueCode,
        facilityCode: FacilityCode,
        cardNo: CardHolderId,
      }))
      setScanCard(false);
    });

    return () => {
      //SignalRService.stopConnection()
    };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name)
    setDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
    switch (e.target.name) {

    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch (e.currentTarget.name) {
      case "addCard":
        setDto(prev => ({ ...prev, credentials: [...prev.credentials, credentialDto] }))
        setCredentialDto(defaultCredential)

        setAddCardForm(false);
        break;
      case "cancleCard":
        setCredentialDto(defaultCredential)
        setAddCardForm(false);
        break;
      case "addAvl":
        setDto(prev => ({ ...prev, accessLevels: [...prev.accessLevels, accessGroupDto] }))
        setAccessGroupDto(defaultAccessLevel)
        setAddAccessLeveForm(false)
        break;
      case "cancleAvl":
        setAccessGroupDto(defaultAccessLevel);
        setAddAccessLeveForm(false)
        break;
      case "file":
        setFile(true)
        break;
        case "cam":
          setCam(true)
          break;
      case 'close':
        setCam(false)
        setFile(false)
        break;
    }
  }

  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentialDto(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }


  const handleOnTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(Number(e.currentTarget.value));
    if (e.currentTarget.value == "2") {
      fetchAccessLevel();
    }
  }


  const handleClickCredential = () => {
    setAddCardForm(true);
  }

  const handleClickAccessLevel = () => {
    setAddAccessLeveForm(true);
  }



  const fetchAccessLevel = async () => {
    const res = await HttpRequest.send(HttpMethod.GET, AccessLevelEndPoint.GET_ACCESS_LEVEL)
    if (res && res.data.data) {
      res.data.data.map((a: AccessGroupDto) => {
        setAccessLevelOption(prev => ([...prev, {
          label: a.name,
          value: a.componentId,
          isTaken: false
        }]))
      })

    }
  }

  {/* handle Table Action */ }
  const handleOnClickEdit = () => {

  }

  const handleOnClickRemove = (data: Object) => {
    console.log(data);
  }


  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    setDto(prev => ({ ...prev, sex: value }))
  }

  const fetchUserFlag = () => {

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

  useEffect(() => {
    fetchUserFlag();
  },[])

  return (
    <ComponentCard title="Create CardHolder">

      {cam && <Modals isWide={false} handleClickWithEvent={handleClick} />}

      {file && <Modals isWide={false} body={ <DropzoneComponent />} handleClickWithEvent={handleClick} />}

      {scanCard && <Modals isWide={false} body={<ScanCardModal onStartScan={handleStartScan} />} handleClickWithEvent={handleClickWithEvent} />}

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex-1 overflow-x-auto pb-2 sm:w-[200px]">
          <nav className="flex w-full flex-row sm:flex-col sm:space-y-2">
            <button value={formTab.Info} className={activeTab === formTab.Info ? active : inactive} onClick={handleOnTabClick}>
              Personal Information
            </button>
            <button value={formTab.AccessLevel} className={activeTab === formTab.AccessLevel ? active : inactive} onClick={handleOnTabClick}>
              Access Level
            </button>
            <button value={formTab.Credentials} className={activeTab === formTab.Credentials ? active : inactive} onClick={handleOnTabClick}>
              Credentials
            </button>
            <button value={formTab.UserSetting} className={activeTab === formTab.UserSetting ? active : inactive} onClick={handleOnTabClick}>
              Setting
            </button>
          </nav>
        </div>
        <div className='flex-3'>
          <div className="space-y-6 flex justify-center">
            <div className='w-[60%]'>
              {activeTab == formTab.Info &&
                <div className='flex flex-col gap-4'>
                  <Label>User Image</Label>
                  {/* Image */}
                  <div className="flex flex-col gap-5 justify-center items-center p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="cursor-pointer w-50 h-50 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                      <img src="/images/user/default.jpg" alt="user" />
                    </div>
                    <div className='flex gap-5'>
                      <Button name='file' onClickWithEvent={handleClick} startIcon={<FileIcon/>}>Browse</Button>
                      <Button name='cam' onClickWithEvent={handleClick} startIcon={<CamIcon/>}>Take Picture</Button>
                    </div>
                  </div>
                  {/* Personal Information */}
                  <Label>Personal Information</Label>
                  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className='flex gap-2 mb-3'>
                      <div className='flex-5'>
                        <Label htmlFor="userId">Cardholder ID / Employee ID</Label>
                        <Input name="userId" type="text" id="cardHolderId" onChange={handleChange} value={dto.userId} />
                      </div>
                      <div className='flex-1 flex items-end'>
                        <Button onClick={() => setDto((prev) => ({ ...prev, userId: generateEmployeeId() }))}>Auto</Button>
                      </div>
                    </div>
                    <div className='flex gap-2 mb-3'>
                      <div className='flex-1'>
                        <Label>Identification ( ID Card | Passport )</Label>
                        <Input type='text' name='identification' onChange={handleChange} value={dto.identification} />
                      </div>

                    </div>
                    <div className='flex gap-2 mb-3'>
                      <div className='flex-1'>
                        <Label htmlFor="title">Title</Label>
                        <Input name="title" type='text' id="title" onChange={handleChange} value={dto.title} />
                      </div>
                      <div className='flex-3'>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input name="firstName" type="text" id="firstName" onChange={handleChange} value={dto.firstName} />
                      </div>
                    </div>
                    <div className='flex gap-2 mb-3'>
                      <div className='flex-1'>
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input name="middleName" type="text" id="middleName" onChange={handleChange} value={dto.middleName} />
                      </div>
                      <div className='flex-1'>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input name="lastName" type="text" id="lastName" onChange={handleChange} value={dto.lastName} />
                      </div>
                    </div>
                    <div className='flex gap-2 mb-3'>
                      <div className='flex-1'>
                        <Label htmlFor='gender'>Gender</Label>
                        <div className="flex justify-around gap-3 pb-3">
                          <div className="flex flex-col flex-wrap gap-8">
                            <Radio
                              id="gender1"
                              name="gender"
                              value="Male"
                              checked={selectedValue === "Male"}
                              onChange={handleRadioChange}
                              label="Male"
                            />
                          </div>

                          <div className="flex flex-col flex-wrap gap-8">
                            <Radio
                              id="gender2"
                              name="gender"
                              value="Female"
                              checked={selectedValue === "Female"}
                              onChange={handleRadioChange}
                              label="Female"
                            />
                          </div>


                        </div>

                      </div>
                      <div className='flex-1'>
                        <DatePicker
                          isTime={false}
                          id="Date"
                          label="Date of birth"
                          placeholder="Select a date"
                          onChange={(date) => setDto((prev) => ({ ...prev, dateOfBirth: date[0].toISOString() }))}
                        />
                      </div>
                    </div>

                    <div className='flex gap-2 mb-3'>
                      <div className='flex-1'>
                        <Label>Email</Label>
                        <div className="relative">
                          <Input
                            name="email"
                            placeholder="info@gmail.com"
                            type="text"
                            className="pl-[62px]"
                            onChange={handleChange}
                            value={dto.email}
                          />
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                            <EnvelopeIcon className="size-6" />
                          </span>
                        </div>
                      </div>
                      <div className='flex-1'>
                        <Label>Phone</Label>
                        <Input
                          onChange={handleChange}
                          value={dto.phone}
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <TextArea value={dto.address} onChange={(e:string) => setDto(prev => ({...prev,address:e}))} />
                    </div>
                  </div>
                  <Label>Company Information</Label>
                  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

                    <div className='flex gap-2 mb-3'>
                      <div className='flex-1'>
                        <Label>Company</Label>
                        <Input
                          onChange={handleChange}
                          value={dto.company}
                          name="company"
                          placeholder="Company Co.,Ltd."
                        />
                      </div>

                    </div>
                    <div className='flex gap-2 mb-3'>
                                          <div className='flex-1'>
                      <Label>Position</Label>
                      <Input
                        onChange={handleChange}
                        value={dto.position}
                        name="position"
                        placeholder="Engineer"
                      />
                    </div>
                    </div>

                    <div className='flex gap-2 mb-3'>
                                          <div className='flex-1'>
                      <Label>Department</Label>
                      <Input
                        onChange={handleChange}
                        value={dto.department}
                        name="department"
                        placeholder="Engineering Department"
                      />
                    </div>
                    </div>
                  </div>
                </div>
              }

              {activeTab === formTab.AccessLevel &&
                <div className='flex flex-col gap-5'>
                  <div className='gap-3'>
                    <div className='flex flex-col gap-1 w-100'>

                      {addAccessLeveForm ?
                        <>
                          <div>
                            <div>
                              <Label>Access Group</Label>
                              <Select
                                isString={false}
                                name="accessLevel"
                                options={accessLevelOption}
                                placeholder="Select Option"
                                onChangeWithEvent={(value: string, e: React.ChangeEvent<HTMLSelectElement>) => setAccessGroupDto(prev => ({ ...prev, componentId: Number(value), name: accessLevelOption.find(x => x.value == Number(value))?.label ?? "" }))}
                                className="dark:bg-dark-900"
                                defaultValue={accessGroupDto.componentId}
                              />
                            </div>
                            <div className='flex gap-4 justify-center mt-5'>
                              <Button name='addAvl' onClickWithEvent={handleClick} size='sm'>Add</Button>
                              <Button name='cancleAvl' onClickWithEvent={handleClick} size='sm' variant='danger'>Cancle</Button>
                            </div>

                          </div>

                        </>

                        :

                        <>

                          <div className="flex flex-col gap-4 swim-lane">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                                Access Groups
                                <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                                  {dto.accessLevels.length}/32
                                </span>
                              </h3>
                              <a onClick={() => handleClickAccessLevel()} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Add</a>
                            </div>
                          </div>


                          <div className='flex flex-col gap-1'>
                            {/* Card */}
                            {dto.accessLevels.map((a: AccessGroupDto, i: number) => (
                              <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                  <div className="flex items-start w-full gap-4">
                                    <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                                      <div className="relative flex items-start">
                                        <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                          Access Level : {a.name}
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

              {activeTab === formTab.Credentials &&

                <div className='flex flex-col gap-5'>
                  <div className='gap-3'>
                    <div className='flex flex-col gap-1 w-100'>

                      {addCardForm ?
                        <>
                          <div>
                            <Button name="scanCard" onClick={() => setScanCard(true)} size='sm'>Scan Card</Button>
                          </div>
                          <div>

                            <div>
                              <Label>Bit number</Label>
                              <Input
                                name="bits"
                                placeholder="26"
                                onChange={handleCredentialChange}
                                value={credentialDto.bits}
                              />

                            </div>
                            <div className='flex gap-2'>
                              <div className='flex-1'>
                                <Label>Facility Code</Label>
                                <Input
                                  name="facilityCode"
                                  onChange={handleCredentialChange}
                                  value={credentialDto.facilityCode}
                                />
                              </div>
                              <div className='flex-3'>
                                <Label>Card number</Label>
                                <Input
                                  name="cardNo"
                                  onChange={handleCredentialChange}
                                  value={credentialDto.cardNo}
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Pin</Label>
                              <Input
                                name="pin"
                                onChange={handleCredentialChange}
                                value={credentialDto.pin}
                              />
                            </div>
                            <div className='flex gap-2'>
                              <div>
                                <DatePicker
                                  id="date-picker1"
                                  label="Activate Date"
                                  placeholder="Select a date"
                                  value={credentialDto.activeDate}
                                  onChange={(dates, currentDateString) => {
                                    // Handle your logic
                                    console.log({ dates, currentDateString });
                                    setCredentialDto(prev => ({ ...prev, activeDate: toLocalISOWithOffset(dates[0]) }));

                                  }}
                                />
                              </div>
                              <div>
                                <DatePicker
                                  id="date-picker2"
                                  label="Deactivate Date"
                                  placeholder="Select a date"
                                  value={credentialDto.deactiveDate}
                                  onChange={(dates, currentDateString) => {
                                    // Handle your logic
                                    console.log({ dates, currentDateString });
                                    setCredentialDto(prev => ({ ...prev, deactiveDate: toLocalISOWithOffset(dates[0]) }));
                                  }}
                                />
                              </div>
                            </div>

                            <div className='flex gap-4 justify-center mt-5'>
                              <Button name='addCard' onClickWithEvent={handleClick} size='sm'>Add Card</Button>
                              <Button name='cancleCard' onClickWithEvent={handleClick} size='sm' variant='danger'>Cancle</Button>
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
                            {dto.credentials.map((a: CredentialDto, i: number) => (
                              <div key={i} className="p-3 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                  <div className="flex items-start w-full gap-4">
                                    <label htmlFor="taskCheckbox1" className="w-full cursor-pointer">
                                      <div className="relative flex items-start">
                                        <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                          Card : {a.cardNo}
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
              {activeTab == formTab.UserSetting &&
                <>
                  <Label>User Settings</Label>
                  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                  {userFlag.map((d, i) => <div className='m-3'>
                    <Switch
                      key={i}
                      label={d.name}
                      defaultChecked={false}
                      onChange={(checked: boolean) => setDto(prev => ({ ...prev, flag: checked ? prev.flag | d.value : prev.flag & (~d.value) }))}
                    />
                  </div>)}
                  </div>
                  <div className='flex m-5 gap-5 justify-center items-center'>
                    <Button name='create' onClickWithEvent={handleClickWithEvent} className="w-50" size="sm">Create</Button>
                    <Button name='cancle' onClickWithEvent={handleClickWithEvent} className="w-50" size="sm" variant='danger'>Cancle</Button>
                  </div>
                </>


              }




            </div>
          </div >
        </div >

      </div >

    </ComponentCard >
  )
}

export default CardHolderForm

