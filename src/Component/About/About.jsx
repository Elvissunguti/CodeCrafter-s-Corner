import React from "react";
import NavBar from "../Home/NavBar";
import Footer from "../Footer/Footer";

const About = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <section className="flex-grow bg-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to CodeCrafters</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        CodeCrafters is a blog dedicated to empowering developers with insights and resources to excel in their coding journey. Whether you're a seasoned coder or just starting out, we're here to guide you through the world of coding and help you craft your skills.
                    </p>
                    <p className="text-lg text-gray-700 mb-6">
                        Our team is comprised of passionate developers and educators who are committed to sharing their knowledge and expertise with the community. From tutorials on the latest technologies to tips for improving your coding efficiency, we cover a wide range of topics to support your growth as a developer.
                    </p>
                    <p className="text-lg text-gray-700 mb-6">
                        Join us as we explore the endless possibilities of coding and inspire each other to reach new heights. Whether you're interested in web development, mobile app development, or machine learning, CodeCrafters is your go-to resource for all things coding.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">About the Author</h3>
                    <p className="text-lg text-gray-700 mb-6">
                        Hi, I'm Elvis Sunguti, the founder and primary author of CodeCrafters. With over 5 years of experience in web development using the MERN stack, I'm passionate about creating impactful projects and sharing my knowledge with others.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Mission</h3>
                    <p className="text-lg text-gray-700 mb-6">
                        Our mission at CodeCrafters is to provide developers with the tools and resources they need to succeed in their coding journey. We believe that by fostering a supportive community and sharing valuable insights, we can empower developers to build amazing things and make a positive impact in the world.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Who We Serve</h3>
                    <p className="text-lg text-gray-700 mb-6">
                        CodeCrafters is designed for coding enthusiasts of all levels, from beginners to experienced professionals. Whether you're a frontend developer, backend developer, or full-stack developer, our content is tailored to help you enhance your skills and stay updated on the latest trends in the industry.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">What We Cover</h3>
                    <p className="text-lg text-gray-700 mb-6">
                        On CodeCrafters, you'll find a variety of articles, tutorials, and resources covering topics such as web development, mobile app development, cloud computing, and more. Whether you're interested in learning a new programming language, exploring advanced coding techniques, or staying updated on industry news, we've got you covered.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Involved</h3>
                    <p className="text-lg text-gray-700 mb-6">
                        We encourage you to explore our blog and engage with our content. Follow us on social media to stay updated on the latest articles and community events. If you have any questions, feedback, or suggestions for future topics, feel free to reach out to us – we'd love to hear from you!
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Join Our Community</h3>
                    <p className="text-lg text-gray-700 mb-6">
                        Connect with us on social media and join our community of developers. Whether you're looking to collaborate on projects, share your insights, or simply connect with like-minded individuals, CodeCrafters is the place to be. We look forward to welcoming you to our community!
                    </p>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default About;
