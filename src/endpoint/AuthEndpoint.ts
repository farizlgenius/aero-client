
const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'Auth'

export const AuthEndpoint = {
    LOGIN:`/api/${API_VERSION}/${CONTROLLER}/login`,
    ME:`/api/${API_VERSION}/${CONTROLLER}/me`,
    REFRESH:`/api/${API_VERSION}/${CONTROLLER}/refresh`,
    LOGOUT:`/api/${API_VERSION}/${CONTROLLER}/logout`
} as const;