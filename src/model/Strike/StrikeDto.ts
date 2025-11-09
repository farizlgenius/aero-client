import { BaseDto } from "../BaseDto";

export interface StrikeDto extends BaseDto{
    moduleId:number;
    outputNo:number;
    relayMode:number;
    offlineMode:number;
    strkMax:number;
    strkMin:number;
    strkMode:number;
}