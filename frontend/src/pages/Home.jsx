import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container" style={{ textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem', fontStyle: 'italic' }}>SA APPARELS Payments</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                Pay for products and services instantly with our secure, zero-hassle UPI integration. Upload your proof, and we handle the rest.
            </p>
            <div className="flex justify-center gap-6">
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.125rem' }}>Get Started</Link>
                <Link to="/login" className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', fontSize: '1.125rem' }}>Login</Link>
            </div>
        </div>
    );
};

export default Home;
