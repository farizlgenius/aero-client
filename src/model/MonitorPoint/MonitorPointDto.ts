import { BaseDto } from "../BaseDto";

export interface MonitorPointDto extends BaseDto
{
    name:string;
    moduleId:number;
    inputNo:number;
    inputMode:number;
    debouce:number;
    holdTime:number;
    logFunction:number;
    monitorPointMode:number;
    delayEntry:number;
    delayExit:number;
    isMask:boolean;

}