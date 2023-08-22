import React from 'react';
import { Link } from 'react-router-dom';
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Home Page</h1>
      <ul className="nav-links">
        <li>
          <Link to="/ASN">ASN Page</Link>
        </li>
        <li>
          <Link to="/ToteInConsumed">Tote in Consumed</Link>
        </li>
        <li>
          <Link to="/TaskInAssigned">Task In Assigned Page</Link>
        </li>
        {/* <li>
          <Link to="/Login">Login Page</Link>
        </li>

        <li>
          <Link to="/Register">Register Page</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
