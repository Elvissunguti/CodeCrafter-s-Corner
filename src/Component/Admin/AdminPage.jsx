import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import NavBar from "../Home/NavBar";
import ApproveBlogs from "./ApproveBlogs";
import MakeUserAdmin from "./MakeUserAdmin";

const AdminPage = () => {
    const { userName } = useAuth();
    const [activeButton, setActiveButton] = useState('blogApprovals');

    return (
        <section className="bg-gray-100 min-h-screen">
            <NavBar />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Page</h1>
                <div className="space-y-4">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li
                            className={`bg-white shadow-md p-4 rounded-lg cursor-pointer ${activeButton === 'blogApprovals' ? 'text-blue-600 border-b-4 border-blue-600' : ''}`}
                            onClick={() => setActiveButton('blogApprovals')}
                        >
                            Blog Approvals
                        </li>
                        {userName === "CodeCrafter" && (
                            <li
                                className={`bg-white shadow-md p-4 rounded-lg cursor-pointer ${activeButton === 'makeUserAdmin' ? 'text-blue-600 border-b-4 border-blue-600' : ''}`}
                                onClick={() => setActiveButton('makeUserAdmin')}
                            >
                                Make User Admin
                            </li>
                        )}
                    </ul>
                </div>
                {/* Conditionally render components below the lists */}
                <div>
                    {activeButton === 'blogApprovals' ? <ApproveBlogs /> : <MakeUserAdmin />}
                </div>
            </div>
        </section>
    );
};

export default AdminPage;
