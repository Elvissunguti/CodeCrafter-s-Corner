import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers"; // Assuming you have a PUT request function for updating blogs
import { useAuth } from "../Context/AuthContext";

const PrivateBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const { currentUserId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const getPrivateBlogs = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    `/myblogs/private/blogs/${currentUserId}`
                    );
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching private blogs", error);
                setError("Error fetching blogs. Please try again later.");
                setLoading(false);
            }
        };
        getPrivateBlogs();
    }, [currentUserId]);

    const togglePublicIntended = async (blogId) => {
        try {
            // Assuming you have a PUT request function for updating the blog's public intended state
            await makeAuthenticatedPOSTRequest(
                `/myblogs/change/ispublicintended/${blogId}`
                );
            // Assuming the response indicates success, you may want to update the UI accordingly
            setBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog.blogId === blogId ? { ...blog, isPublicIntended: true } : blog
                )
            );
        } catch (error) {
            console.error("Error updating public intended state", error);
        }
    };

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return content.split(" ").slice(0, maxLength).join(" ") + "...";
    };

    const processImageUrl = (image) => {
        const imageFilename = image.split("/").pop();
        return `/Images/${imageFilename}`;
    };


    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    if (error) return <div>{error}</div>;


    return (
        <section>
            <h1 className="text-2xl my-8 font-medium">Private Blogs</h1>
            {blogs && blogs.length === 0 && (
                        <div className="flex justify-center mt-6 h-full">
                            <p className="text-center text-gray-600 text-2xl mx-auto">
                                No blogs to display
                            </p>
                        </div>
                    )}
            <div className="mx-auto my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
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
                                <p>Status: {blog.approvalStatus}</p>
                                <button
                                    onClick={() => togglePublicIntended(blog.blogId)}
                                    className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${blog.isPublicIntended ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={blog.isPublicIntended}
                                >
                                    {blog.isPublicIntended ? 'Public' : 'Make Public'}
                                </button>
                                <a href={`/blog/${blog.blogId}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Read More</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PrivateBlogs;
