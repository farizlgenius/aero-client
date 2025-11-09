import { BaseDto } from "../BaseDto";
import { ControlPointDto } from "../ControlPoint/ControlPointDto";
import { MonitorPointDto } from "../MonitorPoint/MonitorPointDto";
import { ReaderDto } from "../Reader/ReaderDto";
import { RequestExitDto } from "../RequestExit/RequestExitDto";
import { SensorDto } from "../Sensor/SensorDto";
import { StrikeDto } from "../Strike/StrikeDto";

export interface ModuleDto extends BaseDto
{
    model:string;

    readers:ReaderDto[];
    sensors:SensorDto[];
    strikes:StrikeDto[];
    requestExits:RequestExitDto[];
    monitorPoints:MonitorPointDto[];
    controlPointd:ControlPointDto[];

    address:number;
    port:number;
    nInput:number;
    nOutput:number;
    nReader:number;
    msp1No:number;
    baudRate:number;
    nProtocol:number;
    nDialect:number;
}