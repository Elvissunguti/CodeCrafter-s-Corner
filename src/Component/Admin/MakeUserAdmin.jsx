import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";


const MakeUserAdmin = () => {

    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/admin/fetch/users"
                );

                setUsers(response.data);

            } catch(error){
                console.error("Error fetching users", error);
            }
        }
        getUsers();
    }, []);


    const handleMakeAdmin = async (userId) => {
        try{
            
            const response = await makeAuthenticatedPOSTRequest(`/admin/create/${userId}`);
            if (response && response.data && response.data.message) {
                setUsers(prevUsers => {
                    const updatedUsers = prevUsers.map(user =>
                        user._id === userId ? { ...user, isAdmin: true } : user
                    );
                    return updatedUsers;
                });
            }
        } catch (error){
            console.error("Error making a user an Admin", error);
        }
    }


    const handleRemoveAdmin = async (userId) => {
        try {
            
            const response = await makeAuthenticatedPOSTRequest(
                `/admin/remove/${userId}`
                );
                if (response && response.data && response.data.message) {
                    setUsers(prevUsers => {
                        const updatedUsers = prevUsers.map(user =>
                            user._id === userId ? { ...user, isAdmin: false } : user
                        );
                        return updatedUsers;
                    });
                }
        } catch (error) {
            console.error("Error removing admin rights from user", error);
        }
    };

    return(
        <section>
            <div>
            <h2>User List</h2>
                <ul>
                {users.map(user => (
                        <li key={user._id} className="flex">
                            <p className="mr-4">{user.userName}</p>
                            {user.isAdmin ? (
                                <button onClick={() => handleRemoveAdmin(user._id)}>Remove user as Admin</button>
                            ) : (
                                <button onClick={() => handleMakeAdmin(user._id)}>Make user Admin</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default MakeUserAdmin;