export interface HardwareProps {
  onUploadClick:() => void
}

export interface ResetScpDto {
  ScpMac: string
}


export interface FetchScpStatus{
    ScpMac:string
}

export interface IdReport {
  deviceID: number;
  serialNumber: number;
  scpID: number;
  configFlag: number;
  macAddress: string;
  ip: string;
  model: string;
  port:number;
    isReset:boolean;
  isUpload:boolean;
}

export interface ScpDto {
  no: number;
  componentNo: number;
  name: string;
  model: string;
  mac: string;
  ip: string;
  serialNumber: string;
  status: number; // 1 -> online , 0 -> offline
  isReset:boolean;
  isUpload:boolean;
}

export interface StatusDto {
  scpMac: string;
  deviceNumber: number;
  status: number | string;
  tamper: number | string;
  ac: number | string;
  batt: number | string;
}

export interface RemoveScpDto{
    scpMac:string;
}

export interface Option{
  label:string;
  value:string|number;
  description?:string;
  isTaken?:boolean;
}

export interface VerifyScpConfigDto{
  ip:string;
  mac:string;
  recAllocTransaction:number;
  recAllocTimezone:number;
  recAllocHoliday:number;
  recAllocMsp1:number;
  recAllocSio:number;
  recAllocSioPort:number;
  recAllocMp:number;
  recAllocCp:number;
  recAllocAcr:number;
  recAllocAlvl:number;
  recAllocTrig:number;
  recAllocProc:number;
  recAllocMpg:number;
  recAllocArea:number;
  recAllocEal:number;
  recAllocCrdb:number;
  recAllocCardActive:number;
  isReset:boolean;
  isUpload:boolean;
}

export interface AddScpDto {
    componentNo:number;
    name:string;
    model:string;
    mac:string;
    ip:string;
    port:number;
    serialNumber:string
}

export interface CpDto {
  componentNo: number;
  name: string;
  mac: string;
  sioNo: number;
  sioName: string;
  cpNo: number;
  opNo: number;
    relayMode: number,
  offlineMode: number,

  mode: string;
  defaultPulseTime: number;
  status: number;
}

export interface RemoveCpDto {
  scpMac:string;
  cpNo:number;
}

export interface CpTriggerDto {
  scpMac:string;
  cpNo:number;
  command:number;
}

export interface SioDto {
  componentNo: number;
  name: string;
  mac: string;
  sioNo: number;
  sioName:string;
  model: string;
  address: number;
  baudRate: number;
  protocol: number;
  status: number;
  tamper: number;
  acFail: number;
  battFail: number


}

export interface CpModeDto {
  value:number;
  description:string;
}


export interface MpDto {
    componentNo: number;
    name: string;
    mac: string;
    sioNo: number;
    sioName: string;
    ipNo: number;
    modeNo: number;
    mode: string;
    latchingMode: number;
    delayEntry: number;
    delayExit:number;
    status:number;
    isMask:boolean;
    isActive:boolean;
}


export interface AcrRdrModeDto {
  name: string;
  value: number;
  description: string;
}

export interface AcrDto {
  name: string;
  mac: string;
  componentNo:number;
  accessConfig: number;
  pairACRNo: number;

  // Reader setting for Reader In
  rdrSio: number;
  rdrSioName:string;
  rdrNo: number;
  rdrDataFormat: number;
  keyPadMode: number;
  osdpBaudRate: number;
  osdpNoDiscover: number;
  osdpTracing: number;
  osdpAddress: number;
  osdpSecureChannel: number;
  isReaderOsdp: boolean;

  // Output setting for strike
  strkSio: number;
  strkNo: number;
  strkMin: number;
  strkMax: number;
  strkMode: number;
  strkRelayDriveMode: number;
  strkRelayOfflineMode: number;
  relayMode: number;

  // Input setting for sensor
  sensorSio: number;
  sensorNo: number;
  dcHeld: number;
  sensorMode: number;
  sensorDebounce: number;
  sensorHoldTime: number;

  // Input setting for rex0
  isRex0Used: boolean;
  rex0SioNo: number;
  rex0No: number;
  rex0TZ: number;
  rex0SensorMode: number;
  rex0SensorDebounce: number;
  rex0SensorHoldTime: number;

  // Input setting for rex1
  isRex1Used: boolean;
  rex1SioNo: number;
  rex1No: number;
  rex1TZ: number;
  rex1SensorMode: number;
  rex1SensorDebounce: number;
  rex1SensorHoldTime: number;

  // Reader setting for reader out
  isAltRdrUsed: boolean;
  altRdrSioNo: number;
  altRdrNo: number;
  altRdrConfig: number;
  isAltRdrOsdp: boolean;

  altRdrDataFormat: number;
  altKeyPadMode: number;
  altOsdpBaudRate: number;
  altOsdpNoDiscover: number;
  altOsdpTracing: number;
  altOsdpAddress: number;
  altOsdpSecureChannel: number;

  cardFormat: number;
  antiPassbackMode: number;
  antiPassBackIn: number;
  antiPassBackOut: number;
  spareTags: number;
  accessControlFlags: number;
  mode:number;
  modeDesc:string;
  offlineMode: number;
  offlineModeDesc:string;
  defaultMode: number;
  defaultModeDesc:string;
  defaultLEDMode: number;
  preAlarm: number;
  antiPassbackDelay: number;

  // Advance Feature
  strkT2: number;
  dcHeld2: number;
  strkFollowPulse: number;
  strkFollowDelay: number;
  nExtFeatureType: number;
  ilPBSio: number;
  ilPBNumber: number;
  ilPBLongPress: number;
  ilPBOutSio: number;
  ilPBOutNum: number;
  dfOfFilterTime: number;
}

export interface ModeDto {
  description: string;
  value: number;
  name: string;
}

export interface CardHolderDto {
  no:number;
    cardHolderId: number;
    cardHolderReferenceNumber:string;
    title:string;
    name:string;
    sex:string;
    email:string;
    phone:string;
    description:string;
    holderStatus:string;
    issueCodeRunningNumber:number;
}

export interface AccessGroupDto {
  name: string;
  elementNo: number;
}

export interface CreateCredentialDto {
  id: number;
  cardHolderReferenceNumber: string;
  bits: number;
  issueCode: number;
  facilityCode: number;
  cardNumber: number;
  pin: string;
  activeDate: string;
  deactiveDate: string;
  accessLevel: number;
  image: string;
}

export interface CreateCardHolderDto {
  cardHolderId: string;
  cardHolderReferenceNumber: string;
  title: string;
  firstName: string;
  middleName:string;
  lastName:string;
  sex: string;
  email: string;
  phone: string;
  description: string;
  holderStatus: string;
  cards: CreateCredentialDto[]
}

export interface ScanCardDto {
    scpMac:string;
    acrNo:number;
}

export interface RemoveCardHolderDto {
  cardHolderReferenceNumber:string;
}

export interface TimeZoneDto {
    componentNo:number;
    name:string;
    mode:number;
    activeTime:string;
    deactiveTime:string;
    intervals:IntervalDto[];
}

export interface CardFormatDto {
  no:number;
  cardFormatName:string;
  elementNo:number;
  facility:number;
  bits:number;
  peLn:number;
  peLoc:number;
  poLn:number;
  poLoc:number;
  fcLn:number;
  fcLoc:number;
  chLn:number;
  chLoc:number;
  icLn:number;
  icLoc:number;

}

export interface CreateCardFormatDto{
  cardFormatName:string;
  facility:number;
  bits:number;
  peLn:number;
  peLoc:number;
  poLn:number;
  poLoc:number;
  fcLn:number;
  fcLoc:number;
  chLn:number;
  chLoc:number;
  icLn:number;
  icLoc:number;
}

export interface AccessGroupDto{
  no:number;
    name:string;
    elementNo:number;
}

export interface DeleteMpDto{
  componentNo:number;
  mac:string;
}

export interface HolidayDto{
  componentNo:number;
  year:number;
  month:number;
  day:number;
  typeMask:number
}


export interface CreateIntervalDto {
  tzNumber: number;
  intervalNumber: number;
  Days: DaysInWeek;
  iStart: string;
  iEnd: string;
}

export interface IntervalDto {
  componentNo: number;
  days: DaysInWeek;
  daysDesc:string;
  startTime: string;
  endTime: string;
}


export interface DaysInWeek {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean
}

export interface TimeZoneModeDto{
  name:string;
  value:number;
  description:string;
}

export interface AlertContextInterface {
  showAlertFlag:boolean;
  setShowAlertFlag:React.Dispatch<React.SetStateAction<boolean>>;
  alertSuccessFlag:boolean;
  setAlertSuccessFlag:React.Dispatch<React.SetStateAction<boolean>>;
  alertMessage?:string;
  setAlertMessage?:React.Dispatch<React.SetStateAction<string>>;
}

export interface PopupContextInterface {
  showPopupFlag:boolean;
  setShowPopupFlag:React.Dispatch<React.SetStateAction<boolean>>;
  popupSuccessFlag:boolean;
  setPopupSuccessFlag:React.Dispatch<React.SetStateAction<boolean>>;
  popUpMessage:string[];
  setPopUpMessage:React.Dispatch<React.SetStateAction<string[]>>;
};

export interface AlertProps {
  isFixed?:boolean
  variant: "success" | "error" | "warning" | "info"; // Alert type
  title: string; // Title of the alert
  message: string; // Message of the alert
  showLink?: boolean; // Whether to show the "Learn More" link
  linkHref?: string; // Link URL
  linkText?: string; // Link text
  isTop?:boolean
}

export interface TimeZoneFormProp {
  data:TimeZoneDto
  setTimeZoneDto:React.Dispatch<React.SetStateAction<TimeZoneDto>>;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}



export type NestedKeyOf<ObjectType extends object> =
  {
    [Key in keyof ObjectType & (string)]: 
      ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
  }[keyof ObjectType & string];






