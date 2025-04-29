// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';

// import AppNavbar from './components/AppNavbar';
// import Login from './pages/Login';
// import { UserProvider } from './UserContext';
// import Home from './pages/Home';
// import Register from './pages/Register';
// import Movies from './pages/Movies';
// import AdminDashboard from './pages/AdminDashboard';
// import UserDashboard from './pages/UserDashboard';

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import { UserProvider } from './UserContext';

function App() {
    const [user, setUser] = useState({
        id: null,
    });

    const unsetUser = () => {
        localStorage.clear();
    };

    useEffect(() => {
        fetch(` `, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (typeof data.user !== 'undefined') {
                    setUser({
                        id: data.user._id,
                    });
                } else {
                    setUser({
                        id: null,
                    });
                }
            });
    }, []);

    return (
        <UserProvider>
            <Router>
            <AppNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;