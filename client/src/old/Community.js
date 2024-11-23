// components/Community.js
import React, { useState, useEffect } from 'react';
import '../styles.css';

function Community({ onNavigate }) {
  const [fundAmount, setFundAmount] = useState('');
  const [interestEarned, setInterestEarned] = useState('');
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    // Fetch community fund data from API
    const fetchCommunityData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/community/fund');
        if (response.ok) {
          const data = await response.json();
          setFundAmount(data.community_fund.total_balance);
          setInterestEarned(data.community_fund.total_interest_earned);
          setContributors(data.community_fund.contributors.map(contributor => ` ${contributor.name}: $${contributor.amount}`));
        } else {
          console.error('Failed to fetch community fund data');
        }
      } catch (error) {
        console.error('Error fetching community fund data:', error);
      }
    };

    fetchCommunityData();
  }, []);

  return (
    <div className="community-page">
      <h2 className="community-header">Community</h2>
      <div className="community-card">
        <h3 className="community-heading">Amount</h3>
        <p className="community-amount">${fundAmount}</p>
      </div>
      <div className="community-card">
        <h3 className="community-heading">Interest Earned (Overall)</h3>
        <p className="community-interest">${interestEarned}</p>
      </div>
      <div className="community-card">
        <h3 className="community-heading">See Contributors</h3>
        <ul className="contributors-list">
          {contributors.map((contributor, index) => (
            <li key={index}>{contributor}</li>
          ))}
        </ul>
      </div>
      <div className="community-actions">
        <button className="community-button" onClick={() => onNavigate('contribute')}>Contribute</button>
        <button className="community-button" onClick={() => onNavigate('request-loan')}>Request Loan</button>
        <button className="community-button" onClick={() => onNavigate('loan-approval')}>Loan Approvals</button>
        <button className="community-button" onClick={() => onNavigate('pay-loan')}>Pay Loan</button>
        <button className="community-button" onClick={() => onNavigate('withdraw-contribution')}>Withdraw Contribution</button>
      </div>
    </div>
  );
}
export default Community;