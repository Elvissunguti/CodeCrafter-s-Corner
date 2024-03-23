import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";


const MakeUserAdmin = () => {

    const [ user, setUsers ] = useState([]);

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

    return(
        <section>
            <div>

            </div>
        </section>
    )
}

export default MakeUserAdmin;