const CONTROLLER = 'CardFormat'
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const CardFormatEndpoint = {
    GET : `/api/${API_VERSION}/${CONTROLLER}`,
    CREATE : `/api/${API_VERSION}/${CONTROLLER}`,
    UPDATE : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    DELETE_RANGE : `/api/${API_VERSION}/${CONTROLLER}/delete/range`
}
