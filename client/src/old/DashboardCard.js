// components/DashboardCard.js
import React from 'react';

function DashboardCard({ title, amount, percentage }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <p>{amount}</p>
      {percentage !== undefined && (
        <span className={percentage >= 0 ? 'positive' : 'negative'}>
          {percentage >= 0 ? `+${percentage}%` : `${percentage}%`}
        </span>
      )}
    </div>
  );
}

export default DashboardCard;