import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeUnauthenticatedGETRequest } from "../Utils/Helpers";
import { useParams } from "react-router-dom";

const BlogPage = () => {

    const { blogId } = useParams();
    const [ blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try{
                const response = await makeUnauthenticatedGETRequest(
                    `/blog/fetch/${blogId}`
                );
                 setBlog(response.data)
            } catch (error){
                console.error("Error fetching the blog", error);
            }
            
        }
        fetchBlog()
    }, [])

    const processImageUrl = (image) => {
        const imageFilename = image.split("/").pop();
        return `/Images/${imageFilename}`;
    };

    const processVideoUrl = (video) => {
        const videoFilename = video.split("/").pop();
        return `/Videos/${videoFilename}`;
    };

    return(
        <section>
            <NavBar />
            <div>
            {blog && (
                    <>
                        <h1>{blog.title}</h1>
                        <p>Author: {blog.userName}</p>

                        {blog.thumbnail && 
                        <img 
                          src={processImageUrl(blog.thumbnail)} 
                          alt="Thumbnail" 
                          />
                          }

                        {blog.paragraphs.map((paragraph, index) => (
                            <div key={index}>
                                <p>{paragraph.content}</p>

                                {paragraph.media.images &&
                                 <img
                                  src={processImageUrl(paragraph.media.images)}
                                   alt="Image" 
                                   />
                                }

                                {paragraph.media.videos && (
                                    <video controls>
                                        <source src={processVideoUrl(paragraph.media.videos)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ))}
                    </>
                )}

            </div>
        </section>
    )
};

export default BlogPage;