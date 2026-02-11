const API_VERSION = import.meta.env.VITE_API_VERSION;
const CONTROLLER = `Operator`;

export const OperatorEndpoint = {
    GET:(locationId:number) => `/api/${API_VERSION}/${locationId}/${CONTROLLER}`, 
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${API_VERSION}${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    CREATE:`/api/${API_VERSION}/${CONTROLLER}`,
    DELETE:(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    UPDATE:`/api/${API_VERSION}/${CONTROLLER}`,
    GET_ID:(component:number) => `/api/${API_VERSION}/${CONTROLLER}/${component}`,
    PASS: `/api/${API_VERSION}/${CONTROLLER}/password/update`,
    DELETE_RANGE: `/api/${API_VERSION}/${CONTROLLER}/delete/range`
} as const;