import { BaseDto } from "../BaseDto";

export interface ControlPointDto extends BaseDto
{
    name:string;
    moduleId:number;
    outputNo:number;
    relayMode:number;
    offlineMode:number;
    defaultPulse:number;

}

export const defaultOutputDto: ControlPointDto = {

    // Base
    uuid: "",
    componentId: -1,
    macAddress: "",
    locationId: 0,
    locationName: "",
    isActive: true,

    // Detail
    name: "",
    moduleId: 0,
    outputNo: -1,
    relayMode: -1,
    offlineMode: -1,
    defaultPulse: 1
}