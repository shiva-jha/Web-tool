import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Home from "./Components/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ASN from "./pages/ASN";
import TaskInAssigned from "./pages/TaskInAssigned";
import ToteInConsumed from "./pages/ToteInConsumed";
import OlpnInPacking from "./pages/OlpnInPacking";
import ToteInAllocAndPulled from "../src/pages/ToteInAllocAndPulled";
import Navbar from "./Components/Navbar";
import Register from "./pages/Register";

import "./App.css";
import Login from "./pages/Login";

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
        {/* <Navbar
          userName={authenticated ? currentUser.username : ""}
          handleSignOut={handleSignOut}
        /> */}
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          {/* Protected routes */}
          <Route path="/ASN" element={<ASN />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/TaskInAssigned" element={<TaskInAssigned />} />
          <Route
            path="/ToteInAllocAndPulled"
            element={<ToteInAllocAndPulled />}
          />
          <Route path="/ToteInConsumed" element={<ToteInConsumed />} />
          <Route path="/OlpnInPacking" element={<OlpnInPacking />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
