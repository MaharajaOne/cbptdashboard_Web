import React from 'react';

const Navbar = ({ empName, onLogout }) => (
  <div className="container-fluid p-0" style={{ backgroundColor: '#007bff' }}>
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <h3 className="navbar-brand" style={{ color: 'white' }}>
          Welcome, {empName || 'Loading...'}
        </h3>
        <button
          onClick={onLogout}
          className="btn btn-light"
          style={{
            color: '#007bff',
            borderRadius: '5px',
          }} 
        >
          Logout
        </button>
      </div>
    </nav>
  </div>
);

export default Navbar;
