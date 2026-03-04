const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = 'License'

export const LicenseEndpoint = {
    CHECK :`/api/${CONTROLLER}`,
    CREATE :`/api/${CONTROLLER}`
} as const