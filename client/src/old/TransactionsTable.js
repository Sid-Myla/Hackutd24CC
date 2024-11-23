import React from 'react';
import '../styles.css';

function TransactionsTable({ transactions }) {
  return (
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.type}</td>
              <td>{transaction.date}</td>
              <td style={{ color: transaction.amount > 0 ? 'green' : 'red' }}>
                {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
