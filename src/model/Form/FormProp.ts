export interface FormProp<T>{
    isUpdate?: boolean,
    handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    setDto: React.Dispatch<React.SetStateAction<T>>;
    dto: T
}