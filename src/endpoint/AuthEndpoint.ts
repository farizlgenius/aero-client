
const CONTROLLER = 'Auth'

export const AuthEndpoint = {
    LOGIN:`/api/${CONTROLLER}/login`,
    ME:`/api/${CONTROLLER}/me`,
    REFRESH:`/api/${CONTROLLER}/refresh`,
    LOGOUT:`/api/${CONTROLLER}/logout`
} as const;