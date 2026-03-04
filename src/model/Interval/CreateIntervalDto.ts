import { NoMacBaseDto } from "../NoMacBaseDto";
import { DaysInWeekDto } from "./DaysInWeekDto";

export interface CreateIntervalDto extends NoMacBaseDto {
    days:DaysInWeekDto;
    daysDetail:string;
    start:string;
    end:string;
}