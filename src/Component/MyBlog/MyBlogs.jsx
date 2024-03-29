import React, { useState } from "react";
import NavBar from "../Home/NavBar";
import PublicBlogs from "../Shared/PublicBlogs";
import ApprovedBlogs from "../Shared/ApprovedBlogs";
import PendingRejectedBlogs from "../Shared/PendingRejectedBlog";
import PrivateBlogs from "../Shared/PrivateBlogs";
import Footer from "../Footer/Footer";

const MyBlogs = () => {

    const [activeComponent, setActiveComponent] = useState("public");

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <section className="bg-gray-100 flex-grow">
                <div className="mx-auto py-8">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Blogs</h1>
                    <div className="space-y-4">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <li
                                className={`bg-white shadow-md p-4 rounded-lg cursor-pointer ${activeComponent === 'public' ? 'text-blue-600 border-b-4 border-blue-600' : ''}`}
                                onClick={() => setActiveComponent('public')}
                            >
                                Public Blogs
                            </li>
                            <li
                                className={`bg-white shadow-md p-4 rounded-lg cursor-pointer ${activeComponent === 'approved' ? 'text-blue-600 border-b-4 border-blue-600' : ''}`}
                                onClick={() => setActiveComponent('approved')}
                            >
                                Approved Blogs
                            </li>
                            <li
                                className={`bg-white shadow-md p-4 rounded-lg cursor-pointer ${activeComponent === 'pendingRejected' ? 'text-blue-600 border-b-4 border-blue-600' : ''}`}
                                onClick={() => setActiveComponent('pendingRejected')}
                            >
                                Pending Blogs
                            </li>
                            <li
                                className={`bg-white shadow-md p-4 rounded-lg cursor-pointer ${activeComponent === 'private' ? 'text-blue-600 border-b-4 border-blue-600' : ''}`}
                                onClick={() => setActiveComponent('private')}
                            >
                                Private Blogs
                            </li>
                        </ul>
                    </div>
                    <div>
                        {activeComponent === 'public' && <PublicBlogs />}
                        {activeComponent === 'approved' && <ApprovedBlogs />}
                        {activeComponent === 'pendingRejected' && <PendingRejectedBlogs />}
                        {activeComponent === 'private' && <PrivateBlogs />}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
export default MyBlogs;
