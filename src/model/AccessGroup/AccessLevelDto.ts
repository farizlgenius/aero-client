import { NoMacBaseDto } from "../NoMacBaseDto";
import { AccessLevelDoorComponentDto } from "./AccessLevelDoorComponentDto";

export interface AccessLevelDto extends NoMacBaseDto {
    name:string;
    componentId:number;
    accessLevelDoorTimeZoneDto:AccessLevelDoorComponentDto[];
}