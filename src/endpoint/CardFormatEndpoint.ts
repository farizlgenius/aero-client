const CONTROLLER = 'CardFormat'
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const CardFormatEndpoint = {
    GET_CARDFORMAT : `/api/${API_VERSION}/${CONTROLLER}`,
    CREATE_CARDFORMAT : `/api/${API_VERSION}/${CONTROLLER}`,
    DELETE_CARDFORMAT : `/api/${API_VERSION}/${CONTROLLER}/`
}
