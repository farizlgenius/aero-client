import { NoMacBaseDto } from "../NoMacBaseDto";
import { AccessLevelComponentDto } from "./AccessLevelComponentDto";

export interface AccessLevelDto extends NoMacBaseDto {
    name:string;
    components:AccessLevelComponentDto[];
}