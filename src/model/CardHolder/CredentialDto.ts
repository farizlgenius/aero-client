import { AccessGroupDto } from "../AccessGroup/AccessGroupDto";
import { NoMacBaseDto } from "../NoMacBaseDto";

export interface CredentialDto extends NoMacBaseDto{
    componentId:number;
    bits:number;
    issueCode:number;
    facilityCode:number;
    cardNo:number;
    pin:number;
    activeDate:string;
    deactiveDate:string;
    accessLevels:AccessGroupDto[];
}