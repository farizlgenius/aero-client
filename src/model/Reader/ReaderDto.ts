

export interface ReaderDto 
{
    scpId:number;
    moduleId:number;
    moduleDriverId:number;
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
    locationId:number;
    isActive:boolean;
}