import React, { useState } from "react";
import "./Login.css";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const backendUrl = "http://localhost:4000";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      // Add login logic here
      // console.log(email, password);

      const response = await Axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      console.log(response);

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="admin-panel-container">
        <div className="admin-panel-box">
          <h1 className="login-title">Admin Panel</h1>
          <form onSubmit={onSubmitHandler}>
            <div className="form-group">
              <p className="form-label">Email Address</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email "
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <p className="form-label">Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="form-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
