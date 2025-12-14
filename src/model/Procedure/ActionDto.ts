import { BaseDto } from "../BaseDto";

export interface ActionDto extends BaseDto {
    scpId:number;
    actionType:number;
    actionTypeDesc:string;
    arg1:number;
    arg2:number;
    arg3:number;
    arg4:number;
    arg5:number;
    arg6:number;
    arg7:number;
    strArg:string;
    delayTime:number;
}