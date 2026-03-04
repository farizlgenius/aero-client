import { BaseDto } from "../BaseDto";

export interface AreaDto extends BaseDto {
    id:number;
    deviceId:number;
    driverId:number;
    name:string;
    multiOccupancy:number;
    accessControl:number;
    occControl:number;
    occSet:number;
    occMax:number;
    occUp:number;
    occDown:number;
    areaFlag:number;
}