export interface IdReport {
  deviceId: number;
  serialNumber: number;
  scpId: number;
  configFlag: number;
  macAddress: string;
  ip: string;
  model: string;
  port:number;
  isReset:boolean;
  isUpload:boolean;
}
