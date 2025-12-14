const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'TimeZone'


export const TimeZoneEndPoint = {
    GET_TZ_LIST : `/api/${API_VERSION}/${CONTROLLER}`,
    GET_TZ_BY_ID : `/api/${API_VERSION}/${CONTROLLER}/`,
    DELETE_TZ : `/api/${API_VERSION}/${CONTROLLER}/`,
    POST_ADD_TZ : `/api/${API_VERSION}/${CONTROLLER}`,
    GET_MODE_TZ : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    COMMAND: `/api/${API_VERSION}/${CONTROLLER}/command`
} as const;