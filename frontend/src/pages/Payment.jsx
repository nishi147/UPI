import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Payment = () => {
    const [transactionId, setTransactionId] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [config, setConfig] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/config').then(res => setConfig(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a screenshot of your payment');
            return;
        }

        const formData = new FormData();
        formData.append('transactionId', transactionId);
        formData.append('screenshot', file);

        setLoading(true);
        setError('');

        try {
            await api.post('/payments/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload payment proof');
        } finally {
            setLoading(false);
        }
    };
    const getUpiLink = () => {
        if (!config) return '#';
        const pa = encodeURIComponent(config.upiId);
        const pn = encodeURIComponent(config.companyName);
        return `upi://pay?pa=${pa}&pn=${pn}&cu=INR`;
    };

    return (
        <div className="container">
            <h2 className="mb-4 text-gradient">Complete Your Payment</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="glass-panel" style={{ textAlign: 'center' }}>
                    <h3 className="mb-4">Scan QR code to pay</h3>
                    {config && config.qrCodeUrl ? (
                        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <a href={getUpiLink()}>
                                <img src={config.qrCodeUrl?.startsWith('http') ? config.qrCodeUrl : `https://upi-jet.vercel.app/${config.qrCodeUrl}`} alt="QR Code" style={{ width: '250px', height: '250px', objectFit: 'contain', borderRadius: '12px', border: '8px solid var(--primary)', marginBottom: '1rem' }} />
                            </a>
                            <a href={getUpiLink()} className="btn btn-success" style={{ width: '100%', maxWidth: '250px' }}>Pay via UPI App</a>
                        </div>
                    ) : (
                        <div className="qr-placeholder">
                            <p>Admin has not uploaded QR Code yet.</p>
                        </div>
                    )}
                    {config && (
                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            UPI ID: {config.upiId}
                        </p>
                    )}
                    <p style={{ color: 'var(--text-muted)' }}>{config?.companyName}</p>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>Please verify the amount and recipient before sending the payment.</p>
                </div>
                
                <div className="glass-panel">
                    <h3 className="mb-4">Upload Payment Proof</h3>
                    {error && <div className="mb-4" style={{ color: '#ef4444' }}>{error}</div>}
                    {success ? (
                        <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                            Success! Your payment proof has been uploaded. Redirecting...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Transaction ID (Optional)</label>
                                <input type="text" className="input" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. T210..." />
                            </div>
                            <div className="form-group">
                                <label>Screenshot (JPG/PNG)</label>
                                <input type="file" className="input" accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                                {loading ? 'Uploading...' : 'Submit Proof'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;
