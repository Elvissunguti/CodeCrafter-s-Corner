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
        } catch (error) {
            console.error("Error fetching user Id of current user:", error);
            
        }
    };

    const handleLogout = () => {
        Cookies.remove("token");
        setLoggedIn(false);
        setCurrentUserId(null);
        setIsAdmin(false);
    };

    
    return(


        <AuthContext.Provider value={{ loggedIn, currentUserId, isAdmin, handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
};

