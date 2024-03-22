import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";

const ApproveBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectionReasons, setRejectionReasons] = useState({});

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    '/admin/blog/pendingapproval'
                );
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blogs seeking approval", error);
                setError(error.message || 'An error occurred');
                setLoading(false);
            }
        };
        fetchBlog();
    }, []);

    const handleApproval = async (blogId, approve) => {
        try {
            const rejectionReason = rejectionReasons[blogId];
            await makeAuthenticatedPOSTRequest(
                `/admin/blog/approve/${blogId}`, { approve, rejectionReason }
                );
            // Update the local state to reflect the change immediately
            setBlogs(prevBlogs => prevBlogs.map(blog => {
                if (blog.blogId === blogId) {
                    return { ...blog, approvalStatus: approve ? 'approved' : 'rejected', rejectionReason: approve ? '' : rejectionReason };
                }
                return blog;
            }));
        } catch (error) {
            console.error("Error updating approval status:", error);
            
        }
    };

    const handleRejectionReasonChange = (blogId, value) => {
        setRejectionReasons(prevState => ({
            ...prevState,
            [blogId]: value
        }));
    };

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return content.split(" ").slice(0, maxLength).join(" ") + "...";
    };

    const processImageUrl = (image) => {
        const imageFilename = image.split("/").pop();
        return `/Images/${imageFilename}`;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.length === 0 && <p>No blogs to display</p>}
                {blogs.map((blog) => (
                    <div key={blog.blogId} className="bg-white rounded-lg overflow-hidden shadow-md">
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
                                <div>
                                    {blog.approvalStatus === 'pending' && (
                                        <div>
                                            <button onClick={() => handleApproval(blog.blogId, true)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Approve</button>
                                            <button onClick={() => handleRejectionReasonChange(blog.blogId, '')} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Reject</button>
                                            {rejectionReasons[blog.blogId] !== undefined && (
                                                <input
                                                    type="text"
                                                    value={rejectionReasons[blog.blogId]}
                                                    onChange={(e) => handleRejectionReasonChange(blog.blogId, e.target.value)}
                                                    placeholder="Rejection Reason"
                                                    className="mt-2 px-2 py-1 border border-gray-300 rounded"
                                                />
                                            )}
                                        </div>
                                    )}
                                    {blog.approvalStatus === 'rejected' && (
                                        <p>Rejection Reason: {blog.rejectionReason}</p>
                                    )}
                                </div>
                                <a href={`/blog/${blog.blogId}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Read More</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ApproveBlogs;
