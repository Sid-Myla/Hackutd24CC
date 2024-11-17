import React, { useState, useEffect } from 'react';
import TransactionsTable from './TransactionsTable';
import '../styles.css';
import { FaArrowUp, FaArrowDown, FaTimes } from 'react-icons/fa';

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

  useEffect(() => {
    // Fetch transactions
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

    // Fetch wallet balance
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

    fetchTransactions();
    fetchWalletBalance();
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
          amount,
        }),
      });

      if (response.ok) {
        setMessage('Money sent successfully!');
        setTransactions(prevTransactions => [
          {
            type: 'Transfer',
            date: new Date().toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            }),
            amount: amount,
          },
          ...prevTransactions,
        ]);
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
      const response = await fetch(`http://localhost:5000/users/${user_id}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: depositAmount }),
      });

      if (response.ok) {
        setDepositMessage('Deposit successful!');
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
      } else {
        setDepositMessage('Failed to deposit. Please try again.');
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
        <button onClick={() => onNavigate('dashboard')} className="close-button">
          <FaTimes />
        </button>
        <h1>My Wallet</h1>
      </div>
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

      {isSendMoneyVisible && (
        <div className="send-money-section">
          <h3>Send Money</h3>
          <div className="send-money-form">
            <label>
              Recipient Phone Number:
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </label>
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <button
              className="confirm-button"
              onClick={handleConfirmSendClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Confirm'}
            </button>
            {message && <p className="send-money-message">{message}</p>}
          </div>
        </div>
      )}

      {isDepositVisible && (
        <div className="deposit-section">
          <h3>Deposit Money</h3>
          <div className="deposit-form">
            <label>
              Upload Image:
              <input type="file" />
            </label>
            <label>
              Amount:
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </label>
            <button
              className="confirm-button"
              onClick={handleConfirmDepositClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Depositing...' : 'Submit'}
            </button>
            {depositMessage && <p className="deposit-message">{depositMessage}</p>}
          </div>
        </div>
      )}

      <div className="wallet-transactions-section">
        <h2>Recent Transactions</h2>
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}

export default MyWallet;
