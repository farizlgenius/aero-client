import { NoMacBaseDto } from "../NoMacBaseDto";
import { AccessLevelDoorTimeZoneDto } from "./AccessLevelDoorTimeZoneDto";

export interface AccessLevelDto extends NoMacBaseDto {
    name:string;
    componentId:number;
    accessLevelDoorTimeZoneDto:AccessLevelDoorTimeZoneDto[];
}