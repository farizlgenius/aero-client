import { VerifyHardwareDeviceConfigDto } from "./VerifyHardwareDeviceConfigDto";

export interface ScpConfiguration{
      mac:string;
      locationId:number;
      configurations:VerifyHardwareDeviceConfigDto[];
}