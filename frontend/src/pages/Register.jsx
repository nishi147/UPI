import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [authData, setAuthData] = useState({ name: '', email: '', phone: '', password: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(authData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="mb-4 text-gradient" style={{ textAlign: 'center', fontSize: '2rem' }}>Create Account</h2>
                {error && <div className="mb-4" style={{ color: '#ef4444' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" className="input" required value={authData.name} onChange={(e)=>setAuthData({...authData, name: e.target.value})} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="input" required value={authData.email} onChange={(e)=>setAuthData({...authData, email: e.target.value})} placeholder="johndoe@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" className="input" required value={authData.phone} onChange={(e)=>setAuthData({...authData, phone: e.target.value})} placeholder="+91..." />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="input" required value={authData.password} onChange={(e)=>setAuthData({...authData, password: e.target.value})} placeholder="Create a strong password" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                    <div className="mt-4" style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
