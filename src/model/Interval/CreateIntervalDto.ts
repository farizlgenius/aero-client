import { NoMacBaseDto } from "../NoMacBaseDto";
import { DaysInWeekDto } from "./DaysInWeekDto";

export interface CreateIntervalDto extends NoMacBaseDto {
    days:DaysInWeekDto;
    daysDesc:string;
    startTime:string;
    endTime:string;
}