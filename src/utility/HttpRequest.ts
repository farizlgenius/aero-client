import axios from "axios";
import Logger from "./Logger";

const server = import.meta.env.VITE_SERVER_IP;

class HttpRequest {

    static async send(method:string,endpoint:string,payload?:object) {
        try {
            switch (method) {
                case "GET":
                    return await axios.get(server+endpoint);
                case "POST":
                    return await axios.post(server+endpoint, payload, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                case "PUT":
                    return await axios.put(server+endpoint, payload, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                case "DELETE":
                    return await axios.delete(server+endpoint);
                    break;
            }
        } catch (e) {
            Logger.error(e)
            return null;
        }
    }
}

export default HttpRequest;
