import React, { useState, useEffect, useRef } from 'react';
import '../styles.css';
import { Chart } from 'chart.js/auto';
import { FaPlus } from 'react-icons/fa';

function Investments({ onNavigate, userId }) {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [investingBusiness, setInvestingBusiness] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/businesses/info');
        if (response.ok) {
          const data = await response.json();
          setBusinesses(data.businesses);
        } else {
          console.error('Failed to fetch business list');
        }
      } catch (error) {
        console.error('Error fetching business list:', error);
      }
    };

    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      renderChart(selectedBusiness);
    }
  }, [selectedBusiness]);

  const renderChart = (business) => {
    const ctx = document.getElementById('equityChart');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (ctx) {
      const userInvestment = business.stakeholders.find(stake => stake.user_id === userId)?.amount_invested || 0;
      const othersInvestment = business.stakeholders.reduce((total, stake) => {
        if (stake.user_id !== userId) {
          return total + stake.amount_invested;
        }
        return total;
      }, 0);
      const remainingAmount = business.remaining_amount;

      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Your Investment', 'Others', 'Remaining Goal'],
          datasets: [{
            data: [userInvestment, othersInvestment, remainingAmount],
            backgroundColor: ['#FF4444', '#6359E9', '#1d1d41'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const total = business.goal;
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${context.label}: $${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  };

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
  };

  const handleBackClick = () => {
    setSelectedBusiness(null);
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
  };

  const handleInvestClick = (business) => {
    setInvestingBusiness(business);
  };

  const handleCancelInvest = () => {
    setInvestingBusiness(null);
    setInvestmentAmount('');
    if (selectedBusiness) {
      renderChart(selectedBusiness);  // Reload the chart when canceling investment
    }
  };

  const handleConfirmInvest = async () => {
    if (!investmentAmount) {
      console.error('Please enter an amount to invest.');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/business/${investingBusiness.business_id}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          amount_invested: Number(investmentAmount),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedBusiness = data.result.business;
        setBusinesses(prevBusinesses => prevBusinesses.map(b => b.business_id === updatedBusiness.business_id ? updatedBusiness : b));
        setSelectedBusiness(updatedBusiness);
        renderChart(updatedBusiness);
        setInvestingBusiness(null);
        setInvestmentAmount('');
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error('Error making investment:', error);
    }
  };

  const getCurrentUserInvestment = () => {
    if (!selectedBusiness) return null;
    const userStake = selectedBusiness.stakeholders.find(stake => stake.user_id === userId);
    return userStake ? {
      amount: userStake.amount_invested,
      equity: userStake.equity
    } : null;
  };

  return (
    <div>
      {/* Business List Section */}
      {selectedBusiness === null && investingBusiness === null && (
        <div className="investments-page">
          <div className="investments-header">
            <h2>Community Businesses</h2>
            <button className="light-rounded-button" onClick={() => onNavigate('enlist-business')}>
              <FaPlus /> Enlist Your Business
            </button>
          </div>
          <div className="business-list">
            {businesses.map((business) => (
              <button
                key={business.business_id}
                className="business-button"
                onClick={() => handleBusinessClick(business)}
              >
                {business.business_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Business Details Section */}
      {selectedBusiness !== null && investingBusiness === null && (
        <div className="business-details-page">
          <div className="navbar">
            <button className="close-button" onClick={handleBackClick}>X</button>
          </div>
          <div className="details-content">
            <h2>Business Name</h2>
            <p className="subheading">{selectedBusiness.business_name}</p>

            <h2>Owner Name</h2>
            <p className="subheading">{selectedBusiness.owner_name}</p>

            <h2>Description</h2>
            <p className="subheading">{selectedBusiness.description}</p>

            <h2>Goal/Equity Offered</h2>
            <p className="investment-goal">Investment Goal: ${selectedBusiness.goal}</p>
            <div id="chart-container">
              <canvas id="equityChart"></canvas>
            </div>
            
            {getCurrentUserInvestment() && (
              <div className="investment-info">
                <p>Your Investment: ${getCurrentUserInvestment().amount.toFixed(2)}</p>
                <p>Your Equity: {getCurrentUserInvestment().equity.toFixed(2)}%</p>
              </div>
            )}

            <button className="invest-button" onClick={() => handleInvestClick(selectedBusiness)}>
              Invest
            </button>
          </div>
        </div>
      )}

      {/* Investment Form Section */}
      {investingBusiness !== null && (
        <div className="investment-form-page">
          <div className="investment-form-card">
            <h3>{investingBusiness.business_name}</h3>
            <label>
              <input
                type="number"
                placeholder="Amount to be Invested ($)"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
              />
            </label>
            <div className="investment-actions">
              <button className="light-rounded-button" onClick={handleConfirmInvest}>Purchase</button>
              <button className="light-rounded-button cancel" onClick={handleCancelInvest}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Investments;