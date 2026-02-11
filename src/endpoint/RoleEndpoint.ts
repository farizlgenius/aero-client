const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Role`;

export const RoleEndpoint = {
    GET:`/api/${API_VERSION}/${CONTROLLER}`,
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    DELETE :(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    UPDATE :`/api/${API_VERSION}/${CONTROLLER}`,
    GET_FEATURE_LIST :`/api/${API_VERSION}/Feature/list`,
    DELETE_RANGE:`/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;