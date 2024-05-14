import React, { useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedMulterPostRequest } from "../Utils/Helpers";
import Footer from "../Footer/Footer";

const UploadBlog = () => {
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [paragraphs, setParagraphs] = useState([{ content: "", media: null, mediaPreview: null }]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("thumbnail", thumbnail);

            paragraphs.forEach((paragraph, index) => {
                formData.append("content", JSON.stringify(paragraph));
                if (paragraph.media) {
                    formData.append("media", paragraph.media);
                }
            });

            const response = await makeAuthenticatedMulterPostRequest('/blog/create', formData, {
                onUploadProgress: (progress) => {
                    setUploadProgress(progress);
                    if (progress === 100) {
                        setShowSuccessPopup(true);
                    }
                }
            });

            if (response.error) {
                console.error("Error creating blog:", response.error);
            } else {
                setShowSuccessPopup(true);
                setUploadProgress(0);
            }

        } catch (error) {
            console.error("Error creating blog:", error);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleParagraphChange = (index, value) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index].content = value;
        setParagraphs(newParagraphs);
    };

    const handleMediaChange = (index, media) => {
        const file = media[0];
        const newParagraphs = [...paragraphs];
        newParagraphs[index].media = file;
        newParagraphs[index].mediaPreview = URL.createObjectURL(file);
        setParagraphs(newParagraphs);
    };

    const addParagraph = () => {
        setParagraphs((prevParagraphs) => [...prevParagraphs, { content: "", media: null, mediaPreview: null }]);
    };

    const removeParagraph = (index) => {
        setParagraphs((prevParagraphs) => {
            const newParagraphs = [...prevParagraphs];
            newParagraphs.splice(index, 1);
            return newParagraphs;
        });
    };

    const handleOkButtonClick = () => {
        setShowSuccessPopup(false);
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <NavBar />
            <section className="flex-grow">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Create a New Blog</h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Title:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Thumbnail:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="focus:outline-none"
                                required
                            />
                            {thumbnailPreview && (
                                <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 w-full h-32 object-cover rounded-md" />
                            )}
                        </div>
                        {paragraphs.map((paragraph, index) => (
                            <div key={index} className="mb-4">
                                <label className="block text-sm font-medium mb-2">{`Paragraph ${index + 1}:`}</label>
                                <textarea
                                    value={paragraph.content}
                                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                    required
                                />
                                <input
                                    type="file"
                                    name="media"
                                    accept="image/*,video/*"
                                    onChange={(e) => handleMediaChange(index, e.target.files)}
                                    className="focus:outline-none"
                                />
                                {paragraph.media && (
                                    <div className="mt-2">
                                        {paragraph.media.type.startsWith("image/") ? (
                                            <img src={paragraph.mediaPreview} alt="Media Preview" className="w-full h-32 object-cover rounded-md" />
                                        ) : (
                                            <video src={paragraph.mediaPreview} controls className="w-full h-32 object-cover rounded-md" />
                                        )}
                                    </div>
                                )}
                                <button type="button" onClick={() => removeParagraph(index)} className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md">Remove Paragraph</button>
                            </div>
                        ))}
                        <button type="button" onClick={addParagraph} className="mb-4 px-3 py-1 bg-green-500 text-white rounded-md">Add Paragraph</button>
                        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
                        <button type="submit" className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Submit</button>
                    </form>
                    {showSuccessPopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                            <div className="bg-white rounded-md p-6">
                                {uploadProgress < 100 ? (
                                    <div>
                                        <p className="mb-4">Uploading... {uploadProgress}%</p>
                                        <progress value={uploadProgress} max="100" className="w-full"></progress>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="mb-4">Blog uploaded successfully!</p>
                                        <button onClick={handleOkButtonClick} className="px-4 py-2 bg-blue-500 text-white rounded-md">OK</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default UploadBlog;
