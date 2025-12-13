import { BaseDto } from "../BaseDto";
import { ActionDto } from "./ActionDto";

export interface ProcedureDto extends BaseDto {
    name:string;
    Actions:ActionDto[];
}