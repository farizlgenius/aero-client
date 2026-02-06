
const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'AccessLevel'


export const AccessLevelEndPoint = {
    GET: (location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    CREATE: `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`,
    DELETE:(ComponentId:number) => `/api/${API_VERSION}/${CONTROLLER}/${ComponentId}`
} as const;

