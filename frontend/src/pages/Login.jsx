import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [authData, setAuthData] = useState({ identifier: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const isEmail = authData.identifier.includes('@');
            const data = {
                password: authData.password
            };
            if(isEmail) data.email = authData.identifier;
            else data.phone = authData.identifier;
            
            const u = await login(data);
            if (u.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="mb-4 text-gradient" style={{ textAlign: 'center', fontSize: '2rem' }}>Welcome Back</h2>
                {error && <div className="mb-4" style={{ color: '#ef4444' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email or Phone</label>
                        <input type="text" className="input" required value={authData.identifier} onChange={(e)=>setAuthData({...authData, identifier: e.target.value})} placeholder="Enter email or phone" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="input" required value={authData.password} onChange={(e)=>setAuthData({...authData, password: e.target.value})} placeholder="Enter password" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                    <div className="mt-4" style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
