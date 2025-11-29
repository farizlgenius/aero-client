import React, { JSX } from "react";
import { TableSpecialDisplay } from "./TableSpecialDisplay";
import { FeatureDto } from "./Role/FeatureDto";
import { ActionButton } from "./ActionButton";
import { StatusDto } from "./StatusDto";

export interface TableProp<T> {
    headers?:string[];
    keys?:string[];
    data: T[]
    handleEdit: (data: T) => void
    handleRemove: (data: T) => void
    handleCheck: (data: T, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: T[], e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClick:(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    selectedObject: T[];
    renderOptionalComponent?:(data: any, statusDto: StatusDto[]) => JSX.Element[];
    specialDisplay?:TableSpecialDisplay<T>[];
    permission?:FeatureDto;
    status?:StatusDto[];
    action?:ActionButton[];
}
