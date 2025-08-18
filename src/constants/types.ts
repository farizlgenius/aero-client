
export interface ResetScpDto {
  ScpIp: string
}

export interface FetchScpStatus{
    ScpId:number
}

export interface IdReport {
  deviceID: number;
  serialNumber: number;
  scpID: number;
  configFlag: number;
  macAddress: string;
  ip: string;
  model: string;
}

export interface ScpDto {
  no: number;
  scpId: number;
  name: string;
  model: string;
  mac: string;
  ipAddress: string;
  serialNumber: string;
  status: number; // 1 -> online , 0 -> offline
}

export interface StatusDto {
  scpIp: string;
  deviceNumber: number;
  status: number;
  tamper: number;
  ac: number;
  batt: number;
}

export interface RemoveScpDto{
    scpIp:string;
}

export interface Option{
  label:string;
  value:string|number;
}

export interface VerifyScpConfigDto{
  Ip:string,
  Mac:string,
  RecAllocTransaction:number,
  RecAllocTimezone:number,
  RecAllocHoliday:number,
  RecAllocSio:number,
  RecAllocSioPort:number,
  RecAllocMp:number,
  RecAllocCp:number,
  RecAllocAcr:number,
  RecAllocAlvl:number,
  RecAllocTrig:number,
  RecAllocProc:number,
  RecAllocMpg:number,
  RecAllocArea:number,
  RecAllocEal:number,
  RecAllocCrdb:number,
  RecAllocCardActive:number
}