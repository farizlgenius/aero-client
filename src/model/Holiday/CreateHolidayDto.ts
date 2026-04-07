import { BaseDto } from "../BaseDto";


export interface CreateHolidayDto extends BaseDto {
  holId:number;
  name:string;
  year:number;
  month:number;
  day:number;
  extend:number;
  typeMask:number
}