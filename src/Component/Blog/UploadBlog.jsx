import React, { useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedMulterPostRequest } from "../Utils/Helpers";

const UploadBlog = () => {
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [paragraphs, setParagraphs] = useState([{ content: "", media: null }]);

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

            console.log("Data being sent to the backend:", formData);

            const response = await makeAuthenticatedMulterPostRequest('/blog/create', formData);
            console.log("Response from backend:", response);

            if (response.error) {
                console.error("Error creating blog:", response.error);
                // Handle error message from backend
            } else {
                console.log("Blog created successfully:", response.message);
                setTitle("");
                setThumbnail(null);
                setParagraphs([{ content: "", media: null }]);
            }

        } catch (error) {
            console.error("Error creating blog:", error);
        }
    };

    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleParagraphChange = (index, value) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index].content = value;
        setParagraphs(newParagraphs);
    };

    const handleMediaChange = (index, media) => {
        console.log("Selected media file:", media);
        const newParagraphs = [...paragraphs];
        newParagraphs[index].media = media[0];
        setParagraphs(newParagraphs);
    };

    const addParagraph = () => {
        setParagraphs((prevParagraphs) => [...prevParagraphs, { content: "", media: null }]);
    };

    const removeParagraph = (index) => {
        setParagraphs((prevParagraphs) => {
            const newParagraphs = [...prevParagraphs];
            newParagraphs.splice(index, 1);
            return newParagraphs;
        });
    };

    return (
        <section>
            <NavBar />
            <div>
                <h2>Create a new Blog</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Thumbnail:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            required
                        />
                    </div>
                    {paragraphs.map((paragraph, index) => (
                        <div key={index}>
                            <label>{`Paragraph ${index + 1}:`}</label>
                            <textarea
                                value={paragraph.content}
                                onChange={(e) => handleParagraphChange(index, e.target.value)}
                                required
                            />
                            <input
                                type="file"
                                name="media"
                                accept="image/*,video/*"
                                onChange={(e) => handleMediaChange(index, e.target.files)}
                            />
                            <button type="button" onClick={() => removeParagraph(index)}>Remove Paragraph</button>
                        </div>
                    ))}
                    <button type="button" onClick={addParagraph}>Add Paragraph</button>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </section>
    );
};

export default UploadBlog;
