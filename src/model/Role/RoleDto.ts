import { BaseDto } from "../BaseDto";
import { FeatureDto } from "./FeatureDto";

export interface RoleDto extends BaseDto{
    id:number;
    driverId:number;
    name:string;
    features:FeatureDto[];
}