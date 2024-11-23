// components/Navbar.js
import React from 'react';

function Navbar({ toggleSidebar }) {
  return (
    <div className="navbar">
      <button className="hamburger-menu" onClick={toggleSidebar}>
        &#9776; {/* Hamburger icon */}
      </button>
    </div>
  );
}

export default Navbar;
