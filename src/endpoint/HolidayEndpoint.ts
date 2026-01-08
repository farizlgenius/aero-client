const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Holiday`;


export const HolidayEndpoint = {
    GET :(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`
} as const;
