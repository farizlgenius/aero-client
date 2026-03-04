import { BaseDto } from "../BaseDto";
import { DaysInWeekDto } from "./DaysInWeekDto";

export interface IntervalDto extends BaseDto {
  id: number;
  days: DaysInWeekDto;
  daysDetail:string;
  start: string;
  end: string;
}