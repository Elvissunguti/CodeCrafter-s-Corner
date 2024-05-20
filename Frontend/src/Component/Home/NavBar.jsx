import "./NavBar.css";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../Assets/Logo/logo-transparent.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiEdit } from "react-icons/fi"; // Importing icons
import { useAuth } from "../Context/AuthContext";

const NavBar = () => {
    const { loggedIn, isAdmin, handleLogout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [welcomeVisible, setWelcomeVisible] = useState(false);
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
        if (confirmed) {
            handleLogout();
            navigation("/Blog");
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setWelcomeVisible(true);
        }, 1500); // Delay for the animation
    }, []);

    return (
        <section>
            <div className="mx-auto bg-gray-800 text-white h-16 flex items-center justify-between">
                <Link to="/Blog">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-32 h-10 ml-8 welcome-message bounce-in"
                    />
                </Link>
                <div className={`text-white text-lg ml-8 mt-2 welcome-message ${welcomeVisible ? "bounce-in" : ""}`}>
                    Welcome to CodeCrafter's Corner
                </div>
                <div>
                    <ul className="flex space-x-5 mr-16 welcome-message bounce-in">
                        <li>
                            <NavLink
                                to="/Blog"
                                className="nav-link hover:underline"
                                activeClassName="underline"
                            >
                                Blog
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className="nav-link hover:underline"
                                activeClassName="underline"
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/resources"
                                className="nav-link hover:underline"
                                activeClassName="underline"
                            >
                                Resources
                            </NavLink>
                        </li>
                        <li>
                            {loggedIn ? (
                                <div className="relative" ref={userMenuRef}>
                                    <div onClick={toggleUserMenu}>
                                        <FiUser className="text-xl" />
                                    </div>
                                    {showUserMenu && (
                                        <ul className="absolute top-full right-0 mt-2 flex flex-col bg-gray-900 border border-gray-800 rounded-md shadow-md px-3 py-2">
                                            <li>
                                                <Link to="/my_blogs" className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
                                                    <FiEdit className="mr-2" /> My Blogs
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/blog/upload" className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
                                                    <FiEdit className="mr-2" /> Upload Blogs
                                                </Link>
                                            </li>
                                            {isAdmin && (
                                                <li>
                                                    <Link to="/admin_page" className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
                                                        <FiUser className="mr-2" /> Admin
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <button onClick={handleLogoutClick} className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
                                                    <FiLogOut className="mr-2" /> Logout
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
