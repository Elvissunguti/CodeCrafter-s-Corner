import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { useAuth } from "../Context/AuthContext";

const PublicBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const { currentUserId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    `/myblogs/public/blogs/${currentUserId}`
                    );
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching my public blogs:", error);
                setError("Error fetching blogs. Please try again later.");
                setLoading(false);
            }
        };
        fetchBlog();
    }, [currentUserId]);

    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    if (error) return <div>{error}</div>;


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
        <section>
            <div>
                <h1 className="text-2xl my-8 font-medium">My public blogs</h1>
            </div>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs && blogs.length === 0 && <p>No blogs to display</p>}
                {blogs && blogs.map((blog, index) => (
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
                                <a href={`/blog/${blog.blogId}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Read More</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PublicBlog;
