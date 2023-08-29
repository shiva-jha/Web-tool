import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";

function Navbar() {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const [showAsnDropdown, setShowAsnDropdown] = useState(false);

  const handleReceivingClick = () => {
    setShowAsnDropdown(!showAsnDropdown);
  };

  const handleOptionSubmit = () => {
    navigate("/ASN"); // Redirect to the "ASN" page
  };

  const authenticated = localStorage.getItem("authenticated") === "true";

  return (
    <div>
      {authenticated && (
        <div className="navbar">
          <div className="navbar-left">
            <Link to="/">
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </div>
          <div className="navbar-middle">
            <div className="receiving-dropdown">
              <Link
                to="/receiving"
                onClick={handleReceivingClick}
                className={showAsnDropdown ? "active" : ""}
              >
                Receiving
              </Link>
              {showAsnDropdown && (
                <div className="dropdown-content">
                  <Link to="/ASN" onClick={handleOptionSubmit}>
                    ASN
                  </Link>
                  {/* Add more dropdown options here if needed */}
                </div>
              )}
            </div>
            <Link to="/inventory">Inventory Management</Link>
            <Link to="/outbound">Outbound</Link>
          </div>
          <div className="navbar-right">
            <span>Welcome, {userName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;