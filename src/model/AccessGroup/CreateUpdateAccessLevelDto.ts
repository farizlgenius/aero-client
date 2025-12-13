import { NoMacBaseDto } from "../NoMacBaseDto";
import { CreateUpdateAccessLevelDoorTimezone } from "./CreateUpdateAccessLevelDoorTimezone";

export interface CreateUpdateAccessLevelDto extends NoMacBaseDto{
    name:string;
    componentId:number;
    createUpdateAccessLevelDoorTimeZoneDto:CreateUpdateAccessLevelDoorTimezone[];
}