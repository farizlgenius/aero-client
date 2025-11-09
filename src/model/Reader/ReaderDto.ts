import { BaseDto } from "../BaseDto";

export interface ReaderDto extends BaseDto
{
    moduleId:number;
    readerNo:number;
    dataFormat:number;
    keypadMode:number;
    ledDriveMode:number;
    osdpFlag:boolean;
    osdpBaudrate:number;
    osdpDiscover:number;
    osdpTracing:number;
    osdpAddress:number;
    osdpSecureChannel:number;
}