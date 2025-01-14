import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarItems }) => (
  <div style={{ width: '200px', borderRight: '1px solid #ccc', height: '100vh', padding: '20px' }}>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {sidebarItems.map((item, index) => (
        <li key={index}>
          <Link to={`/${item.toLowerCase().replace(' ', '')}`}>{item}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Sidebar;
