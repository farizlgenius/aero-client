import { FeatureDto } from "./FeatureDto";

export interface RoleDto{
    componentId:number;
    name:string;
    features:FeatureDto[];
}