import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useLoading } from "../context/LoadingContext";

export const ProtectedRoute:React.FC<{children: JSX.Element}> = ({children}) => {
    const {isAuthenticated,loading,user} = useAuth();
    const {Loading} = useLoading();
    console.log(user)
    if(loading) return <Loading/>
    if(!isAuthenticated) return <Navigate to="/login" replace />
    return children;
}