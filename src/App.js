import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./Components/Home";
import Register from "./pages/Register";
import ASN from "./pages/ASN";
import TaskInAssigned from "./pages/TaskInAssigned";
import ToteInConsumed from "./pages/ToteInConsumed";
import OlpnInPacking from "./pages/OlpnInPacking";
import ToteInAllocAndPulled from "./pages/ToteInAllocAndPulled";
import Navbar from "./Components/Navbar";
import Login from "./pages/Login";

import "./App.css";

function App() {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    // Update the authentication status from localStorage on component mount
    setAuthenticated(localStorage.getItem("authenticated") === "true");
  }, []);

  // useEffect(() => {
  //   // Check for presence of jwtToken in localStorage
  //   const jwtToken = localStorage.getItem("jwtToken");
  //   if (!jwtToken) {
  //     // Clear authentication related data
  //     localStorage.removeItem("authenticated");
  //     localStorage.removeItem("userName");
  //     setAuthenticated(false); // Update authentication status
  //   }
  // }, []);
  
      
  

  return (
    <Router>
      <div>
      {authenticated && <Navbar />}
        <Routes>
          <Route
            path="/Home"
            element={
              authenticated ? (
                <>
                  
                  <Home />
                </>
              ) : (
                <Navigate to="/Login" replace />
              )
            }
          />
          <Route path="/Register" element={<Register />} />
          <Route
            path="/Login"
            element={<Login setAuthenticated={setAuthenticated} />}
          />
          {/* Protected routes */}
          {authenticated && (
            <>
              <Route path="/ASN" element={<ASN />} />
              <Route path="/TaskInAssigned" element={<TaskInAssigned />} />
              <Route
                path="/ToteInAllocAndPulled"
                element={<ToteInAllocAndPulled />}
              />
              <Route path="/ToteInConsumed" element={<ToteInConsumed />} />
              <Route path="/OlpnInPacking" element={<OlpnInPacking />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/Home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;