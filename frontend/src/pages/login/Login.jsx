import React, { useState } from "react";
import { useLoginMutation } from "../../context/api/userApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./login.scss";

const Login = () => {
  const [login, { error, isLoading }] = useLoginMutation();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      if (response.data) {
        localStorage.setItem("x-auth-token", response.data.payload.token);
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <Link to={"/"}>Back to home</Link>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            Login
          </button>
          <a href="/register">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
