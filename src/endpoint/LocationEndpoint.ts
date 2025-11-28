const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Location`;


export const LocationEndpoint = {
    CREATE_LOC: `/api/${API_VERSION}/${CONTROLLER}`,
    GET_LOC : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE_LOC : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_LOC : `/api/${API_VERSION}/${CONTROLLER}/`,
    POST_GET_LOC_RANGE : `/api/${API_VERSION}/${CONTROLLER}/range`
} as const;