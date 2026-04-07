import { BaseDto } from "../BaseDto";

export interface AreaDto extends BaseDto {
    scpId:number;
    areaId:number;
    multiOccupancy:number;
    accessControl:number;
    occControl:number;
    occSet:number;
    occMax:number;
    occUp:number;
    occDown:number;
    areaFlag:number;
}