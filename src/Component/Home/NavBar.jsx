import React from "react";
import logo from "../../Assets/Logo/logo-transparent.png"
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <section>
            <div className="mx-auto flex items-center justify-between mt-3">
                <Link>
                <img 
                 src={logo}
                 alt="Logo"
                 className="w-32 h-10"
                />
                </Link>
                <div className="f">
                    <ul className="flex space-x-5 mr-5">
                        <li >
                            <Link to="/Blog">
                               Blog
                            </Link>
                        
                        </li>
                        <li>
                            <Link>
                              About
                            </Link>
                        </li>
                        <li>
                            <Link>
                            Resources
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
            
        </section>
    )
}
export default NavBar;