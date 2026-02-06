import { AccessLevelDoorComponentDto } from "./AccessLevelDoorComponentDto";

export interface AccessLevelComponentDto{
    mac:string;
    doorComponent:AccessLevelDoorComponentDto[]
}