import React, { useState, useEffect } from 'react';
import TransactionsTable from './TransactionsTable';
import '../styles.css';
import { FaArrowUp, FaArrowDown, FaCamera } from 'react-icons/fa';

function MyWallet({ onNavigate, user_id }) {
  const [isSendMoneyVisible, setIsSendMoneyVisible] = useState(false);
  const [isDepositVisible, setIsDepositVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMessage, setDepositMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState('');
  const [creditScore, setCreditScore] = useState(705); // Static value for now

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/transactions/user/${user_id}`);
      if (response.ok) {
        const data = await response.json();
        const formattedTransactions = data.map(transaction => ({
          type: transaction.type,
          date: new Date(transaction.timestamp).toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
          }),
          amount: transaction.type === 'deposit' ? transaction.amount : -transaction.amount,
        }));
        setTransactions(formattedTransactions);
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${user_id}/wallet_balance`);
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.wallet_balance);
      } else {
        console.error('Failed to fetch wallet balance');
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const fetchCreditScore = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/credit/${user_id}`);
      if (response.ok) {
        const data = await response.json();
        setCreditScore(data.credit_score);
      } else {
        console.error('Failed to fetch credit score');
      }
    } catch (error) {
      console.error('Error fetching credit score:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchWalletBalance();
    fetchCreditScore();
  }, [user_id]);

  const handleSendClick = () => {
    setIsSendMoneyVisible(!isSendMoneyVisible);
    setIsDepositVisible(false);
  };

  const handleDepositClick = () => {
    setIsDepositVisible(!isDepositVisible);
    setIsSendMoneyVisible(false);
  };

  const handleConfirmSendClick = async () => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5000/transactions/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: user_id,
          recipient_phone: phoneNumber,
          amount: -amount,
        }),
      });

      if (response.ok) {
        setMessage('Money sent successfully!');
        setWalletBalance(prevBalance => (Number(prevBalance) - Number(amount)).toString());
        setTransactions(prevTransactions => [
          {
            type: 'transfer',
            date: new Date().toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            }),
            amount: -amount,
          },
          ...prevTransactions,
        ]);
        setPhoneNumber('');
        setAmount('');
        setIsSendMoneyVisible(false);
      } else {
        setMessage('Failed to send money. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDepositClick = async () => {
    setIsSubmitting(true);
    setDepositMessage('');

    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${user_id}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: depositAmount,
        }),
      });

      if (response.ok) {
        setDepositMessage('Deposit successful!');
        setWalletBalance(prevBalance => (Number(prevBalance) + Number(depositAmount)).toString());
        setTransactions(prevTransactions => [
          {
            type: 'deposit',
            date: new Date().toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            }),
            amount: depositAmount,
          },
          ...prevTransactions,
        ]);
        setDepositAmount('');
        setIsDepositVisible(false);
      } else {
        setDepositMessage('Failed to deposit money. Please try again.');
      }
    } catch (error) {
      setDepositMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-wallet-container">
      <div className="wallet-header">
        <h1>My Wallet</h1>
      </div>
      
      {/* Balance Card Section */}
      <div className="balance-section">
        <div className="balance-card">
          <h2>Balance: ${walletBalance}</h2>
          <div className="wallet-actions">
            <button className="wallet-action-button" onClick={handleSendClick}>
              <FaArrowUp /> Send
            </button>
            <button className="wallet-action-button" onClick={handleDepositClick}>
              <FaArrowDown /> Deposit
            </button>
          </div>
        </div>
      </div>

      {/* Send Money Section */}
      {isSendMoneyVisible && (
        <div className="send-money-section">
          <h3>Send Money</h3>
          <div className="send-money-form">
            <label>
              <input
                type="text"
                placeholder="Enter the Phone Number of Recipient"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
            <label>
              <input
                type="number"
                placeholder="Enter the Amount ($)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <div className="contribute-actions">
              <button
                className="contribute-button submit"
                onClick={handleConfirmSendClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
              <button
                className="contribute-button cancel"
                onClick={() => setIsSendMoneyVisible(false)}
              >
                Cancel
              </button>
            </div>
            {message && <p className="send-money-message">{message}</p>}
          </div>
        </div>
      )}

      {/* Deposit Section */}
        {isDepositVisible && (
        <div className="send-money-section">
          <h3>Deposit Money</h3>
          <div className="send-money-form">
            <button className="wallet-action-button">
              <FaCamera /> Scan Check
            </button>
            <label>
              <input
                type="number"
                placeholder="Enter the Amount ($)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </label>
            <div className="contribute-actions">
              <button
                className="contribute-button submit"
                onClick={handleConfirmDepositClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Depositing...' : 'Submit'}
              </button>
              <button
                className="contribute-button cancel"
                onClick={() => setIsDepositVisible(false)}
              >
                Cancel
              </button>
            </div>
            {depositMessage && <p className="send-money-message">{depositMessage}</p>}
          </div>
        </div>
      )}

      {/* Credit Score Section */}
      <div className="credit-score-section">
        <div className="credit-score-card">
          <h3 className="credit-score-header">Credit Score</h3>
          <div className="credit-score-display">
            <div className="credit-score-value">
              <p>{creditScore}</p>
              <span>{creditScore >= 720 ? 'Good' : creditScore >= 660 ? 'Fair' : 'Poor'}</span>
            </div>
            <div className="credit-score-meter">
              <div
                className="credit-score-bar"
                style={{
                  background: creditScore >= 720 ? '#4caf50' : creditScore >= 660 ? '#ffeb3b' : '#ff5722',
                  width: `${((creditScore - 300) / 550) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="wallet-transactions-section">
        <h2>Recent Transactions</h2>
        <div className="transactions-scrollable">
          <TransactionsTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default MyWallet;
