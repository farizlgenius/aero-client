import axios, { AxiosResponse } from "axios";
import { DaysInWeekDto } from "../model/Interval/DaysInWeekDto";
import { ToastMessage } from "../model/ToastMessage";
import { Options } from "../model/Options";
import { HttpCode } from "../enum/Httpcode";

type ToastType = "success" | "error" | 'warning';

class Helper {

    static handlePopupByResCode(res: AxiosResponse<any, any> | null | undefined, showPopup: (isSuccess: boolean, popUpMessage: string[]) => void): boolean {
        if (res) {
            switch (res.data.code) {
                case HttpCode.OK:
                    showPopup(true, [])
                    return true;
                case HttpCode.CREATED:
                    showPopup(true, [])
                    return true;
                case HttpCode.BAD_REQUEST:
                    showPopup(false, res.data.message)
                    return false;
                case HttpCode.INTERNAL_ERROR:
                    showPopup(false, [res.data.detail, res.data.message])
                    return false;
                default:
                    return false;
            }
        } else {
            showPopup(false, [ToastMessage.API_ERROR]);
            return false;
        }
    }

    static handleToastByResCode(res: AxiosResponse<any, any> | null | undefined, message: string, toggleToast: (toastType: ToastType, toastMessage: string) => void): boolean {
        if (res) {
            if(axios.isAxiosError(res)){
                toggleToast("error",res.message)
                return false;
            }
            switch (res.data.code) {
                case HttpCode.OK:
                    toggleToast("success", message)
                    return true;
                case HttpCode.CREATED:
                    toggleToast("success", message)
                    return true;
                case HttpCode.BAD_REQUEST:
                    toggleToast("error", res.data.message)
                    return false;
                case HttpCode.NOT_FOUND:
                    toggleToast("error", res.data.message)
                    return false;
                case HttpCode.INTERNAL_ERROR:
                    toggleToast("error", res.data.message)
                    //showPopup(false,[res.data.detail,res.data.message])
                    return false;
                default:
                    toggleToast("error", "error with code : " + res.data.code)
                    return false;
            }
        } else {
            toggleToast("error", ToastMessage.API_ERROR)
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

    static isDayEmpty(data: DaysInWeekDto): boolean {
        if (data.sunday || data.monday || data.tuesday || data.wednesday || data.thursday || data.friday || data.saturday) {
            return true;
        }
        return false;
    }

    static updateOptionByValue(
        array: Options[],
        value: string | number,
        isTaken: boolean
    ): Options[] {
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

    static fileToBase64(file: File): Promise<string>{
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject("Failed to convert file to Base64");
                }
            };

            reader.onerror = (error) => reject(error);
        });
    };



}

export default Helper;