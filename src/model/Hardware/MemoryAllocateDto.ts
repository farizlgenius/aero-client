export interface MemoryAllocateDto{
    nStrType:number;
    strType:string;
    nRecord:number;
    nRecSize:number;
    nActive:number;
    nSwAlloc:number;
    nSwRecord:number;
    isSync:boolean;
}