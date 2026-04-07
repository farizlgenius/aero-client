const CONTROLLER = `Setting`;

export const SettingEndpoint = {
    GET_PASSWORD:`/api/${CONTROLLER}/password/rule`,
    UPDATE_PASSWORD:`/api/${CONTROLLER}/password/rule`,
    GET_LED : `/api/${CONTROLLER}/led`,
    GET_BY_ID:(id:number) => `/api/${CONTROLLER}/led/${id}`,
    UPDATE_LED: `/api/${CONTROLLER}/led`
} as const;

