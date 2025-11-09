import { NoMacBaseDto } from "../NoMacBaseDto";

export interface HolidayDto extends NoMacBaseDto{
  componentId:number;
  year:number;
  month:number;
  day:number;
  extend:number;
  typeMask:number
}
