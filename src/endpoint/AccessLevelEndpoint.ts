
const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'AccessLevel'


export const AccessLevelEndPoint = {
    GET_ACCESS_LEVEL: (location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    CREATE_ACCESS_LEVLE: `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_ACCESS_LEVEL:(ComponentId:number) => `/api/${API_VERSION}/${CONTROLLER}/${ComponentId}`
} as const;

