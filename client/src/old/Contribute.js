import React, { useState } from 'react';
import '../styles.css';

function Contribute({ onNavigate, user_id }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleContribute = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/community/${user_id}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="contribute-page">
      <div className="navbar">
        <button className="close-button" onClick={() => onNavigate('community')}>X</button>
      </div>
      <h2 className="page-header">Contribute</h2>
      <div className="form-card">
        <input
          type="number"
          placeholder="Enter the Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"
        />
        <div className="action-buttons">
          <button className="action-button submit" onClick={handleContribute}>Submit</button>
          <button className="action-button cancel" onClick={() => onNavigate('community')}>Cancel</button>
        </div>
        {message && <p className="contribute-message">{message}</p>}
      </div>
    </div>
  );
}

export default Contribute;

