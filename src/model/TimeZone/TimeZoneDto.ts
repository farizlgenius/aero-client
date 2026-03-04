import { BaseDto } from "../BaseDto";
import { IntervalDto } from "../Interval/IntervalDto";

export interface TimeZoneDto extends BaseDto {
    id:number;
    driverId:number;
    name:string;
    mode:number;
    active:string;
    deactive:string;
    intervals:IntervalDto[];
}