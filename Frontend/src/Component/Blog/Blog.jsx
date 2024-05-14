import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeUnauthenticatedGETRequest } from "../Utils/Helpers";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie"; // Import Cookies library
import Footer from "../Footer/Footer";

const Blog = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // Function to handle token extraction and processing
    const handleTokenFromQuery = () => {
        const query = new URLSearchParams(location.search);
        const tokenFromQuery = query.get("token");
        if (tokenFromQuery) {
            // Log the token received
            console.log("Token received:", tokenFromQuery);
            // Handle token received
            handleTokenReceived(tokenFromQuery);
        }
    };

    // Function to handle token received
    const handleTokenReceived = (token) => {
        // Set token in cookies
        Cookies.set("token", token, { expires: 7 }); // Set token with expiry of 7 days
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeUnauthenticatedGETRequest(
                    "/blog/publicblog"
                );
                setBlogPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blogs from the server:", error);
                setError("Error fetching blogs. Please try again later.");
                setLoading(false);
            }
        };
        fetchData();

        // Call handleTokenFromQuery whenever location changes
        handleTokenFromQuery();
    }, [location]);

    // Call handleTokenFromQuery in the component render method
    handleTokenFromQuery();

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return content.split(" ").slice(0, maxLength).join(" ") + "...";
    };

    const processImageUrl = (image) => {
        const imageFilename = image.split("/").pop();
        return `/Images/${imageFilename}`;
    };


   
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <section className="flex-grow">
            {loading && (
                        <div className="flex justify-center items-center align-center  mt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>
            )}
            {!loading && blogPosts.length === 0 && <p>No blogs to display</p>}
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.map((blog, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                            {blog.thumbnail && (
                                <img
                                    src={processImageUrl(blog.thumbnail)}
                                    alt="Thumbnail"
                                    className="w-full h-40 object-cover object-center"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
                                <p className="text-gray-700">{truncateContent(blog.paragraphs[0].content, 50)}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{blog.userName}</span>
                                    <Link to={`/blog/${blog.blogId}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Read More</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Blog;
