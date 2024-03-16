import React, { useState } from "react";
import { makeUnauthenticatedPOSTRequest } from "../Utils/Helpers";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    passWord: ""
  });

  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await makeUnauthenticatedPOSTRequest("/auth/login", formData);
      
      if (response.message === "User logged in successfully") {
        const  token  = response.token;
        Cookies.set("token", token, { expires: 7 });
        onLogin();
        navigate("/");
      } else {
        setLoginError(response.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError("Error logging in. Please try again later.");
    }
  };

  return (
    <div>
      <h2 className="flex items-center justify-center text-xl">Login</h2>
      <form onSubmit={handleSubmit}>
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
        {loginError && <p className="text-red-500">{loginError}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
