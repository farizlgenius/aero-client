import { JSX } from "react";

export interface TableSpecialDisplay<T>{
    key:string;
    content:(data:T,i:number) => JSX.Element;
}