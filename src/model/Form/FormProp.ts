export enum FormType {
    CREATE ,
    INFO ,
    UPDATE 
}

export interface FormProp<T>{
    type: FormType,
    handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    setDto: React.Dispatch<React.SetStateAction<T>>;
    dto: T
}