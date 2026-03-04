import { BaseDto } from "../BaseDto";
import { NoMacBaseDto } from "../NoMacBaseDto";
import { AccessLevelComponentDto } from "./AccessLevelComponentDto";

export interface CreateUpdateAccessLevelDto extends BaseDto{
    name:string;
    components:AccessLevelComponentDto[];
}