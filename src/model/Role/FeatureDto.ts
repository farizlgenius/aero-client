import { SubFeatureDto } from "./SubFeatureDto";

export interface FeatureDto{
    id:number;
    name:string;
    path:string;
    subItem:SubFeatureDto[];
    isCreate:boolean;
    isAllow:boolean;
    isModify:boolean;
    isDelete:boolean;
    isAction:boolean;
} 