import axios from "axios";
import Logger from "./Logger";
import api from "../api/api";

const server = import.meta.env.VITE_SERVER_IP;

class HttpRequest {

    static async sendWithToken(method:string,endpoint:string,payload?:object){
        try {
            switch (method) {
                case "GET":
                    return await api.get(endpoint)
                case "POST":
                    return api.post(endpoint,payload);
                case "PUT":
                    return api.put(endpoint,payload);
                case "DELETE":
                    return api.delete(endpoint);
            }
        } catch (e:any) {
            Logger.error(e)
            return e.response ?? null;
        }
    }

    static async send(method: string, endpoint: string,withCredentials?:boolean,payload?: object) {
        try {
            switch (method) {
                case "GET":
                    return await axios.get(server + endpoint, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials:withCredentials
                    });
                case "POST":
                    const res = await axios.post(server + endpoint, payload, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials:withCredentials
                    });
                    console.log(res)
                    return res;
                case "PUT":
                    return await axios.put(server + endpoint, payload, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials:withCredentials
                    })
                case "DELETE":
                    return await axios.delete(server + endpoint, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials:withCredentials
                    });
            }
        } catch (e:any) {
            console.log(e)
            Logger.error(e)
            return e.response ?? null;
        }
    }
}

export default HttpRequest;
