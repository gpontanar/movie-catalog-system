import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

const AppNavbar = () => {
    const { user, logoutUser, setUser } = useContext(UserContext); // Access user, logoutUser, and setUser from context
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState(''); // State for full name
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Invalid username or password');
                }
                return res.json();
            })
            .then((data) => {
                localStorage.setItem('token', data.access);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user); // Update user context
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome back!',
                });
                navigate('/user-dashboard'); // Redirect to user dashboard after login
                setShowLoginModal(false); // Close the modal after successful login
            })
            .catch((err) => {
                console.error('Login failed:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid username or password. Please try again.',
                });
            });
    };

    const handleLogout = () => {
        logoutUser(); // Clear user data from context and localStorage
        Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been logged out successfully.',
        });
        navigate('/'); // Redirect to the home page
        setUser(null); // Clear the user context to update the navbar
    };

    const handleRegister = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, fullName }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Registration failed');
                }
                return res.json();
            })
            .then((data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'You can now log in with your credentials.',
                });
                setShowRegisterModal(false); // Close the modal after successful registration
            })
            .catch((err) => {
                console.error('Registration failed:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'Please try again.',
                });
            });
    };

    return (
        <>
            <nav className="custom-navbar">
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/005/903/347/large_2x/gold-abstract-letter-s-logo-for-negative-video-recording-film-production-free-vector.jpg"
                            alt="Logo"
                        />
                        <span className="company-name">Meowmy's Cinema</span>
                    </div>
                </div>
                <div className={`navbar-center ${menuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/movies" className="nav-link" onClick={() => setMenuOpen(false)}>
                        Movies
                    </Link>
                </div>
                <div className={`navbar-right ${menuOpen ? 'active' : ''}`}>
                    <div className="navbar-buttons">
                        {user?.id ? (
                            <>
                                <button
                                    className="btn btn-dashboard"
                                    onClick={() => navigate('/user-dashboard')}
                                >
                                    Dashboard
                                </button>
                                <button className="btn btn-logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-login"
                                    onClick={() => {
                                        setShowLoginModal(true);
                                        setMenuOpen(false);
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    className="btn btn-register"
                                    onClick={() => {
                                        setShowRegisterModal(true);
                                        setMenuOpen(false);
                                    }}
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </nav>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Login</h2>
                            <button className="close-btn" onClick={() => setShowLoginModal(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="btn-login-modal" onClick={handleLogin}>
                                Login
                            </button>
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
                            <button className="close-btn" onClick={() => setShowRegisterModal(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="btn-login-modal" onClick={handleRegister}>
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppNavbar;