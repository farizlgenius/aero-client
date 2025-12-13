import { AccessLevelDto } from "../AccessGroup/AccessLevelDto";
import { NoMacBaseDto } from "../NoMacBaseDto";
import { CredentialDto } from "./CredentialDto";
import { ImageFileDto } from "./ImageFileDto";

export interface CardHolderDto extends NoMacBaseDto {
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
    address:string;
    company:string;
    position:string;
    department:string;
    image:ImageFileDto;
    additionals:string[];
    credentials:CredentialDto[];
    accessLevels:AccessLevelDto[];
    flag:number;
}