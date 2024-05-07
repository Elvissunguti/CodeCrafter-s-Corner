import React, { createContext, useContext, useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import Cookies from "js-cookie";


const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}


export const AuthProvider = ({ children }) => {
    
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [ userName , setUserName ] = useState(null);


    useEffect(() => {
        const token = Cookies.get("token");
        
        if(token){
            setLoggedIn(true);
            fetchUserId();
        }
    }, [])

    const fetchUserId = async () => {
        try {
            
            const response = await makeAuthenticatedGETRequest("/auth/userId");
            setCurrentUserId(response.data._id);
            setIsAdmin(response.data.isAdmin);
            setUserName(response.data.userName);
            console.log(response.data.userName)
        } catch (error) {
            console.error("Error fetching user Id of current user:", error);
            
        }
    };

    const handleLogout = () => {
        Cookies.remove("token");
        setLoggedIn(false);
        setCurrentUserId(null);
        setUserName(null)
        setIsAdmin(false);
    };


    const handleLogin = () => {
        setLoggedIn(true);
        fetchUserId();
    };

    
    return(
        <AuthContext.Provider value={{ loggedIn, currentUserId, isAdmin, userName, handleLogout, handleLogin }}>
            {children}
        </AuthContext.Provider>
    )
};

