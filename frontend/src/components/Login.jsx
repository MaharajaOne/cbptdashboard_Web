import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [emp_id, setEmpId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(emp_id, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Login</h2>
      <input type="text" placeholder="Employee ID" value={emp_id} onChange={(e) => setEmpId(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
