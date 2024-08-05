import React, { useState } from "react";
import { useRegisterMutation } from "../../context/api/userApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./register.scss";

const Register = () => {
  const [register, { error, isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fname: "",
    lname: "",
    age: "",
    gender: "",
    budget: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      if (response.data) {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <Link to={"/"}>Back to home</Link>

      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
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
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fname">First Name</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            placeholder="First Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
          />
        </div>
        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            Register
          </button>
          <a href="/login">Already have an account? Login</a>
        </div>
      </form>
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
};

export default Register;
