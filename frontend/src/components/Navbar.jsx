import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.02em', fontStyle: 'italic' }} className="text-gradient">
                SA APPARELS
            </Link>
            
            <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? '✕' : '☰'}
            </div>

            <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                        ) : (
                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                        )}
                        <span className="user-greeting" style={{ color: 'var(--text-muted)' }}>Hello, {user.name}</span>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{fontWeight: 500}}>Login</Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
