import { NoMacBaseDto } from "../NoMacBaseDto";

export interface CardFormatDto extends NoMacBaseDto {
    name: string;
    componentId: number;
    facility: number;
    flags:number;
    offset:number;
    functionId:number;
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