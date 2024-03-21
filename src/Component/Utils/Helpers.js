import {backendUrl} from "./Config";

export const makeUnauthenticatedPOSTRequest = async (route, body) => {
    const response = await fetch(backendUrl + route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedPOSTRequest = async (route, body) => {
    const token = getToken();
    const response = await fetch(backendUrl + route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

// Updated makeAuthenticatedMulterPostRequest function with upload progress tracking
export const makeAuthenticatedMulterPostRequest = async (route, formData, options = {}) => {
    try {
        const token = getToken();
        const response = await fetch(backendUrl + route, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            ...options // Include additional options
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const { onUploadProgress } = options;
        if (onUploadProgress && typeof onUploadProgress === 'function') {
            const contentLength = parseInt(response.headers.get('Content-Length'));
            const reader = response.body.getReader();
            let bytesUploaded = 0;

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                bytesUploaded += value.length;
                const progress = Math.round((bytesUploaded / contentLength) * 100);
                onUploadProgress(progress);
            }
        }

        const formattedResponse = await response.json();
        return formattedResponse;
    } catch (error) {
        console.error("Request error:", error);
        if (error instanceof TypeError) {
            console.log("Response does not contain a body to extract");
        } else {
            const responseText = await error.text(); // Capture the error response text
            console.log("Response text:", responseText); // Log the error response
        }
        return { error: "Request failed" };
    }
};


export const makeUnauthenticatedGETRequest = async (route) => {
    const response = await fetch(backendUrl + route, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedGETRequest = async (route) => {
    const token = getToken();
    const response = await fetch(backendUrl + route, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedPUTRequest = async (route, body) => {
    const token = getToken();
    const response = await fetch(backendUrl + route, {
        method : "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    });
    const formattedResponse = await response.json();
    return formattedResponse;
};

export const makeAuthenticatedDELETERequest = async (route) => {
    const token = getToken();
    try {
        const response = await fetch(backendUrl + route, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        return { message: "DELETE request successful" };
    } catch (error) {
        console.error("Request error:", error);
        const responseText = await error.text(); 
        console.log("Response text:", responseText);
        return { error: "Request failed" };
    }
};


const getToken = () => {
    const accessToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
    );
    return accessToken;
};