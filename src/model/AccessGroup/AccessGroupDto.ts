import { NoMacBaseDto } from "../NoMacBaseDto";
import { AccessLevelDoorTimeZoneDto } from "./AccessLevelDoorTimeZoneDto";

export interface AccessGroupDto extends NoMacBaseDto {
    name:string;
    componentId:number;
    accessLevelDoorTimeZoneDto:AccessLevelDoorTimeZoneDto[];
}