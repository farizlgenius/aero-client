import { BaseDto } from "../BaseDto";

export interface SensorDto extends BaseDto{
    moduleId:number;
    inputNo:number;
    inputMode:number;
    debounce:number;
    holdTime:number;
    dcHeld:number;
}