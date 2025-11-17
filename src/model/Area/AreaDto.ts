import { NoMacBaseDto } from "../NoMacBaseDto";

export interface AreaDto extends NoMacBaseDto {
    name:string;
    componentId:number;
    multiOccupancy:number;
    accessControl:number;
    occControl:number;
    occSet:number;
    occMax:number;
    occUp:number;
    occDown:number;
    areaFlag:number;
}