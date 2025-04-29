import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;