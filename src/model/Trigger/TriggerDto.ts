import { BaseDto } from "../BaseDto";

export interface TriggerDto extends BaseDto {
    command:number;
    procedureId:number;
    sourceType:number;
    sourceNumber:number;
    tranType:number;
    codeMap:number;
    timeZone:number;
}