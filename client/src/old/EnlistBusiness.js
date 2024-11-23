// EnlistBusiness.js
import React, { useState } from 'react';
import '../styles.css';
import { FaTimes } from 'react-icons/fa';

function EnlistBusiness({ onNavigate }) {
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [equity, setEquity] = useState('');

  const handleSubmit = () => {
    // Here you can add functionality to submit the business to the server.
    console.log('Business Enlisted:', { businessName, description, goal, equity });
    // Navigate back to the investments page after submission
    onNavigate('investments');
  };

  return (
    <div className="enlist-business-container">
      <div className="wallet-header">
        <button onClick={() => onNavigate('investments')} className="close-button">
          <FaTimes />
        </button>
        <h2>Enlist Your Business</h2>
      </div>
      <div className="enlist-business-card">
        <div className="enlist-form">
          <label>
            Business Name:
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter Business Name"
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Business Description"
            />
          </label>
          <label>
            Goal Amount ($):
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter Goal Amount"
            />
          </label>
          <label>
            Equity Offered (%):
            <input
              type="number"
              value={equity}
              onChange={(e) => setEquity(e.target.value)}
              placeholder="Enter Equity Percentage"
            />
          </label>
          <div className="contribute-actions">
            <button className="contribute-button submit" onClick={handleSubmit}>
              Submit
            </button>
            <button className="contribute-button cancel" onClick={() => onNavigate('investments')}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnlistBusiness;
