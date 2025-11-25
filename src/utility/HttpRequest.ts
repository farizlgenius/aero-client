import axios from "axios";
import Logger from "./Logger";

const server = import.meta.env.VITE_SERVER_IP;

class HttpRequest {

    static async sendWithToken(method:string,endpoint:string,accessToken:string,withCredentials:boolean,payload?:object){
        try {
            switch (method) {
                case "GET":
                    return await axios.get(server + endpoint, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization" : `Bearer ${accessToken}`
                        },
                        withCredentials:withCredentials
                    });
                case "POST":
                    const res = await axios.post(server + endpoint, payload, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization" : `Bearer ${accessToken}`
                        },
                        withCredentials:withCredentials
                    });
                    console.log(res)
                    return res;
                case "PUT":
                    return await axios.put(server + endpoint, payload, {
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization" : `Bearer ${accessToken}`
                        },
                        withCredentials:withCredentials
                    })
                case "DELETE":
                    return await axios.delete(server + endpoint, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization" : `Bearer ${accessToken}`
                        },
                        withCredentials:withCredentials
                    });
            }
        } catch (e) {
            Logger.error(e)
            return null;
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
