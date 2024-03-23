import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";

const MakeUserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    "/admin/fetch/users"
                    );
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleMakeAdmin = async (userId) => {
        try {
            // Optimistically update UI
            setUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, isAdmin: true } : user
            ));

            // Make API request
            await makeAuthenticatedPOSTRequest(
                `/admin/create/${userId}`
                );
            
            
        } catch (error) {
            console.error("Error making a user an Admin", error);
            setUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, isAdmin: false } : user
            ));
        }
    };

    const handleRemoveAdmin = async (userId) => {
        try {
            setUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, isAdmin: false } : user
            ));

            await makeAuthenticatedPOSTRequest(
                `/admin/remove/${userId}`
                );
            
        } catch (error) {
            console.error("Error removing admin rights from user", error);
            setUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, isAdmin: true } : user
            ));
        }
    };

    return (
        <section>
            <div>
                <h2>User List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
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
                )}
            </div>
        </section>
    );
};

export default MakeUserAdmin;
