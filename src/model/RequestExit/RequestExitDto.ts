import { BaseDto } from "../BaseDto";

export interface RequestExitDto extends BaseDto{
    moduleId:number;
    inputNo:number;
    inputMode:number;
    debounce:number;
    holdTime:number;
    maskTimeZone:number;
}