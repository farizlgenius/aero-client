const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Hardware`;

export const HardwareEndpoint = {
    GET_SCP_LIST : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_SCP : `/api/${API_VERSION}/${CONTROLLER}/`,
    GET_SCP_STATUS : `/api/${API_VERSION}/${CONTROLLER}/status/`,
    POST_SCP_RESET : `/api/${API_VERSION}/${CONTROLLER}/reset/`,
    POST_SCP_UPLOAD : `/api/${API_VERSION}/${CONTROLLER}/upload/`,
    POST_ADD_SCP : `/api/${API_VERSION}/${CONTROLLER}`
} as const
