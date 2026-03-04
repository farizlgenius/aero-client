import { BaseDto } from "../BaseDto";

export interface ControlPointDto extends BaseDto
{
    id:number;
    driverId:number;
    name:string;
    moduleId:number;
    moduleDetail:string;
    outputNo:number;
    relayMode:number;
    relayModeDetail:string;
    offlineMode:number;
    offlineModeDetail:string;
    deviceId:number;
    defaultPulse:number;

}

export const defaultOutputDto: ControlPointDto = {
    // Base
    locationId: 0,
    isActive: true,

    // Detail
    id: 0,
    driverId: 0,
    name: "",
    moduleId: 0,
    moduleDetail: "",
    outputNo: -1,
    relayMode: -1,
    offlineMode: -1,
    defaultPulse: 1,
    relayModeDetail: "",
    offlineModeDetail: "",
    deviceId: 0
}