// components/WithdrawContribution.js
import React, { useState } from 'react';
import '../styles.css';

function WithdrawContribution({ onNavigate, userId }) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleWithdraw = async () => {
    setMessage('');
    try {
      const response = await fetch(`http://127.0.0.1:5000/community/${userId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(withdrawAmount),
        }),
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
    <div className="withdraw-contribution-page">
      <div className="navbar">
        <button className="close-button" onClick={() => onNavigate('community')}>X</button>
      </div>
      <h2 className="page-header">Withdraw Contribution</h2>
      <div className="form-card">
        <p><strong>Amount Contributed:</strong> $1500</p> {/* Replace with dynamic contributed amount if available */}
        <input
          type="number"
          placeholder="Enter Amount ($)"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="input-field"
        />
        <div className="action-buttons">
          <button className="action-button submit" onClick={handleWithdraw}>Withdraw</button>
          <button className="action-button cancel" onClick={() => onNavigate('community')}>Cancel</button>
        </div>
        {message && <p className="withdraw-message">{message}</p>}
      </div>
    </div>
  );
}

export default WithdrawContribution;