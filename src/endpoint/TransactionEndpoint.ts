const API_VERSION = import.meta.env.VITE_API_VERSION;

export const TransactionEndpoint = {
    GET_TRANSACTION:(pageNumber:number,pageSize:number) => `/api/${API_VERSION}/Transaction?PageNumber=${pageNumber}&PageSize=${pageSize}`
} as const;