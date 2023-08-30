import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";

function Navbar() {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const [showReceivingDropdown, setShowReceivingDropdown] = useState(false);
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false);
  const [showOutboundDropdown, setShowOutboundDropdown] = useState(false);

  useEffect(() => {
    setShowReceivingDropdown(false);
    setShowInventoryDropdown(false);
    setShowOutboundDropdown(false);
  }, []);

  const handleDropdownClick = (dropdownName) => {
    if (dropdownName === "receiving") {
      setShowReceivingDropdown(!showReceivingDropdown);
    } else if (dropdownName === "inventory") {
      setShowInventoryDropdown(!showInventoryDropdown);
    } else if (dropdownName === "outbound") {
      setShowOutboundDropdown(!showOutboundDropdown);
    }
  };

  const handleOptionSubmit = (path) => {
    navigate(path);
    setShowReceivingDropdown(false);
    setShowInventoryDropdown(false);
    setShowOutboundDropdown(false);
  };

  const authenticated = localStorage.getItem("authenticated") === "true";

  const handleSignOut = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("jwtToken");
    navigate("/Login");
  };

  const handleHomeClick = () => {
    setShowReceivingDropdown(false);
    setShowInventoryDropdown(false);
    setShowOutboundDropdown(false);
  };

  return (
    <div>
      {authenticated && (
        <div className="navbar">
          <div className="navbar-left">
            <Link to="/" onClick={handleHomeClick}>
            <FontAwesomeIcon icon={faHome} className="home-icon" />
            </Link>
          </div>
          <div className="navbar-middle">
            <div className="dropdown-section">
              <Link
                to="/receiving"
                onClick={() => handleDropdownClick("receiving")}
                className={showReceivingDropdown ? "active" : ""}
              >
                Receiving
              </Link>
              {showReceivingDropdown && (
                <div className="dropdown-content">
                  <Link to="/ASN" onClick={() => handleOptionSubmit("/ASN")}>
                    ASN
                  </Link>
                  {/* Add more dropdown options for "Receiving" */}
                </div>
              )}
            </div>
            <div className="dropdown-section">
              <Link
                to="/inventory"
                onClick={() => handleDropdownClick("inventory")}
                className={showInventoryDropdown ? "active" : ""}
              >
                Inventory Management
              </Link>
              {showInventoryDropdown && (
                <div className="dropdown-content">
                  <Link to="/ToteInConsumed" onClick={() => handleOptionSubmit("/ToteInConsumed")}>
                    Tote In Consumed
                  </Link>
                  <Link to="/ToteInAllocAndPulled" onClick={() => handleOptionSubmit("/ToteInAllocAndPulled")}>
                    Tote In Alloc and Pulled
                  </Link>
                  {/* Add more dropdown options for "Inventory Management" */}
                </div>
              )}
            </div>
            <div className="dropdown-section">
              <Link
                to="/outbound"
                onClick={() => handleDropdownClick("outbound")}
                className={showOutboundDropdown ? "active" : ""}
              >
                Outbound
              </Link>
              {showOutboundDropdown && (
                <div className="dropdown-content">
                  <Link to="/OlpnInPacking" onClick={() => handleOptionSubmit("/OlpnInPacking")}>
                    OLPN In Packing
                  </Link>
                  <Link to="/TaskInAssigned" onClick={() => handleOptionSubmit("/TaskInAssigned")}>
                    Task In Assigned
                  </Link>
                  {/* Add more dropdown options for "Outbound" */}
                </div>
              )}
            </div>
          </div>
          <div className="navbar-right">
            <span>Welcome, {userName}</span>
            <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
          </div>
          {/* <button className="signoutbutton" onClick={handleSignOut}>Sign Out</button> */}
        </div>
      )}
    </div>
  );
}

export default Navbar;