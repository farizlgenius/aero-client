import { BaseDto } from "../BaseDto";
import { ControlPointDto } from "../ControlPoint/ControlPointDto";
import { MonitorPointDto } from "../MonitorPoint/MonitorPointDto";
import { ReaderDto } from "../Reader/ReaderDto";
import { RequestExitDto } from "../RequestExit/RequestExitDto";
import { SensorDto } from "../Sensor/SensorDto";
import { StrikeDto } from "../Strike/StrikeDto";

export interface ModuleDto extends BaseDto
{
    id:number,
    deviceId:number;
    driverId:number;
    model:number;
    modelDetail:string;
    revision:string;
    serialNumber:string;
    nHardwareId:number;
    nHardwareIdDetail:string;
    nHardwareRev:number;
    nProductId:number;
    nProductVer:number;
    nEncConfig:number;
    nEncConfigDetail:string;
    nEncKeyStatus:number;
    nEncKeyStatusDetail:string;
    readers:ReaderDto[];
    sensors:SensorDto[];
    strikes:StrikeDto[];
    requestExits:RequestExitDto[];
    monitorPoints:MonitorPointDto[];
    controlPointd:ControlPointDto[];
    address:number;
    addressDetail:string;
    port:number;
    nInput:number;
    nOutput:number;
    nReader:number;
    msp1No:number;
    baudRate:number;
    nProtocol:number;
    nDialect:number;
}