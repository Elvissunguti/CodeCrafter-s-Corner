import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 ">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-full">
                <p className="text-center">&copy; 2024 CodeCrafters. All rights reserved.</p>
                <div>
                    <a href="https://github.com/Elvissunguti/CodeCrafter-s-Corner.git" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white mr-4">
                        <FaGithub className="text-xl" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
    