import React from "react";
import NavBar from "../Home/NavBar";


const MyBlogs = () => {
    return (
        <section>
            <NavBar />
            <div>
                <ul>
                    <li>
                        <Link>Public blogs</Link>
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