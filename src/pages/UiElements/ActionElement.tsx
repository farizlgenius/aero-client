import { PropsWithChildren } from "react";

interface ActionFunctionHandler<T> {
    data:T;
    onEditClick:(data:T)=>void;
    onRemoveClick:(data:T) => void;
    isDetail?:boolean;
}


const ActionElement = <T,>({onEditClick,onRemoveClick,data,isDetail=false}:PropsWithChildren<ActionFunctionHandler<T>>) => {
    return (
         <div className="flex gap-2">
            {isDetail ?
            <a onClick={() => onEditClick(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Detail</a>
            : 
            <a onClick={() => onEditClick(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
            }
            
          
          <a onClick={() => onRemoveClick(data)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
          </div>    
    )
}

export default ActionElement;