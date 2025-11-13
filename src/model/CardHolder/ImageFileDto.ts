export interface ImageFileDto{
    fileName:string;
    contentType:string;
    fileSize:number;
    fileData: Uint8Array | null;
}