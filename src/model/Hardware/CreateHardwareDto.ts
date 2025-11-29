import { BaseDto } from "../BaseDto";

export interface CreateHardwareDto extends BaseDto {
    name:string;
    model:string;
    ipAddress:string;
    serialNumber:string;
}