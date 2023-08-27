import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ userName, handleSignOut }) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src="/path/to/home-icon.png" alt="Home" />
        </Link>
      </div>
      <div className="navbar-middle">
        <Link to="/receiving">Receiving</Link>
        <Link to="/inventory">Inventory Management</Link>
        <Link to="/outbound">Outbound</Link>
      </div>
      <div className="navbar-right">
        <span>Welcome, {userName}</span>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default Navbar;