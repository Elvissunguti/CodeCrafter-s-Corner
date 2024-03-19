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
            setCurrentUserId(response.data);
        } catch (error) {
            console.error("Error logging in:", error);
            // Handle login error
        }
    };

    const handleLogout = () => {
        Cookies.remove("token");
        setLoggedIn(false);
        setCurrentUserId(null);
    };
    return(


        <AuthContext.Provider value={{ loggedIn, currentUserId, handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
};

