import { BaseDto } from "../BaseDto";
import { PermissionDto } from "./PermissionDto";

export interface RoleDto extends BaseDto{
    id:number;
    driverId:number;
    name:string;
    permissions:PermissionDto[];
}