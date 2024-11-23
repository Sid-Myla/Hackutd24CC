// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/sidebar.css'; // Optional: for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/">My Wallet</Link>
        </li>
        <li>
          <Link to="/">Investments</Link>
        </li>
        <li>
          <Link to="/loans">SMS Fraud Check</Link>
        </li>
        <li>
          <Link to="/loans">Community</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;