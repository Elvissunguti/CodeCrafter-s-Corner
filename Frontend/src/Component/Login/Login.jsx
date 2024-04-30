import React, { useState } from "react";
import { makeUnauthenticatedPOSTRequest } from "../Utils/Helpers";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import codeCraftersLogo from "../../Assets/Logo/logo-transparent.png";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    passWord: ""
  });

  const [loginError, setLoginError] = useState("");

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Reset login error when user starts typing
    setLoginError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await makeUnauthenticatedPOSTRequest("/auth/login", formData);
        if (response.success) {
            // Set token in cookie
            const token = response.token;
            Cookies.set("token", token, { expires: 7 });

            handleLogin();

            // Redirect user to desired page
            navigate("/blog");
        } else {
            setLoginError(response.message);
        }
    } catch (error) {
        console.error("Error logging in:", error);
        setLoginError("Error logging in. Please try again later.");
    }
};





  const handleGoogleLogin = () => {
    // Redirect to the Google login route
    window.location.href = "https://us-central1-codecrafter-s-corner.cloudfunctions.net/api/auth/google";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <div className="flex items-center justify-center mb-3">
          <img
            src={codeCraftersLogo}
            alt="CodeCrafters Logo"
            className="w- h-20"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full mt-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your email"
            />
          </div>
          <div>
            <label htmlFor="passWord" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="passWord"
              name="passWord"
              value={formData.passWord}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full mt-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your password"
            />
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
            Login
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Login with Google
        </button>
        <Link to="/signup" >
          <p className="mt-4">Don't have an account? <span className="text-red-500 ">Sign up!</span></p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
