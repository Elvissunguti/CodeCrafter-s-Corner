import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedPOSTRequest, makeUnauthenticatedGETRequest } from "../Utils/Helpers";
import { useNavigate, useParams } from "react-router-dom";

const BlogPage = ({ loggedIn }) => {

    const { blogId } = useParams();
    const [ blog, setBlog ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ commentText, setCommentText ] = useState("");
    const [ fetchComments, setFetchComments ] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchBlog = async () => {
            try{
                const response = await makeUnauthenticatedGETRequest(
                    `/blog/fetch/${blogId}`
                );
                 setBlog(response.data);
                 setLoading(false);
            } catch (error){
                setError("Error fetching the blog");
                console.error("Error fetching the blog", error);
                setLoading(false);
            }
            
        }
        fetchBlog();
    }, [blogId]);

    useEffect(() => {
        const fetchComment = async () => {
            try{
                const response = await makeUnauthenticatedGETRequest(
                    `/comment/fetch/${blogId}`
                );

                setFetchComments(response.data);

            } catch(error){
                console.error("Error fetching comments in a blog", error);
            }
        }
        fetchComment();
    }, [blogId]);


    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try{
            if(!loggedIn){
                navigate("/login")
                return;
            }

            await makeAuthenticatedPOSTRequest(
                `/comment/create/${blogId}`, { commentText }
            )

        } catch (error){
            console.error("Error submitting comments", error);
        }
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const processImageUrl = (image) => {
        const imageFilename = image.split("/").pop();
        return `/Images/${imageFilename}`;
    };

    const processVideoUrl = (video) => {
        const videoFilename = video.split("/").pop();
        return `/Videos/${videoFilename}`;
    };

    return(
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
                            <img src={processImageUrl(blog.thumbnail)} alt="Thumbnail" className="mb-4 rounded-lg shadow-lg" />
                        )}

                        {blog.paragraphs.map((paragraph, index) => (
                            <div key={index} className="mb-4">
                                <p className="text-lg">{paragraph.content}</p>

                                {paragraph.media.images && (
                                    <img
                                        src={processImageUrl(paragraph.media.images)}
                                        alt="Image"
                                        className="my-4 rounded-lg shadow-lg"
                                    />
                                )}

                                {paragraph.media.videos && (
                                    <video controls className="my-4 rounded-lg shadow-lg">
                                        <source
                                            src={processVideoUrl(paragraph.media.videos)}
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
                                {fetchComments.map((comment, index) => (
                                    <div key={index} className="bg-gray-200 p-2 rounded-lg mb-2">
                                        <p>{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
};

export default BlogPage;