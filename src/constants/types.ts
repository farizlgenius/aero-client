
// Hardware Interface

export interface HardwareProps {
  onUploadClick:() => void
}

export interface ResetScpDto {
  ScpMac: string
}


export interface FetchScpStatus{
    ScpMac:string
}



export interface RemoveScpDto{
    scpMac:string;
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





export interface RemoveCardHolderDto {
  cardHolderReferenceNumber:string;
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




export type NestedKeyOf<ObjectType extends object> =
  {
    [Key in keyof ObjectType & (string)]: 
      ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
  }[keyof ObjectType & string];






