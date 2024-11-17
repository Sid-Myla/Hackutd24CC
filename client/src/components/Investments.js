import React, { useState, useEffect } from 'react';
import '../styles.css';
import { Chart } from 'chart.js/auto';
import { FaPlus } from 'react-icons/fa';

function Investments({ onNavigate }) {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    // Fetch business list from API
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

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);

    // Render the pie chart with business-specific data
    setTimeout(() => {
      const ctx = document.getElementById('equityChart');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Equity Offered', 'Remaining Goal'],
            datasets: [{
              data: [business.equity, business.goal - business.equity],
              backgroundColor: ['#6359E9', '#1d1d41'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              }
            }
          }
        });
      }
    }, 100);
  };

  const handleBackClick = () => {
    setSelectedBusiness(null);
  };

  return (
    <div>
      {/* Business List Section */}
      {selectedBusiness === null && (
        <div className="investments-page">
          <div className="investments-header">
            <h2>Community Businesses</h2>
            <button className="light-rounded-button" onClick={() => onNavigate('enlist-business')}>
              <FaPlus /> Enlist Your Business
            </button>
          </div>
          <div className="business-list">
            {businesses.map((business, index) => (
              <button
                key={index}
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
      {selectedBusiness !== null && (
        <div className="business-details-page">
          <div className="navbar">
            <button className="close-button" onClick={handleBackClick}>X</button>
          </div>
          <div className="details-content">
            <h2>Business Name</h2>
            <p className="subheading">{selectedBusiness.business_name}</p>

            <h2>Owner Name</h2>
            <p className="subheading">{selectedBusiness.owner_name || 'Placeholder for Owner\'s Name'}</p>

            <h2>Description</h2>
            <p className="subheading">{selectedBusiness.description || 'Placeholder for Business Description'}</p>

            <h2>Goal/Equity Offered</h2>
            <div id="chart-container">
              {/* Placeholder for Pie Chart */}
              <canvas id="equityChart"></canvas>
            </div>

            <button className="invest-button">Invest</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Investments;
