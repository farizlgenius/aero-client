import { BaseDto } from "../BaseDto";

export interface CardFormatDto extends BaseDto {
    id:number;
    cfmtId:number;
    name: string;
    fac: number;
    offset:number;
    funcId:number;
    flags:number;
    bits: number;
    peLn: number;
    peLoc: number;
    poLn: number;
    poLoc: number;
    fcLn: number;
    fcLoc: number;
    chLn: number;
    chLoc: number;
    icLn: number;
    icLoc: number;
}