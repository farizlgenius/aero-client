const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Holiday`;


export const HolidayEndpoint = {
    GET_HOL_LIST : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_HOL : `/api/${API_VERSION}/${CONTROLLER}/`,
    POST_HOL : `/api/${API_VERSION}/${CONTROLLER}`,
    PUT_HOL : `/api/${API_VERSION}/${CONTROLLER}`
} as const;
