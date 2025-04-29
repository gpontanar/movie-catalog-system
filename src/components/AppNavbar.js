import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import '../index.css';

const AppNavbar = () => {
  const { user, unsetUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        unsetUser(); // Clear previous user state
        navigate('/');
        setShowLoginModal(false); // Close the modal
      })
      .catch((err) => console.error(err));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then(() => {
        alert('Registration successful!');
        setShowRegisterModal(false); // Close the modal
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    unsetUser();
    navigate('/');
  };

  return (
    <nav className="navbar custom-navbar">
      <div className="container-fluid">
        {/* Left: Logo and Company Name */}
        <div className="navbar-left">
          <Link className="navbar-brand" to="/">
            <img src="/logo192.png" alt="Logo" className="navbar-logo" />
            Movie Catalog
          </Link>
        </div>

        {/* Middle: Home Link */}
        <div className="navbar-middle">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">HOME</Link>
            </li>
          </ul>
        </div>

        {/* Right: Buttons */}
        <div className="navbar-right">
          {user.id ? (
            <>
              {user.isAdmin ? (
                <Link className="btn btn-admin mx-2" to="/admin-dashboard">Admin Dashboard</Link>
              ) : (
                <Link className="btn btn-user mx-2" to="/user-dashboard">User Dashboard</Link>
              )}
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button
                className="btn btn-login mx-2"
                onClick={() => {
                  console.log('Login button clicked');
                  setShowLoginModal(true); // This should set the state to true
                }}
              >
                Login
              </button>
              <button
                className="btn btn-register mx-2"
                onClick={() => setShowRegisterModal(true)}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Login</h2>
            <button className="close-btn" onClick={() => setShowLoginModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-3"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-3"
                required
              />
              <button type="submit" className="btn btn-login-modal">Login</button>
            </form>
          </div>
        </div>
      </div>
    )}
      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register</h2>
              <button className="close-btn" onClick={() => setShowRegisterModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-3"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-3"
                  required
                />
                <button type="submit" className="btn btn-login-modal">Register</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppNavbar;