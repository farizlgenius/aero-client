import { BaseDto } from "../BaseDto";
import { ModuleDto } from "../Module/ModuleDto";

export interface HardwareDto extends BaseDto {
  name: string;
  hardwareType: number;
  hardwareTypeDescription:string;
  ip: string;
  firmware:string;
  port:string;
  serialNumber: string;
  isUpload: boolean; 
  isReset:boolean;
  modules:ModuleDto[];
  portOne:boolean;
  portTwo:boolean;
  protocolOne:number;
  protocolOneDescription:string;
  baudRateOne:number;
  protocolTwo:number;
  protocolTwoDescription:string;
  baudRateTwo:number;
}