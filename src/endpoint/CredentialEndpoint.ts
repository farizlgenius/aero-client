const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Credential`;

export const CredentialEndpoint = {
    POST_SCAN: `/api/${CONTROLLER}/scan`,
    GET_FLAG: `/api/${CONTROLLER}/flag`
} as const;