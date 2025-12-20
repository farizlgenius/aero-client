const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Interval`;

export const IntervalEndpoint = {
    GET : `/api/${API_VERSION}/${CONTROLLER}` ,
    LOCATION: (location:number) => `/api/${API_VERSION}/${location}/${CONTROLLER}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_RANGE:`/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;