// components/SMSFraudCheck.js
import React, { useState } from 'react';
import '../styles.css';


function SMSFraudCheck({ onNavigate }) {
  const [smsContent, setSmsContent] = useState('');
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckClick = async () => {
    setIsChecking(true);
    setResult(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/fraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: smsContent }),
      });
      const data = await response.json();
      setResult(data);
      console.log(data)
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="sms-fraud-check-container consistent-container">
      <div className="sms-fraud-header">
        <h1>SMS Fraud Check</h1>
      </div>
      <div className="sms-fraud-input-section">
        <textarea
          className="sms-fraud-input"
          placeholder="Enter SMS content here..."
          value={smsContent}
          onChange={(e) => setSmsContent(e.target.value)}
        ></textarea>
        <button className="sms-fraud-check-button" onClick={handleCheckClick}>Check Now</button>
        <div className="sms-fraud-result">
          {isChecking ? (
            <p>Waiting for API data...</p>
          ) : result ? (
            <p>{result.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SMSFraudCheck;

