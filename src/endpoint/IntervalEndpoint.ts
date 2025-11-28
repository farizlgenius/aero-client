const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Interval`;

export const IntervalEndpoint = {
    GET_INTERVAL : `/api/${API_VERSION}/${CONTROLLER}` ,
    POST_ADD_INTERVAL : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_INTERVAL : `/api/${API_VERSION}/${CONTROLLER}/`,
    PUT_UPDATE_INTERVAL : `/api/${API_VERSION}/${CONTROLLER}`
} as const;