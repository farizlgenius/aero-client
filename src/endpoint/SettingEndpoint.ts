const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Setting`;

export const SettingEndpoint = {
    GET_PASSWORD:`/api/${API_VERSION}/${CONTROLLER}/password/rule`,
    UPDATE_PASSWORD:`/api/${API_VERSION}/${CONTROLLER}/password/rule`
} as const;

