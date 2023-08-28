import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css"; // Import the CSS file you created

const SignIn = ({ handleSignIn, users }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = () => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      handleSignIn(user);
      navigate("/");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="form-container sign-in-container">
      <h2 className="form-title">Sign In</h2>
      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="form-button" onClick={handleSignin}>
        Sign In
      </button>
      <Link to="/signup" className="form-link">
        Don't have an account? Sign up
      </Link>
    </div>
  );
};

export default SignIn;
