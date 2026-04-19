const CONTROLLER = `identity/location`;


export const LocationEndpoint = {
    GET: `/api/${CONTROLLER}`,
    CREATE: `/api/${CONTROLLER}`,
    PAGINATION:(page:number,pageSize:number,locationId?:number | undefined,search?:string | undefined,startDate?:string | undefined,endDate?:string | undefined) => `/api/${CONTROLLER}/pagination?Page=${page}&PageSize=${pageSize}${search == undefined || search == "" ? "" : `&Search=${search}`}${startDate == undefined ? "" : `&startDate=${startDate}`}${endDate == undefined ? "" : `&startDate=${endDate}`}`,
    UPDATE : `/api/${CONTROLLER}`,
    DELETE :(component:number) => `/api/${CONTROLLER}/${component}`,
    GET_RANGE : `/api/${CONTROLLER}/range`,
    DELETE_RANGE: `/api/${CONTROLLER}/delete/range`,
    COUNTRY : `/api/${CONTROLLER}/country`
} as const;