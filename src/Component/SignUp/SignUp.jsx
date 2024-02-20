import React, { useState } from "react";
import {  makeUnauthenticatedPOSTRequest } from "../Utils/Helpers";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    passWord: "",
    confirmPassword: ""
  });

  const [passwordError, setPasswordError] = useState("");

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.passWord !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try{
        const response = await makeUnauthenticatedPOSTRequest(
            "/auth/signup", formData
        );
        if(response.message === "User created successfully"){
            const token = response.token;
            Cookies.set("token", token, { expires: 7 });
            // user logged in successfull

            navigate("/");
            console.log("User Signed up successfully");
        } else {
            console.log("Error creating a new user");
        }

    } catch (error){
        console.error("Error signing up new User:", error);
    }
  };

  return (
    <div>
      <h2 className="flex items-center justify-center text-xl">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label htmlFor="passWord">Password:</label>
          <input
            type="password"
            id="passWord"
            name="passWord"
            value={formData.passWord}
            onChange={handleChange}
            className=""
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className=""
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
