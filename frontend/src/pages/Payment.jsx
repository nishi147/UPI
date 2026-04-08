import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Payment = () => {
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [config, setConfig] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showScannerHelp, setShowScannerHelp] = useState(false);
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
        formData.append('amount', amount);
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
        if (!config || !config.upiId) return '#';
        const pa = config.upiId.trim();
        const pn = encodeURIComponent((config.companyName || 'Payment').trim());
        let link = `upi://pay?pa=${pa}&pn=${pn}&cu=INR`;
        if (amount && !isNaN(parseFloat(amount))) {
            const formattedAmount = parseFloat(amount).toFixed(2);
            link += `&am=${formattedAmount}`;
        }
        return link;
    };

    const downloadQR = () => {
        if (!config || !config.qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = config.qrCodeUrl?.startsWith('http') ? config.qrCodeUrl : `https://upi-jet.vercel.app/${config.qrCodeUrl}`;
        link.download = 'payment-qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = () => {
        if (config && config.upiId) {
            navigator.clipboard.writeText(config.upiId);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const ScannerModal = () => (
        <div className="modal-overlay" onClick={() => setShowScannerHelp(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Scan & Pay Guide</h3>
                    <button className="close-btn" onClick={() => setShowScannerHelp(false)}>✕</button>
                </div>
                <div className="modal-body text-left">
                    <p className="mb-4" style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                        Use this method if the 'Pay via UPI App' button shows a security warning.
                    </p>
                    
                    <div className="step-item">
                        <div className="step-num">1</div>
                        <div className="step-text">
                            <strong>Download QR Code</strong>
                            <p>Save the QR banner to your phone's gallery</p>
                            <button onClick={downloadQR} className="btn btn-secondary mt-2" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Download Now</button>
                        </div>
                    </div>

                    <div className="step-item">
                        <div className="step-num">2</div>
                        <div className="step-text">
                            <strong>Open any UPI App</strong>
                            <p>Launch your preferred payment app</p>
                            <div className="flex gap-4 mt-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" style={{height: '20px'}} />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/1024px-Google_Pay_Logo_%282020%29.svg.png" alt="GPay" style={{height: '20px'}} />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" style={{height: '20px'}} />
                            </div>
                        </div>
                    </div>

                    <div className="step-item">
                        <div className="step-num">3</div>
                        <div className="step-text">
                            <strong>Select 'Scan from Gallery'</strong>
                            <p>Look for the gallery icon in the app's QR scanner and select the downloaded image.</p>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary w-full mt-4" onClick={() => setShowScannerHelp(false)}>Got it!</button>
            </div>
        </div>
    );

    return (
        <div className="container">
            {copySuccess && (
                <div className="toast-notification">
                    ✅ UPI ID copied to clipboard!
                </div>
            )}
            {showScannerHelp && <ScannerModal />}
            <h2 className="mb-4 text-gradient">Complete Your Payment</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className="glass-panel" style={{ textAlign: 'center' }}>
                    <h3 className="mb-4">Scan QR code to pay</h3>
                    {config && config.qrCodeUrl ? (
                        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <a href={getUpiLink()}>
                                <img src={config.qrCodeUrl?.startsWith('http') ? config.qrCodeUrl : `https://upi-jet.vercel.app/${config.qrCodeUrl}`} alt="QR Code" style={{ width: '250px', height: '250px', objectFit: 'contain', borderRadius: '12px', border: '8px solid var(--primary)', marginBottom: '1rem' }} />
                            </a>
                            <div className="flex flex-col gap-4 w-full" style={{ maxWidth: '280px' }}>
                                <a href={getUpiLink()} className="btn btn-success" style={{ width: '100%', borderRadius: '24px' }}>Pay via UPI App</a>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setShowScannerHelp(true)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.6rem' }}>Scan & Pay</button>
                                    <button onClick={downloadQR} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.6rem' }}>Download QR</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="qr-placeholder">
                            <p>Admin has not uploaded QR Code yet.</p>
                        </div>
                    )}
                    {config && (
                        <div className="mb-4">
                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                UPI ID: {config.upiId}
                            </p>
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={copyToClipboard}>
                                (COPY UPI ID)
                            </button>
                        </div>
                    )}
                    <p style={{ color: 'var(--text-muted)' }}>{config?.companyName !== 'SA APPARELS' ? config?.companyName : ''}</p>
                    
                    <div className="troubleshoot-box mt-8">
                        <p style={{ fontWeight: '600', color: '#856404', marginBottom: '0.5rem', fontSize: '0.85rem' }}>⚠️ Facing Security Warnings?</p>
                        <p style={{ fontSize: '0.8rem', color: '#856404' }}>
                            If your app shows a 'Security Alert', please <strong>Download the QR</strong> and scan it from your UPI app gallery, or use <strong>Copy UPI ID</strong> to pay manually.
                        </p>
                    </div>
                    
                    <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem', fontSize: '0.9rem' }}>Please verify the amount and recipient before sending the payment.</p>
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
                                <label>Amount <span style={{ color: 'red' }}>*</span></label>
                                <input type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount paid" required />
                            </div>
                            <div className="form-group">
                                <label>Transaction ID (Optional)</label>
                                <input type="text" className="input" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. T210..." />
                            </div>
                            <div className="form-group">
                                <label>Screenshot (JPG/PNG) <span style={{ color: 'red' }}>*</span></label>
                                <input type="file" className="input" accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files[0])} required />
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
