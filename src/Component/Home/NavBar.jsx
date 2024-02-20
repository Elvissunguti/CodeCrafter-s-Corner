import React from "react";
import logo from "../../Assets/Logo/logo-transparent.png"
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <section>
            <div className="mx-auto flex items-center justify between">
                <Link>
                <img 
                 src={logo}
                 alt="Logo"
                 className="w-32 h-10"
                />
                </Link>
                <div>
                    <ul>
                        <li>
                            Blog
                        </li>
                        <li>
                            About
                        </li>
                        <li>
                            Resources
                        </li>
                    </ul>
                </div>

            </div>
            
        </section>
    )
}
export default NavBar;