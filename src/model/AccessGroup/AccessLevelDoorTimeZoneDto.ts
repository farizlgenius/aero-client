import { DoorDto } from "../Door/DoorDto";
import { TimeZoneDto } from "../TimeZone/TimeZoneDto";

export interface AccessLevelDoorTimeZoneDto{
    doors:DoorDto;
    timeZone:TimeZoneDto;
}