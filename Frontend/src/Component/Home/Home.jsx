import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../Home/NavBar";
import Footer from "../Footer/Footer";
import homeBg from "../../Assets/Images/prog_bg2.avif";
import { makeUnauthenticatedGETRequest } from "../Utils/Helpers";

const Home = () => {
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await makeUnauthenticatedGETRequest("/blog/publicblog");
                const blogs = response.data;
                const randomIndexes = getRandomIndexes(blogs.length, 3);
                const randomBlogs = randomIndexes.map(index => blogs[index]);
                setFeaturedBlogs(randomBlogs);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blogs from the server:", error);
                setError("Error fetching blogs. Please try again later.");
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Function to generate unique random indexes
    const getRandomIndexes = (max, count) => {
        const indexes = [];
        while (indexes.length < count) {
            const randomIndex = Math.floor(Math.random() * max);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    };

    const processImageUrl = (image) => {
        const imageFilename = image.split("/").pop();
        return `/Images/${imageFilename}`;
    };

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return content.split(" ").slice(0, maxLength).join(" ") + "...";
    };

    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <header className="bg-cover bg-center relative py-20" style={{ backgroundImage: `url(${homeBg})` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="container mx-auto text-white text-center relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Welcome to CodeCrafter's Corner</h1>
                    <p className="text-lg mb-8">Your destination for insightful articles, resources, and discussions on programming.</p>
                    <Link to="/blog" className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-full hover:bg-blue-600 hover:text-white">Explore Blog</Link>
                </div>
            </header>
            <section className="container mx-auto py-12">
                <h2 className="text-2xl font-semibold mb-6 text-center">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && (
                        <div className="flex justify-center items-center align-center  mt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>
                 )}
                    {error && <p>{error}</p>}
                    {featuredBlogs.map((blog, index) => (
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
            <section className="bg-gray-800 text-white py-16">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                    <p className="text-lg mb-8">Connect with fellow developers, share your knowledge, and stay updated with the latest trends in programming.</p>
                    <Link to="/community" className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-600 hover:text-white">Join Now</Link>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
