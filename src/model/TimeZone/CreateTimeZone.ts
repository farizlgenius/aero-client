import { IntervalDto } from "../Interval/IntervalDto";
import { NoMacBaseDto } from "../NoMacBaseDto";

export interface CreateTimeZoneDto extends NoMacBaseDto {
    name: string;
    mode: number;
    activeTime: string;
    deactiveTime: string;
    intervals: IntervalDto[];
}