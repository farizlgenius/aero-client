import { PropsWithChildren } from "react";

interface ActionFunctionHandler<T> {
    data:T;
    onEditClick:(data:T)=>void;
    onRemoveClick:(data:T) => void;
    isDetail?:boolean;
    RemoveOnly?:boolean
}


const ActionElement = <T,>({onEditClick,onRemoveClick,data,RemoveOnly=false}:PropsWithChildren<ActionFunctionHandler<T>>) => {
    return (
         <div className="flex gap-2">
            {!RemoveOnly &&
            <a id="detail" onClick={() => onEditClick(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Detail</a>
            } 
          <a id="remove" onClick={() => onRemoveClick(data)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
          </div>    
    )
}

export default ActionElement;