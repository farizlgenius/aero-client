import { NoMacBaseDto } from "../NoMacBaseDto";
import { AccessLevelComponentDto } from "./AccessLevelComponentDto";

export interface CreateUpdateAccessLevelDto extends NoMacBaseDto{
    name:string;
    components:AccessLevelComponentDto[];
}