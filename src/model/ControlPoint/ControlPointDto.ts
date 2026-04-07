import { BaseDto } from "../BaseDto";

export interface ControlPointDto extends BaseDto
{
    id:number;
    cpId:number;
    name:string;
    moduleId:number;
    moduleDriverId:number;
    moduleDetail:string;
    outputNo:number;
    relayMode:number;
    relayModeDetail:string;
    offlineMode:number;
    offlineModeDetail:string;
    scpId:number;
    defaultPulse:number;

}

