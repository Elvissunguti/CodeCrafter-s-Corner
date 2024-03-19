import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedPOSTRequest, makeUnauthenticatedGETRequest } from "../Utils/Helpers";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const BlogPage = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [fetchComments, setFetchComments] = useState([]);
    const { loggedIn, currentUserId } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await makeUnauthenticatedGETRequest(
                    `/blog/fetch/${blogId}`
                );
                setBlog(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error fetching the blog");
                console.error("Error fetching the blog", error);
                setLoading(false);
            }
        }
        fetchBlog();
    }, [blogId]);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await makeUnauthenticatedGETRequest(
                    `/comment/fetch/${blogId}`
                );
                setFetchComments(response.data);
            } catch (error) {
                console.error("Error fetching comments in a blog", error);
            }
        }
        fetchComment();
    }, [blogId]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            if (!loggedIn) {
                navigate("/login")
                return;
            }

            await makeAuthenticatedPOSTRequest(
                `/comment/create/${blogId}`, { commentText }
            )

            const response = await makeUnauthenticatedGETRequest(
                `/comment/fetch/${blogId}`
            );
            setFetchComments(response.data);
            setCommentText(""); // Clear comment text field

        } catch (error) {
            console.error("Error submitting comments", error);
        }
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleEditComment = async (commentId, editedText) => {
        try {
            await makeAuthenticatedPOSTRequest(
                `/comment/edit/${commentId}`,
                { commentText: editedText }
            );
            // Update the comments list after editing
            const updatedComments = fetchComments.map(comment =>
                comment._id === commentId ? { ...comment, commentText: editedText } : comment
            );
            setFetchComments(updatedComments);
        } catch (error) {
            console.error("Error editing comment", error);
        }
    };

    const handleReply = async (parentId, replyText) => {
        try {
            if (!loggedIn) {
                navigate("/login");
                return;
            }

            await makeAuthenticatedPOSTRequest(
                `/comment/parentcomment/${blogId}/${parentId}`,
                { commentText: replyText }
            );

            // Refresh comments after adding a new one
            const response = await makeUnauthenticatedGETRequest(
                `/comment/fetch/${blogId}`
            );
            setFetchComments(response.data);

        } catch (error) {
            console.error("Error replying to comment", error);
        }
    };

    return (
        <section className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="container mx-auto py-8 px-4">
                {loading && <div className="text-center">Loading...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}

                {blog && (
                    <>
                        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                        <p className="text-gray-600 mb-2">Author: {blog.userName}</p>

                        {blog.thumbnail && (
                            <img src={`/Images/${blog.thumbnail}`} alt="Thumbnail" className="mb-4 rounded-lg shadow-lg" />
                        )}

                        {blog.paragraphs.map((paragraph, index) => (
                            <div key={index} className="mb-4">
                                <p className="text-lg">{paragraph.content}</p>

                                {paragraph.media.images && (
                                    <img
                                        src={`/Images/${paragraph.media.images}`}
                                        alt="Image"
                                        className="my-4 rounded-lg shadow-lg"
                                    />
                                )}

                                {paragraph.media.videos && (
                                    <video controls className="my-4 rounded-lg shadow-lg">
                                        <source
                                            src={`/Videos/${paragraph.media.videos}`}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ))}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">Comments</h2>
                            <form onSubmit={handleSubmitComment}>
                                <textarea
                                    value={commentText}
                                    onChange={handleCommentChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    placeholder="Write your comment here..."
                                    required
                                />
                                <button
                                    type="submit"
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                >
                                    Add Comment
                                </button>
                            </form>
                            <div className="mt-4">
                                {fetchComments && fetchComments.map(comment => (
                                    <CommentItem
                                        key={comment._id}
                                        comment={comment}
                                        loggedIn={loggedIn}
                                        currentUserId={currentUserId}
                                        handleEditComment={handleEditComment}
                                        handleReply={handleReply}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
};

const CommentItem = ({ comment, loggedIn, currentUserId, handleEditComment, handleReply }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedText, setEditedText] = useState(comment.commentText);
    const [replyText, setReplyText] = useState("");

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setEditedText(comment.commentText); // Reset edited text to original comment text when exiting edit mode
    };

    const handleSaveEdit = () => {
        handleEditComment(comment._id, editedText);
        setEditMode(false);
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        handleReply(comment._id, replyText);
        setReplyText(""); // Clear reply text field after submission
    };

    return (
        <div className="bg-gray-200 p-2 rounded-lg mb-2">
            {editMode ? (
                <>
                    <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                        onClick={handleSaveEdit}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={toggleEditMode}
                        className="mt-2 ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <p>{comment.commentText}</p>
                    <p className="text-gray-500 text-sm">
                        Posted by {comment.userId.userName} on {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    {loggedIn && currentUserId === comment.userId._id && (
                        <>
                            <button onClick={toggleEditMode} className="text-blue-500 underline mr-2">
                                Edit
                            </button>
                        </>
                    )}
                    <form onSubmit={handleReplySubmit}>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Write your reply here..."
                            required
                        />
                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        >
                            Reply
                        </button>
                    </form>
                </>
            )}

            {/* Render replies recursively */}
            {comment.replies && comment.replies.map(reply => (
                <CommentItem
                    key={reply._id}
                    comment={reply}
                    loggedIn={loggedIn}
                    currentUserId={currentUserId}
                    handleEditComment={handleEditComment}
                    handleReply={handleReply}
                />
            ))}
        </div>
    );
};

export default BlogPage;
