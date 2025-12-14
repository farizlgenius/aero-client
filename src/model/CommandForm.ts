import { Options } from "./Options";
import { ActionDto } from "./Procedure/ActionDto";

export interface CommandFormInterface {
    options:Options[];
    action:ActionDto;
    setAction:React.Dispatch<React.SetStateAction<ActionDto>>;
    handleClickIn: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
