import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";

const MakeUserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/admin/fetch/users");
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
            await makeAuthenticatedPOSTRequest(`/admin/create/${userId}`);
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

            await makeAuthenticatedPOSTRequest(`/admin/remove/${userId}`);
        } catch (error) {
            console.error("Error removing admin rights from user", error);
            setUsers(prevUsers => prevUsers.map(user =>
                user._id === userId ? { ...user, isAdmin: true } : user
            ));
        }
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <section className="p-4">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            <input
                type="text"
                placeholder="Search by username"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md px-3 py-1 mb-4"
            />
            {loading ? (
                <p>Loading...</p>
            ) : filteredUsers.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {filteredUsers.map(user => (
                        <li key={user._id} className="flex items-center justify-between border-b py-2">
                            <p className="text-lg">{user.userName}</p>
                            {user.isAdmin ? (
                                <button onClick={() => handleRemoveAdmin(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">Remove Admin</button>
                            ) : (
                                <button onClick={() => handleMakeAdmin(user._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">Make Admin</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default MakeUserAdmin;
