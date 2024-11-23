// components/LoanApproval.js
import React, { useState, useEffect } from 'react';
import '../styles.css';

function LoanApproval({ onNavigate, userId }) {
  const [message, setMessage] = useState('');
  const [pendingLoans, setPendingLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    // Fetch pending loans
    const fetchPendingLoans = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/community/pending_loans');
        if (response.ok) {
          const data = await response.json();
          setPendingLoans(data.pending_loans);
        } else {
          console.error('Failed to fetch pending loans');
        }
      } catch (error) {
        console.error('Error fetching pending loans:', error);
      }
    };

    fetchPendingLoans();
  }, []);

  const handleApprove = async () => {
    if (!selectedLoan) return;
    setMessage('');
    try {
      const response = await fetch(`http://127.0.0.1:5000/community/${userId}/approve_or_deny_loan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loan_id: selectedLoan.loan_id,
          approve: true,
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

  const handleDeny = async () => {
    if (!selectedLoan) return;
    setMessage('');
    try {
      const response = await fetch(`http://127.0.0.1:5000/community/${userId}/approve_or_deny_loan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loan_id: selectedLoan.loan_id,
          approve: false,
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
    <div className="loan-approval-page">
      <h2 className="page-header">Loan Approval</h2>
      {selectedLoan ? (
        <div className="form-card">
          <p><strong>Loan Amount Requested:</strong> ${selectedLoan.amount}</p>
          <p><strong>Requested By:</strong> {selectedLoan.user_name}</p>
          <p><strong>Reason for Loan:</strong> {selectedLoan.description}</p>
          <div className="action-buttons">
            <button className="action-button submit" onClick={handleApprove}>Approve</button>
            <button className="action-button cancel" onClick={handleDeny}>Deny</button>
          </div>
          {message && <p className="loan-message">{message}</p>}
        </div>
      ) : (
        <div className="loan-list">
          <h3>Select a Loan to Approve or Deny</h3>
          <div className="loan-list-items">
            {pendingLoans.map((loan) => (
              <div key={loan.loan_id} className="loan-list-item-box" onClick={() => setSelectedLoan(loan)}>
                <div className="loan-list-item-content">
                  <p><strong>Borrower:</strong> {loan.user_name}</p>
                  <p><strong>Amount:</strong> ${loan.amount}</p>
                  <p><strong>Approval Percentage:</strong> {loan.approval_percentage.toFixed(2)}%</p>
                  <p><strong>Description:</strong> {loan.description}</p>
                  <p><strong>EMI:</strong> ${loan.emi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanApproval;
