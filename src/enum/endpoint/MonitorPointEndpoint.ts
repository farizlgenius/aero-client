export enum MonitorPointEndpoint {
    GET_MP_LIST = '/api/v1/MonitorPoint',
    POST_ADD_MP = '/api/v1/MonitorPoint',
    GET_MP_STATUS = '/api/v1/MonitorPoint/status/',
    DELETE_MP = '/api/v1/MonitorPoint/',
    GET_IP_LIST = "/api/v1/MonitorPoint/ip/",
    POST_MASK = "/api/v1/MonitorPoint/mask",
    POST_UNMASK = "/api/v1/MonitorPoint/unmask",
    GET_IP_MODE = "/api/v1/MonitorPoint/input/mode",
    GET_MP_MODE = "/api/v1/MonitorPoint/mode"
}