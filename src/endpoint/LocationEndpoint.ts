const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Location`;


export const LocationEndpoint = {
    CREATE: `/api/${API_VERSION}/${CONTROLLER}`,
    GET : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    GET_RANGE : `/api/${API_VERSION}/${CONTROLLER}/range`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;