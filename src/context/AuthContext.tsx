import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthEndpoint } from "../endpoint/AuthEndpoint";
import { useLoading } from "./LoadingContext";
import { useToast } from "./ToastContext";
import { LocationEndpoint } from "../endpoint/LocationEndpoint";
import { clearAccessToken, getAccessToken, send, setAccessToken } from "../api/api";
import Helper from "../utility/Helper";
import { useLocation } from "./LocationContext";
import { LocationDto } from "../model/Location/LocationDto";
import { FeatureDto } from "../model/Role/FeatureDto";
import { FeatureEndpoint } from "../endpoint/FeatureEndpoint";
import { AuthToast } from "../model/ToastMessage";

type User = { id: string; name?: string; info?: Info; location?: number[];role?:Role  } | null;
type Info = { title?:string; firstname?:string; middlename?:string; lastname?:string; }
type Role = { roleNo?:number; roleName?:string; features?:number[]}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  filterPermission:(FeatureId:number) => FeatureDto | undefined;
};

const AuthContext = createContext<AuthContextType|undefined>(undefined);


let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;


const doRefresh = async () => {
    if(isRefreshing && refreshPromise) return refreshPromise;
    isRefreshing = true;
    refreshPromise = (async () => {
        try{
            const res = await send.post(AuthEndpoint.REFRESH)
            if(res?.status !== 200) return false;
            setAccessToken(res.data.data.accessToken)
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
    // const [permission,setPermission] = useState<FeatureDto[]>([]);
    let permission:FeatureDto[] = [];
    const [user,setUser] = useState<User>(null);
    // const [loading,setLoading] = useState<boolean>(true);
    const  {loading,setLoading} = useLoading();
    const {setLocationId,setLocationList,setLocationName} = useLocation();
    const {toggleToast} = useToast();

    const fetchMe = useCallback(async () =>{
        if(!getAccessToken()) return false;
        const res = await send.get(AuthEndpoint.ME);
        if(res?.status !== 200) return false;
        console.log(res.data.user);
        setUser(res.data.user);
        fetchLocation(res.data.user.location)
        fetchPermission(res.data.user.role.roleNo)
        return true;
    },[])

    const fetchLocation = useCallback(async (locationIds:number[]) => {
        if(!getAccessToken()) return false;
        var dto = {
            locationIds:locationIds
        }
        const res = await send.post(LocationEndpoint.GET_RANGE,dto)
        let locs:LocationDto[] = res.data.data;
        setLocationList(locs)
        if(locs.length > 0){
            setLocationName(locs[0].locationName)
            setLocationId(locs[0].componentId)
        }
        // res.data.data.map((a:LocationDto) => {
        //     setLocationOption(prev => ([...prev,{
        //         label:a.locationName,
        //         value:a.componentId,
        //         isTaken:false,
        //         description:a.description
        //     }]))
        // })
    },[])

    const fetchPermission = useCallback(async (RoleId:number) => {
        if(!getAccessToken()) return false;
        const res = await send.get(FeatureEndpoint.GET_BY_ROLE(RoleId))
        console.log(res.data.data)
        if(res && res.data.data){
            permission = res.data.data
        }
    },[])


    useEffect(() => {
        (async () => {
            const ok = await doRefresh();
            console.log(ok)
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
        const res = await send.post(AuthEndpoint.LOGIN,{username,password})
        setLoading(false);
        if(!Helper.handleToastByResCode(res,AuthToast.LOGIN,toggleToast)){
            return false;
        }
        setAccessToken(res.data.data.accessToken)
        await fetchMe();
        return true
    },[fetchMe])

    const signOut = useCallback(async () => {
        const res = await send.post(AuthEndpoint.LOGOUT) 
        console.log(res)
        clearAccessToken()
        setUser(null);
    },[])

    const filterPermission = useCallback((FeatureId:number) => {
        console.log(permission)
        return permission.find(s => s.componentId == FeatureId);
    },[fetchMe])


    return (
        <AuthContext.Provider
        value={{
            user,
            isAuthenticated: !!user,
            loading,
            signIn,
            signOut,
            filterPermission
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