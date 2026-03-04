const CONTROLLER = `ControlPoint`;

export const ControlPointEndpoint = {
    GET:(location:number) => `/api/${location}/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${CONTROLLER}/${component}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api${locationId == 0 || locationId == undefined ?  "" : `/${locationId}` }/${CONTROLLER}/pagination?PageNumber=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    TRIGGER : `/api/${CONTROLLER}/trigger`,
    CREATE : `/api/${CONTROLLER}/control`,
    UPDATE : `/api/${CONTROLLER}`,
    STATUS :(mac:string,cpNo:number)=> `/api/${CONTROLLER}/status/${mac}/${cpNo}`,
    OUTPUT : (mac:string,component:number) => `/api/${CONTROLLER}/op/${mac}/${component}`,
    GET_OFFLINE_OP_MODE : `/api/${CONTROLLER}/mode/offline`,
    GET_RELAY_OP_MODE : `/api/${CONTROLLER}/mode/relay`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`
} as const;

