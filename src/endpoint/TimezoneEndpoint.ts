const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'TimeZone'


export const TimeZoneEndPoint = {
    GET : `/api/${API_VERSION}/${CONTROLLER}`,
    LOCATION:(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    GET_ID :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    UPDATE: `/api/${API_VERSION}/${CONTROLLER}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    GET_MODE : `/api/${API_VERSION}/${CONTROLLER}/mode`,
    COMMAND: `/api/${API_VERSION}/${CONTROLLER}/command`
} as const;