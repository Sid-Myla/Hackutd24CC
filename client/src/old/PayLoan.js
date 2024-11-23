// components/PayLoan.js
import React, { useState } from 'react';
import '../styles.css';

function PayLoan({ onNavigate, userId }) {
  const [payAmount, setPayAmount] = useState('');
  const [message, setMessage] = useState('');
  const [remainingBalance, setRemainingBalance] = useState(null);
  const [updatedLoans, setUpdatedLoans] = useState([]);

  const handlePay = async () => {
    setMessage('');
    try {
      const response = await fetch(`http://127.0.0.1:5000/community/${userId}/make_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_amount: Number(payAmount),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setRemainingBalance(data.remaining_balance);
        setUpdatedLoans(data.updated_loans);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleDeny = () => {
    setMessage('');
    onNavigate('community');
  };

  return (
    <div className="pay-loan-page">
      <div className="navbar">
        <button className="close-button" onClick={() => onNavigate('community')}>X</button>
      </div>
      <h2 className="page-header">Pay Loan</h2>
      <div className="form-card">
        <p><strong>Remaining Amount:</strong> ${remainingBalance !== null ? remainingBalance : 'Loading...'}</p>
        <input
          type="number"
          placeholder="Enter Amount ($)"
          value={payAmount}
          onChange={(e) => setPayAmount(e.target.value)}
          className="input-field"
        />
        <div className="action-buttons">
          <button className="action-button submit" onClick={handlePay}>Pay</button>
          <button className="action-button cancel" onClick={handleDeny}>Deny</button>
        </div>
        {message && <p className="loan-message">{message}</p>}
        {remainingBalance !== null && (
          <div className="updated-loans">
            <h3>Updated Loan Details:</h3>
            {updatedLoans.map((loan) => (
              <div key={loan.loan_id} className="loan-details">
                <p><strong>Amount:</strong> ${loan.amount}</p>
                <p><strong>EMI:</strong> ${loan.emi}</p>
                <p><strong>Status:</strong> {loan.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PayLoan;