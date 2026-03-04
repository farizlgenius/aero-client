import { BaseDto } from "../BaseDto";

export interface HolidayDto extends BaseDto{
  id:number;
  driverId:number;
  name:string;
  year:number;
  month:number;
  day:number;
  extend:number;
  typeMask:number
}
