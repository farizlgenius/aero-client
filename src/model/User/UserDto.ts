import { Gender } from "../../enum/Gender";
import { AccessLevelDto } from "../AccessGroup/AccessLevelDto";
import { BaseDto } from "../BaseDto";
import { CredentialDto } from "./CredentialDto";

export interface UserDto extends BaseDto {
    userId:string;
    identification:string;
    title:string;
    firstName:string;
    middleName:string;
    lastName:string;
    gender:string;
    dateOfBirth:string;
    email:string;
    phone:string;
    companyId:number;
    company:string;
    positionId:number;
    position:string;
    image:string;
    departmentId:number;
    department:string;
    address:string;
    flag:number;
    additionals:string[];
    credentials:CredentialDto[];
    accessLevels:AccessLevelDto[];
}