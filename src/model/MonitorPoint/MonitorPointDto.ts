import { BaseDto } from "../BaseDto";

export interface MonitorPointDto extends BaseDto
{
    name:string;
    moduleId:number;
    moduleDescription:string;
    inputNo:number;
    inputMode:number;
    inputModeDescription:string;
    debouce:number;
    holdTime:number;
    logFunction:number;
    logFunctionDescription:string;
    monitorPointMode:number;
    monitorPointModeDescription:string;
    delayEntry:number;
    delayExit:number;
    isMask:boolean;

}