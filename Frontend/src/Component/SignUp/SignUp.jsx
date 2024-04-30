import React, { useState } from "react";
import { makeUnauthenticatedPOSTRequest } from "../Utils/Helpers";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import codeCraftersLogo from "../../Assets/Logo/logo-transparent.png";
import { useAuth } from "../Context/AuthContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    passWord: "",
    confirmPassword: ""
  });

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear password error when user starts typing in the confirm password field
    if (name === "confirmPassword") {
      setPasswordError("");
    }

    // Clear email error when user starts typing in the email field
    if (name === "email") {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.passWord !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await makeUnauthenticatedPOSTRequest(
        "/auth/signup",
        formData
      );
      if (response.message === "User created successfully") {
        const token = response.token;
        Cookies.set("token", token, { expires: 7 });
        handleLogin();
        navigate("/Blog");
        console.log("User Signed up successfully");
      } else {
        console.log("Error creating a new user");
      }
    } catch (error) {
      console.error("Error signing up new User:", error);
    }
  };

  // Function to handle Google sign up
  const handleGoogleSignUp = () => {
    // Redirect user to Google sign up route
    window.location.href = "https://us-central1-codecrafter-s-corner.cloudfunctions.net/api/auth/google";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <div className="flex items-center justify-center mb-4">
          <img 
            src={codeCraftersLogo} 
            alt="CodeCrafters Logo" 
            className=" h-20" />
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full mt-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full mt-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
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
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full mt-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        
        <button
          onClick={handleGoogleSignUp}
          className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Sign Up with Google
        </button>
        
        <Link to="/login">
          <p className="mt-4">If you already have an account, <span className="text-red-500">Login</span></p>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
