import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './Components/Home'; // Import the Home component
import ASN from './pages/ASN'; // Import the ASN component
import TaskInAssigned from './pages/TaskInAssigned'; // Import the TaskInAssigned component
import Login from './pages/Login'; // Import the Login component
import Register from './pages/Register'; // Import the Register component
import ToteInConsumed from './pages/ToteInConsumed';
// import Layout from './Components/Layout'; // Import the Layout component (if you have one)
import './App.css';
import OlpnInPacking from './pages/OlpnInPacking';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ASN" element={<ASN />} />
          <Route path="/ToteInConsumed" element={<ToteInConsumed />} />
          <Route path="/TaskInAssigned" element={<TaskInAssigned />} />
          
          <Route path="/OlpnInPacking" element={<OlpnInPacking/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;