const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Map`;


export const MapEndpoint = {
    GET :(location:number) => `/api/${location}/${CONTROLLER}`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`,
    DELETE :(component:number) => `/api/${CONTROLLER}/${component}`,
    CREATE : `/api/${CONTROLLER}`,
    UPDATE : `/api/${CONTROLLER}`
} as const;
