import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css"; // Import the CSS file you created

const SignUp = ({ users }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Simulate adding a new user to the dummyUsers array
    users.push({ id: users.length + 1, username, password });
    alert("Signup successful! Now you can sign in.");
    navigate("/");
  };

  return (
    <div className="form-container sign-up-container">
      <h2 className="form-title">Sign Up</h2>
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
      <button className="form-button" onClick={handleSignUp}>Sign Up</button>
      <Link to="/" className="form-link">Already have an account? Sign in</Link>
    </div>
  );
};

export default SignUp;