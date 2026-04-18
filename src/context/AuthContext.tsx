import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthEndpoint } from "../endpoint/AuthEndpoint";
import { useLoading } from "./LoadingContext";
import { useToast } from "./ToastContext";
import { LocationEndpoint } from "../endpoint/LocationEndpoint";
import { clearAccessToken, getAccessToken, send, setAccessToken } from "../api/api";
import Helper from "../utility/Helper";
import { useLocation } from "./LocationContext";
import { LocationDto } from "../model/Location/LocationDto";
import { PermissionDto as PermissionDto } from "../model/Role/PermissionDto";
import { AuthToast } from "../model/ToastMessage";


interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    signIn: (username: string, password: string) => Promise<boolean>;
    signOut: () => Promise<boolean>;
    filterPermission: (FeatureId: number) => PermissionDto | undefined;
    isAllowedPermission: (FeatureId: number) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
// let permissions: PermissionDto[] = [];


const doRefresh = async () => {
    if (isRefreshing && refreshPromise) return refreshPromise;
    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const res = await send.post(AuthEndpoint.REFRESH,{
                refresh:""
            })
            if (res?.status !== 200) return false;
            setAccessToken(res.data.accessToken)
            return true;
        } catch {
            return false;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();
    return refreshPromise;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { loading, setLoading } = useLoading();
    const { setLocationId, setLocationList, setLocationName, SetLocationOption } = useLocation();
    const { toggleToast } = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
const [permissions, setPermission] = useState<PermissionDto[]>([]);


    const fetchMe = useCallback(async () => {
        if (!getAccessToken()) return false;
        const res = await send.get(AuthEndpoint.ME);
        if (res?.status !== 200) return false;
        console.log(res)
        console.log(res.data);
        fetchLocation(res.data.locations) // [1]
        setPermission(res.data.permissions)
        setIsAuthenticated(true);
        console.log(res.data.auth)
        return true;
    }, [])

    const fetchLocation = useCallback(async (locationIds: number[]) => {
        if (!getAccessToken()) return false;
        var dto = {
            Ids: locationIds
        }
        const res = await send.post(LocationEndpoint.GET_RANGE, dto)
        console.log(res)
        let locs: LocationDto[] = res.data;
        setLocationList(locs)
        SetLocationOption(locs.map(d => ({
    label: d.name,
    value: d.id,
    description: d.description,
    isTaken: false
})));
        if (locs.length > 0) {
            setLocationName(locs[0].name)
            setLocationId(locs[0].id)
        }

    }, [])

    useEffect(() => {
        (async () => {
            const ok = await doRefresh();
            console.log(ok)
            if (ok) {
                await fetchMe();
            } else {
                console.log(1);
                setIsAuthenticated(false);
            }
            setLoading(false);
        })();
    }, [fetchMe])

    const signIn = useCallback(async (username: string, password: string) => {
        setLoading(true);
        const body = new FormData();
        body.append("username", username);
        body.append("password", password);
        const res = await send.post(AuthEndpoint.LOGIN, body)
        setLoading(false);
        if (!Helper.handleToastByResCode(res, AuthToast.LOGIN, toggleToast)) {
            return false;
        }
        setAccessToken(res.data.accessToken)
        await fetchMe();
        return true
    }, [fetchMe])

    const signOut = useCallback(async () => {
        const res = await send.post(AuthEndpoint.LOGOUT,{
            "refresh":""
        })
        console.log(res.data)
        if (res.data) {
            clearAccessToken()
            setIsAuthenticated(false);
        }
        return res.data;
    }, [])

    const filterPermission = useCallback((FeatureId: number) => {
        return permissions.find(s => s.featureId == FeatureId);
    }, [permissions])


    const isAllowedPermission = useCallback((featureId:number) => {
    return !(permissions.find(p => p.featureId === featureId)?.isEnabled ?? false);
}, [permissions]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isAllowedPermission,
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

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}