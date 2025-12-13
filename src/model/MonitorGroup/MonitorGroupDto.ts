import { BaseDto } from "../BaseDto";
import { MonitorGroupListDto } from "./MonitorGroupListDto";

export interface MonitorGroupDto extends BaseDto{
    name:string;
    nMpCount:number;
    nMpList:MonitorGroupListDto[];
}