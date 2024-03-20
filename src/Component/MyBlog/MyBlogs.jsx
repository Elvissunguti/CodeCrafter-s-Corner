import React from "react";
import NavBar from "../Home/NavBar";
import { Link } from "react-router-dom";


const MyBlogs = () => {
    return (
        <section>
            <NavBar />
            <div>
                <ul>
                    <li>
                        <Link to="/public_blogs">Public blogs</Link>
                    </li>
                    <li>
                        <Link>Approved blogs</Link>
                    </li>
                    <li>
                        <Link>Pending blogs</Link>
                    </li>
                    <li>
                        <Link>Private blogs</Link>
                    </li>
                </ul>

            </div>
        </section>
    )
}
export default MyBlogs;