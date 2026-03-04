import { AccessLevelDto } from "../AccessGroup/AccessLevelDto";
import { NoMacBaseDto } from "../NoMacBaseDto";
import { CredentialDto } from "./CredentialDto";

export interface UserDto extends NoMacBaseDto {
    userId:string;
    title:string;
    firstName:string;
    middleName:string;
    lastName:string;
    gender:string;
    email:string;
    phone:string;
    companyId:number;
    company:string;
    positionId:number;
    position:string;
    departmentId:number;
    department:string;
    flag:number;
    additionals:string[];
    credentials:CredentialDto[];
    accessLevels:AccessLevelDto[];
}