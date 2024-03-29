import React from "react";
import NavBar from "../Home/NavBar";
import Footer from "../Footer/Footer";

const Resources = () => {
    return (
        <section className="bg-gray-100 flex flex-col min-h-screen">
            <NavBar />
            <div className="max-w-4xl flex-1 mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Useful Coding Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Resource Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutorial: Building a CRUD App with MERN Stack</h3>
                        <p className="text-gray-700 mb-4">Learn how to build a full-stack web application using the MERN (MongoDB, Express.js, React, Node.js) stack.</p>
                        <a href="https://www.freecodecamp.org/news/building-a-crud-application-with-mern-stack/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Article: Best Practices for Responsive Web Design</h3>
                        <p className="text-gray-700 mb-4">Discover essential tips and techniques for creating responsive and mobile-friendly websites.</p>
                        <a href="https://www.smashingmagazine.com/2019/06/responsive-web-design-articles-tutorials/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tool: VS Code Extensions for Web Developers</h3>
                        <p className="text-gray-700 mb-4">Explore a curated list of Visual Studio Code extensions that can boost your productivity as a web developer.</p>
                        <a href="https://code.visualstudio.com/docs/editor/extension-gallery" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Add more resource cards as needed */}
                    {/* Resource Card 4 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutorial: Introduction to React Router</h3>
                        <p className="text-gray-700 mb-4">Learn how to implement client-side routing in your React applications using React Router.</p>
                        <a href="https://reactrouter.com/web/guides/quick-start" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 5 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Article: Best Practices for JavaScript Development</h3>
                        <p className="text-gray-700 mb-4">Discover best practices and coding conventions for writing clean and maintainable JavaScript code.</p>
                        <a href="https://www.toptal.com/javascript/tips-and-practices" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 6 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tool: Chrome DevTools Guide</h3>
                        <p className="text-gray-700 mb-4">Learn how to effectively use Chrome DevTools for debugging and optimizing your web applications.</p>
                        <a href="https://developers.google.com/web/tools/chrome-devtools" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 7 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutorial: Getting Started with Node.js</h3>
                        <p className="text-gray-700 mb-4">Learn the basics of Node.js and how to build server-side applications with JavaScript.</p>
                        <a href="https://www.w3schools.com/nodejs/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 8 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Article: Essential Git Commands Every Developer Should Know</h3>
                        <p className="text-gray-700 mb-4">Discover useful Git commands for version control and collaboration in software development projects.</p>
                        <a href="https://www.freecodecamp.org/news/git-commands-explained/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 9 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tool: Bootstrap Documentation</h3>
                        <p className="text-gray-700 mb-4">Explore the official documentation for Bootstrap to learn how to create responsive and mobile-first websites.</p>
                        <a href="https://getbootstrap.com/docs/5.1/getting-started/introduction/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 10 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutorial: Introduction to Python Programming</h3>
                        <p className="text-gray-700 mb-4">Learn the fundamentals of Python programming language and start building your own applications.</p>
                        <a href="https://www.programiz.com/python-programming" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 11 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Article: Introduction to Data Structures and Algorithms</h3>
                        <p className="text-gray-700 mb-4">Understand the basics of data structures and algorithms to write efficient and scalable code.</p>
                        <a href="https://www.geeksforgeeks.org/data-structures/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 12 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tool: Postman Documentation</h3>
                        <p className="text-gray-700 mb-4">Explore the official documentation for Postman to learn how to test and debug APIs.</p>
                        <a href="https://learning.postman.com/docs/getting-started/introduction/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 13 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutorial: Getting Started with Angular</h3>
                        <p className="text-gray-700 mb-4">Learn the basics of Angular framework and start building dynamic web applications.</p>
                        <a href="https://angular.io/start" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 14 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Article: Introduction to Docker</h3>
                        <p className="text-gray-700 mb-4">Discover what Docker is and how it can simplify the process of deploying and managing applications.</p>
                        <a href="https://www.docker.com/resources/what-container" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 15 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tool: Git Documentation</h3>
                        <p className="text-gray-700 mb-4">Explore the official documentation for Git version control system to learn its commands and workflows.</p>
                        <a href="https://git-scm.com/doc" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 16 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutorial: Introduction to TypeScript</h3>
                        <p className="text-gray-700 mb-4">Learn how to use TypeScript to write safer and more scalable JavaScript code.</p>
                        <a href="https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 17 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Article: Web Security Best Practices</h3>
                        <p className="text-gray-700 mb-4">Learn essential security practices to protect your web applications from common vulnerabilities.</p>
                        <a href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 18 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tool: GitHub Documentation</h3>
                        <p className="text-gray-700 mb-4">Explore the official documentation for GitHub to learn how to collaborate and manage your code projects.</p>
                        <a href="https://docs.github.com/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 19 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tutorial: Introduction to GraphQL</h3>
                        <p className="text-gray-700 mb-4">Learn how to use GraphQL to fetch and manipulate data efficiently in your applications.</p>
                        <a href="https://graphql.org/learn/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                    {/* Resource Card 20 */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Article: Continuous Integration and Continuous Deployment (CI/CD) Basics</h3>
                        <p className="text-gray-700 mb-4">Understand the principles of CI/CD and how to implement automated build and deployment pipelines.</p>
                        <a href="https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read More</a>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default Resources;
