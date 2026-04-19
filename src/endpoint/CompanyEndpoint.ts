const CONTROLLER = `identity/company`;


export const CompanyEndpoint = {
    GET: `/api/${CONTROLLER}`,
    GET_BY_LOCATION:(location:number) => `/api/${location}/${CONTROLLER}`,
    CREATE: `/api/${CONTROLLER}`,
    PAGINATION:(pageNumber:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${CONTROLLER}/pagination?Page=${pageNumber}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&Search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&endDate=${endDate}`}`,
    UPDATE : `/api/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${CONTROLLER}/${component}`,
    GET_RANGE : `/api/${CONTROLLER}/range`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`
} as const;