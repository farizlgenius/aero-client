import { BaseDto } from "../BaseDto";
import { NoMacBaseDto } from "../NoMacBaseDto";
import { AccessLevelComponentDto } from "./AccessLevelComponentDto";

export interface AccessLevelDto extends BaseDto {
    id:number;
    name:string;
    components:AccessLevelComponentDto[];
}