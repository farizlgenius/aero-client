import { PropsWithChildren } from "react";

interface ActionFunctionHandler {
    data:Object;
    onEditClick:(data:Object)=>void;
    onRemoveClick:(data:Object) => void;
}


const ActionElement:React.FC<PropsWithChildren<ActionFunctionHandler>> = ({onEditClick,onRemoveClick,data}) => {
    return (
         <div className="flex gap-2">
          <a onClick={() => onEditClick(data)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
          <a onClick={() => onRemoveClick(data)} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">Remove</a>
          </div>    
    )
}

export default ActionElement;