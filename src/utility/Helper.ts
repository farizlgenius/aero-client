import { AxiosResponse } from "axios";
import { DaysInWeek,Option } from "../constants/types";
import { HttpCode, PopUpMsg } from "../constants/constant";

class Helper {

    static handlePopupByResCode(res: AxiosResponse<any, any> | null | undefined,showPopup:(isSuccess: boolean, popUpMessage: string[]) => void):boolean {
        if (res) {
            switch (res.data.code) {
                case HttpCode.OK:
                    showPopup(true,[])
                    return true;
                case HttpCode.CREATED:
                    showPopup(true,[])
                    return true;
                case HttpCode.BAD_REQUEST:
                    showPopup(false,res.data.message)
                    return false;
                case HttpCode.INTERNAL_ERROR:
                    showPopup(false,[res.data.detail,res.data.message])
                    return false;
                default:
                    return false;
            }
        } else {
            showPopup(false, [PopUpMsg.API_ERROR]);
            return false;
        }
    }

    static isValidTimeRange(start: string, end: string): boolean {
        // Assume format "HH:mm"
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        return startMinutes < endMinutes;
    }

    static isDayEmpty(data: DaysInWeek): boolean {
        if (data.sunday || data.monday || data.tuesday || data.wednesday || data.thursday || data.friday || data.saturday) {
            return true;
        }
        return false;
    }
    
    static updateOptionByValue(
        array: Option[],
        value: string | number,
        isTaken: boolean
    ): Option[] {
        const index = array.findIndex(item => item.value === value);
        if (index === -1) return array; // not found → return original

        const updated = [...array]; // shallow copy
        updated[index] = { ...updated[index], isTaken }; // update only isTaken
        return updated;
    }

    static toCapitalCase(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }



}

export default Helper;