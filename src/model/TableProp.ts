import React, { JSX } from "react";
import { TableSpecialDisplay } from "./TableSpecialDisplay";
import { FeatureDto } from "./Role/FeatureDto";
import { ActionButton } from "./ActionButton";
import { StatusDto } from "./StatusDto";

export interface TableProp<T> {
    headers?:string[];
    keys?:string[];
    data: T[]
    onInfo:(data:T) => void;
    onEdit: (data: T) => void
    onRemove: (data: T) => void
    onClick:(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    select:T[];
    setSelect:React.Dispatch<React.SetStateAction<T[]>>
    renderOptionalComponent?:(data: any, statusDto: StatusDto[],index:number) => JSX.Element[];
    specialDisplay?:TableSpecialDisplay<T>[];
    permission?:FeatureDto;
    status?:StatusDto[];
    action?:ActionButton[];
    subTable?:(index:number) => JSX.Element;
    fetchData:(pageNumber: number, pageSize: number,locationId?:number,search?: string | undefined, startDate?: string | undefined, endDate?: string | undefined) => Promise<void>
    refresh?:boolean;
    locationId:number;
}
