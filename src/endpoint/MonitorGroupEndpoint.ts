const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `MonitorGroup`;

export const MonitorGroupEndpoint = {
    GET_MPG :(location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    GET_TYPE: `/api/${API_VERSION}/${CONTROLLER}/type`,
    POST_CREATE: `/api/${API_VERSION}/${CONTROLLER}`,
    POST_COMMAND: `/api/${API_VERSION}/${CONTROLLER}/command`
} as const;