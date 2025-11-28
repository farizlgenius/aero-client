const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Credential`;

export const CredentialEndpoint = {
    POST_SCAN: `/api/${API_VERSION}/${CONTROLLER}/scan`
} as const;