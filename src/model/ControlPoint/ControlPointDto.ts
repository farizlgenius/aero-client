import { BaseDto } from "../BaseDto";

export interface ControlPointDto extends BaseDto
{
    name:string;
    moduleId:number;
    moduleDescription:string;
    outputNo:number;
    relayMode:number;
    relayModeDescription:string;
    offlineMode:number;
    offlineModeDescription:string;
    defaultPulse:number;

}

export const defaultOutputDto: ControlPointDto = {
    // Base
    uuid: "",
    componentId: -1,
    macAddress: "",
    locationId: 0,
    isActive: true,

    // Detail
    name: "",
    moduleId: 0,
    moduleDescription:"",
    outputNo: -1,
    relayMode: -1,
    offlineMode: -1,
    defaultPulse: 1,
    relayModeDescription: "",
    offlineModeDescription: "",
    macAddressDescription: ""
}