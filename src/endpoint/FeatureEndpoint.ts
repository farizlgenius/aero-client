
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const FeatureEndpoint = {
    GET:`/api/Feature`,
    GET_BY_ROLE:(RoleId:number) => `/api/Feature/role/${RoleId}`,
    GET_BY_ROLE_FEATURE:(RoleId:number,FeatureId:number) => `/api/Feature/role/${RoleId}/${FeatureId}`
} as const;