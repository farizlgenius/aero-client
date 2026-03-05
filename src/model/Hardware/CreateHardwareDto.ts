import { BaseDto } from "../BaseDto";

export interface CreateHardwareDto extends BaseDto {
    driverId:number;
    name:string;
    hardwareType:number;
    hardwareTypeDetail:string;
    mac:string;
    port:string;
    ip:string;
    firmware:string;
    serialNumber:string;
    portOne:boolean;
    protocolOne:number;
    protocolOneDetail:string;
    baudRateOne:number;
    portTwo:boolean;
    protocolTwo:number;
    protocolTwoDetail:string;
    baudRateTwo:number;
}