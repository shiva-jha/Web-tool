import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";

import Home from "./Components/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ASN from "./pages/ASN";
import TaskInAssigned from "./pages/TaskInAssigned";
import ToteInConsumed from "./pages/ToteInConsumed";
import OlpnInPacking from "./pages/OlpnInPacking";
import ToteInAllocAndPulled from "../src/pages/ToteInAllocAndPulled";
import Navbar from "./Components/Navbar";

import "./App.css";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSignIn = (user) => {
    setCurrentUser(user);
    setAuthenticated(true);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthenticated(false);
  };

  const dummyUsers = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" },
    { id: 2, username: "shiva", password: "abc" },
    // Add more dummy users as needed
  ];

  return (
    <Router>
      <div>
        <nav>
          <ul>
            {/* <li>
              <Link to="/">Home</Link>
            </li>
            {!authenticated && (
              <>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
              </>
            )} */}
            {/* {authenticated && (
              <>
                <li>
                  <Link to="/ASN">ASN</Link>
                </li>
                <li>
                  <Link to="/TaskInAssigned">Task In Assigned</Link>
                </li>
                <li>
                  <Link to="/ToteInConsumed">Tote In Consumed</Link>
                </li>
                <li>
                  <Link to="/OlpnInPacking">Olpn In Packing</Link>
                </li>
                <li>
                  <button onClick={handleSignOut}>Sign Out</button>
                </li>
              </>
            )} */}
          </ul>
        </nav>
        <Navbar
          userName={authenticated ? currentUser.username : ""}
          handleSignOut={handleSignOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? (
                <Home currentUser={currentUser} />
              ) : (
                <SignIn handleSignIn={handleSignIn} users={dummyUsers} />
              )
            }
          />
           <Route path="/signup" element={<SignUp />} />
          {/* Protected routes */}
          <Route
            path="/ASN"
            element={authenticated ? <ASN /> : <Navigate to="/" />}
          />
          <Route
            path="/TaskInAssigned"
            element={authenticated ? <TaskInAssigned /> : <Navigate to="/" />}
          />
           <Route
            path="/ToteInAllocAndPulled"
            element={authenticated ? <ToteInAllocAndPulled /> : <Navigate to="/" />}
          />
          <Route
            path="/ToteInConsumed"
            element={authenticated ? <ToteInConsumed /> : <Navigate to="/" />}
          />
          <Route
            path="/OlpnInPacking"
            element={authenticated ? <OlpnInPacking /> : <Navigate to="/" />}
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;