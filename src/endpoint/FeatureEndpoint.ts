
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const FeatureEndpoint = {
    GET:`/api/${API_VERSION}/Feature`,
    GET_BY_ROLE:`/api/${API_VERSION}/Feature/role/`,
    GET_BY_ROLE_FEATURE:(RoleId:number,FeatureId:number) => `/api/${API_VERSION}/Feature/role/${RoleId}/${FeatureId}`
} as const;