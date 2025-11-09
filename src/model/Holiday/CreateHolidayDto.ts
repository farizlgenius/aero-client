import { NoMacBaseDto } from "../NoMacBaseDto";

export interface CreateHolidayDto extends NoMacBaseDto {
  year:number;
  month:number;
  day:number;
  extend:number;
  typeMask:number
}