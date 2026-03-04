const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Role`;

export const RoleEndpoint = {
    GET:`/api/${CONTROLLER}`,
    CREATE:`/api/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    DELETE :(component:number) => `/api/${CONTROLLER}/${component}`,
    UPDATE :`/api/${CONTROLLER}`,
    GET_FEATURE_LIST :`/api/Feature/list`,
    DELETE_RANGE:`/api/${CONTROLLER}/delete/range`
} as const;