export interface TableProp<T> {
    data: T[]
    handleEdit: (data: T) => void
    handleRemove: (data: T) => void
    handleCheck: (data: T, e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCheckAll: (data: T[], e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedObject: T[];
}
