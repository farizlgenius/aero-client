import { createContext, useCallback, useContext, useEffect, useState } from "react";
import HttpRequest from "../utility/HttpRequest";
import { HttpMethod } from "../enum/HttpMethod";
import { AuthEndpoint } from "../enum/endpoint/AuthEndpoint";
import { useLoading } from "./LoadingContext";
import { useToast } from "./ToastContext";

type User = { id: string; name?: string; email?: string; roles?: string[] } | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType|undefined>(undefined);


let _accessToken: string | null = null;
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;


const doRefresh = async () => {
    if(isRefreshing && refreshPromise) return refreshPromise;
    isRefreshing = true;
    refreshPromise = (async () => {
        try{
            const res = await HttpRequest.send(HttpMethod.POST,AuthEndpoint.POST_REFRESH,true)
            if(res?.status !== 200) return false;
            _accessToken = res.data.data.accessToken;
            return true;
        }catch{
             return false;
        }finally{
            isRefreshing = false;
            refreshPromise = null;
        }
    })();
    return refreshPromise;
} 

export const AuthProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [user,setUser] = useState<User>(null);
    // const [loading,setLoading] = useState<boolean>(true);
    const  {loading,setLoading} = useLoading();
    const {toggleToast} = useToast();

    const fetchMe = useCallback(async () =>{
        if(!_accessToken) return false;
        const res = await HttpRequest.sendWithToken(HttpMethod.GET,AuthEndpoint.GET_ME,_accessToken,false)
        if(res?.status !== 200) return false;
        console.log(res);
        setUser(res.data.user);
        return true;
    },[])

    useEffect(() => {
        (async () => {
            setLoading(true);
            const ok = await doRefresh();
            if(ok){
                await fetchMe();
            }else{
                setUser(null)
            }
            setLoading(false);
        })();
    },[fetchMe])

    const signIn = useCallback(async (username:string,password:string) => {
        setLoading(true);
        const res = await HttpRequest.send(HttpMethod.POST,AuthEndpoint.POST_LOGIN,true,{username,password})
        setLoading(false);
        console.log(res)
        if(res?.data.code !== 200){
            toggleToast("error",res?.data.details[0])
            return false;
        }
        _accessToken = res.data.data.accessToken
        await fetchMe();
        return true
    },[fetchMe])

    const signOut = useCallback(async () => {
        const res = await HttpRequest.send(HttpMethod.POST,AuthEndpoint.POST_LOGOUT,true)
        console.log(res)
        _accessToken = null;
        setUser(null);
    },[])

    const fetchWithAuth = useCallback(async (input:RequestInfo,init?:RequestInit) => {
        const doFetch = async () => {
            const headers = new Headers(init?.headers as HeadersInit);
            if(_accessToken) headers.set("Authorization",`Bearer ${_accessToken}`);
            const merged:RequestInit = {...init,headers,credentials:init?.credentials ?? "same-origin"};
            return fetch(input,merged);
        };

        let res = await doFetch();
        if(res.status === 401){
            const refreshed = await doRefresh();
            if(refreshed){
                res = await doFetch();
            }
        }
        return res;
    },[]);

    return (
        <AuthContext.Provider
        value={{
            user,
            isAuthenticated: !!user,
            loading,
            signIn,
            signOut,
            fetchWithAuth
        }}
        >
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth(){
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}