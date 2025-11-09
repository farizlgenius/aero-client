import { BaseDto } from "../BaseDto";
import { ModuleDto } from "../Module/ModuleDto";

export interface HardwareDto extends BaseDto {
  name: string;
  model: string;
  ipAddress: string;
  modules:ModuleDto[];
  serialNumber: string;
  isUpload: boolean; 
  isReset:boolean;
}