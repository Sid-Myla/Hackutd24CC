import React from 'react';
import '../styles.css';

import { FaHome, FaWallet, FaChartLine, FaPiggyBank, FaUsers } from 'react-icons/fa';

function Sidebar({ isOpen, onNavigate }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        {/* Add a header if needed */}
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item" onClick={() => onNavigate('my-wallet')}>
          <FaWallet className="sidebar-icon" />
          <span>My Wallet</span>
        </li>
        <li className="sidebar-item" onClick={() => onNavigate('investments')}>
          <FaPiggyBank className="sidebar-icon" />
          <span>Investments</span>
        </li>
        <li className="sidebar-item" onClick={() => onNavigate('sms-fraud-check')}>
          <FaChartLine className="sidebar-icon" />
          <span>SMS Fraud Check</span>
        </li>
        <li className="sidebar-item" onClick={() => onNavigate('community')}>
          <FaUsers className="sidebar-icon" /> {/* Use FaUsers instead */}
          <span>Community</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
