const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'License'

export const LicenseEndpoint = {
    CHECK :`/api/${API_VERSION}/${CONTROLLER}`,
    CREATE :`/api/${API_VERSION}/${CONTROLLER}`
} as const