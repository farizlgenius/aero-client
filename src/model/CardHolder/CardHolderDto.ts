import { AccessGroupDto } from "../AccessGroup/AccessGroupDto";
import { NoMacBaseDto } from "../NoMacBaseDto";
import { CredentialDto } from "./CredentialDto";

export interface CardHolderDto extends NoMacBaseDto {
    userId:string;
    title:string;
    firstName:string;
    middleName:string;
    lastName:string;
    sex:string;
    email:string;
    phone:string;
    company:string;
    position:string;
    department:string;
    imagePath:string;
    additionals:string[];
    credentials:CredentialDto[];
    accessLevels:AccessGroupDto[];
}