import { NoMacBaseDto } from "../NoMacBaseDto";
import { CreateUpdateAccessGroupDoorTimezone } from "./CreateUpdateAccessGroupDoorTimezone";

export interface CreateUpdateAccessGroupDto extends NoMacBaseDto{
    name:string;
    componentId:number;
    createUpdateAccessLevelDoorTimeZoneDto:CreateUpdateAccessGroupDoorTimezone[];
}