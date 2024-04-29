import React, { useEffect, useRef, useState } from "react";
import logo from "../../Assets/Logo/logo-transparent.png";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";

const NavBar = () => {
    const { loggedIn, isAdmin, handleLogout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigation = useNavigate();
    const userMenuRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showUserMenu]);

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleLogoutClick = () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if(confirmed){
            handleLogout();
            navigation("/Blog");

        }
    };

    return (
        <section>
            <div className="mx-auto flex items-center justify-between mt-3">
                <Link to="/Blog">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-32 h-10 ml-8"
                    />
                </Link>
                <div className="">
                    <ul className="flex space-x-5 mr-16">
                        <li>
                            <Link to="/Blog">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link to="/about">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/resources">
                                Resources
                            </Link>
                        </li>
                        <li>
                            {loggedIn ? (
                                <div className="relative" ref={userMenuRef}>
                                    <div onClick={toggleUserMenu} className="">
                                        <FiUser className="text-xl" />
                                    </div>
                                    {showUserMenu && (
                                        <ul className="absolute top-full right-0 mt-2 flex flex-col bg-white border border-gray-200 rounded-md shadow-md px-5 py-2">
                                            <li className="inline-block">
                                                <Link to="/my_blogs" className=" px-4 py-2 text-gray-800 hover:bg-blue-100">
                                                    My Blogs
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/blog/upload" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                                   Upload Blogs
                                                </Link>
                                            </li>
                                            {isAdmin && ( // Conditionally render "Admin" link
                                            <li>
                                                 <Link to="/admin_page" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                                    Admin
                                                 </Link>
                                             </li>
                                             )}
                                              <li>
                                                <button onClick={handleLogoutClick} className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login">Login</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default NavBar;
