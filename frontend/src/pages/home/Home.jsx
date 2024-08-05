import React, { useState } from "react";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../context/api/userApi";
import "./home.scss";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery(); // Add refetch to your query hook
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  console.log(users);

  const [editUser, setEditUser] = useState(null);

  const handleUpdateUser = (id) => {
    const { _id, __v, createdAt, updatedAt, ...userData } = editUser;
    updateUser({ id, user: userData }).then(() => {
      setEditUser(null);
      refetch();
    });
  };

  const handleDeleteUser = (id) => {
    deleteUser(id).then(() => {
      refetch();
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        Login qilib kirishni unutmang{" "}
        <li style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          <Link style={{ fontSize: "20px", color: "blue" }} to="/login">
            Login
          </Link>
          <Link style={{ fontSize: "20px", color: "blue" }} to={"/register"}>
            Register
          </Link>
        </li>
      </p>
    );

  return (
    <div className="user-management-container">
      <h1>User Management</h1>
      <li style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Link style={{ fontSize: "20px", color: "blue" }} to="/login">
          Login
        </Link>
        <Link style={{ fontSize: "20px", color: "blue" }} to={"/register"}>
          Register
        </Link>
      </li>

      {editUser && (
        <div className="user-form">
          <input
            type="text"
            name="username"
            value={editUser.username}
            onChange={handleEditChange}
            placeholder="Username"
          />
          <input
            type="password"
            name="password"
            value={editUser.password}
            onChange={handleEditChange}
            placeholder="Password"
          />
          <input
            type="text"
            name="fname"
            value={editUser.fname}
            onChange={handleEditChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lname"
            value={editUser.lname}
            onChange={handleEditChange}
            placeholder="Last Name"
          />
          <input
            type="number"
            name="age"
            value={editUser.age}
            onChange={handleEditChange}
            placeholder="Age"
          />
          <input
            type="text"
            name="gender"
            value={editUser.gender}
            onChange={handleEditChange}
            placeholder="Gender"
          />
          <input
            type="number"
            name="budget"
            value={editUser.budget}
            onChange={handleEditChange}
            placeholder="Budget"
          />
          <button onClick={() => handleUpdateUser(editUser._id)}>Update</button>
          <button
            style={{ marginLeft: "10px", backgroundColor: "red" }}
            onClick={() => setEditUser(null)}
          >
            Cancel
          </button>
        </div>
      )}

      <h2>Users List</h2>
      <div className="user-list">
        <ul>
          {users?.payload?.map((user) => (
            <li key={user._id}>
              {user.username}
              <button onClick={() => setEditUser(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
