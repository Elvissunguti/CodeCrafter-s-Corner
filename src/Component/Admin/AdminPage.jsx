import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import NavBar from "../Home/NavBar";


const AdminPage = () => {

    const { userName } = useAuth();
    return (
        <section>
            <NavBar />
            <div>
                <h1>Admin page</h1>
                <div>
                    <ul>
                        <li>
                            <Link to="/admin/approve_blogs">blog Approvals</Link>
                        </li>
                        {userName === "CodeCrafter" && ( 
                            <li>
                                <Link to="/admin/make_user_admin">Make User Admin</Link>
                            </li>
                        )}
                    </ul>
                </div>

            </div>
        </section>
    )
}

export default AdminPage;