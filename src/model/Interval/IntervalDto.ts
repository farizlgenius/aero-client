import { NoMacBaseDto } from "../NoMacBaseDto";
import { DaysInWeekDto } from "./DaysInWeekDto";

export interface IntervalDto extends NoMacBaseDto {
  componentId: number;
  days: DaysInWeekDto;
  daysDesc:string;
  startTime: string;
  endTime: string;
}