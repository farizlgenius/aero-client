import { NoMacBaseDto } from "../NoMacBaseDto";

export interface CredentialDto extends NoMacBaseDto{
    componentId:number;
    bits:number;
    issueCode:number;
    facilityCode:number;
    cardNo:number;
    pin:string;
    activeDate:string;
    deactiveDate:string;
}