import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeUnauthenticatedGETRequest } from "../Utils/Helpers";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";

const Blog = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Function to truncate the content to a certain number of words
    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return content.split(" ").slice(0, maxLength).join(" ") + "...";
    };

    // Function to process image URLs
    const processImageUrl = (image) => {
        const imageFilename = image.split("/").pop();
        return `/Images/${imageFilename}`;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <section className="flex-grow">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading && <p>Loading...</p>}
                    {!loading && blogPosts.length === 0 && <p>No blogs to display</p>}
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
