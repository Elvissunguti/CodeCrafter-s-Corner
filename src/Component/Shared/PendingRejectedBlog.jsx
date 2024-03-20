import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { useAuth } from "../Context/AuthContext";

const PendingRejectedBlogs = () => {

    const [ blogs, setBlogs ] = useState([]);
    const { currentUserId } = useAuth();
    
    useEffect(() => {
        const fetchBlog = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    `/myblogs/pending/rejected/blog/${currentUserId}`
                );

                setBlogs(response.data);

            } catch(error){
                console.error("Error fetching pending or rejected blogs", error);
            }
        }
        fetchBlog();
    }, [currentUserId]);


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
                                <p>Status: {blog.approvalSatus}</p>
                                <a href={`/blog/${blog.blogId}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Read More</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            </div>
        </section>
    )
}
export default PendingRejectedBlogs; 