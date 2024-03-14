import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeUnauthenticatedGETRequest } from "../Utils/Helpers";


const Blog = () => {

    const [ blogPosts, setBlogPosts ] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeUnauthenticatedGETRequest(
                    "/blog/publicblog"
                );

                setBlogPosts(response.data);
                setLoading(false);

            } catch(error){
                console.error("Error fetching blogs from the server:", error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    // Function to truncate the content to a certain number of words
    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
         return content.split(' ').slice(0, maxLength).join(' ') + '...';
    };


        // Function to process image URLs
    const processImageUrl = (image) => {
        const imageFilename = image.split("\\").pop();
        return `/Images/${imageFilename}`;
    };

    
    return (
        <section>
            <NavBar />
            <div>
            {loading && <p>Loading...</p>}
            {!loading && blogPosts.length === 0 && <p>No blogs to display</p>}
            {blogPosts.map((blog, index) => (
                    <div key={index} className="blog-summary">
                        <h2>{blog.title}</h2> 
                        <h2>{blog.userName}</h2>
                        <p>{truncateContent(blog.content, 30)}</p> 
                        <div className="image-container">
                            {blog.images.length > 0 && (
                                <img
                                   src={processImageUrl(blog.images[0])}
                                   alt='Image'
                                   className="blog-image" />
                            )}
                        </div>
                    </div>
                ))}

            </div>
        </section>
    )
}
export default Blog;