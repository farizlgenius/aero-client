import { IntervalDto } from "../Interval/IntervalDto";
import { NoMacBaseDto } from "../NoMacBaseDto";

export interface TimeZoneDto extends NoMacBaseDto {
    componentId:number;
    name:string;
    mode:number;
    activeTime:string;
    deactiveTime:string;
    intervals:IntervalDto[];
}