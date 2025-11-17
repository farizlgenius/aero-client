import { JSX } from "react";
import { TableSpecialDisplay } from "./TableSpecialDisplay";

export interface TableProp<T> {
    headers?:string[];
    keys?:string[];
    data: T[]
    handleEdit: (data: T) => void
    handleRemove: (data: T) => void
    handleCheck: (data: T, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: T[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: T[];
    optionalComponent?:JSX.Element;
    specialDisplay?:TableSpecialDisplay<T>[];
}
