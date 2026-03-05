import { BaseDto } from "../BaseDto";
import { ModuleDto } from "../Module/ModuleDto";

export interface HardwareDto extends BaseDto {
  id:number;
  driverId:number;
  name: string;
  hardwareType: number;
  hardwareTypeDetail:string;
  mac:string;
  ip: string;
  firmware:string;
  port:string;
  modules:ModuleDto[];
  serialNumber: string;
  isUpload: boolean; 
  isReset:boolean;
  portOne:boolean;
  portTwo:boolean;
  protocolOne:number;
  protocolOneDetail:string;
  baudRateOne:number;
  protocolTwo:number;
  protocolTwoDetail:string;
  baudRateTwo:number;
  lastSync:Date;
}