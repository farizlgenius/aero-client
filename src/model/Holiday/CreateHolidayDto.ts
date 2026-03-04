import { BaseDto } from "../BaseDto";


export interface CreateHolidayDto extends BaseDto {
  driverId:number;
  name:string;
  year:number;
  month:number;
  day:number;
  extend:number;
  typeMask:number
}