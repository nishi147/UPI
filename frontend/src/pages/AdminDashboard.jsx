import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [config, setConfig] = useState({ companyName: '', upiId: '' });
    const [qrFile, setQrFile] = useState(null);
    const [configMsg, setConfigMsg] = useState('');

    useEffect(() => {
        fetchPayments();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config');
            setConfig(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payments/admin/all');
            setPayments(res.data);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/payments/admin/${id}/status`, { status });
            setPayments(payments.map(p => p._id === id ? { ...p, status } : p));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleConfigUpdate = async (e) => {
        e.preventDefault();
        setConfigMsg('');
        const formData = new FormData();
        formData.append('companyName', config.companyName);
        formData.append('upiId', config.upiId);
        if (qrFile) formData.append('qrCode', qrFile);

        try {
            const res = await api.put('/config', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setConfig(res.data);
            setConfigMsg('Settings updated successfully!');
            setTimeout(() => setConfigMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setConfigMsg('Error updating settings');
        }
    };

    const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);

    const downloadCSV = () => {
        const headers = ['User Name', 'Email', 'Phone', 'Transaction ID', 'Date', 'Status'];
        const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;
        
        const rows = filteredPayments.map(p => [
            p.user?.name || 'N/A',
            p.user?.email || 'N/A',
            p.user?.phone || 'N/A',
            p.transactionId || 'N/A',
            new Date(p.createdAt).toLocaleString(),
            p.status
        ]);
        
        const csvRows = [headers.map(escapeCsv).join(',')];
        for (const row of rows) {
            csvRows.push(row.map(escapeCsv).join(','));
        }
        const csvContent = csvRows.join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `payments_report_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container">
            <h2 className="mb-4 mt-4">Settings</h2>
            <div className="glass-panel mb-8" style={{ marginBottom: '2rem' }}>
                {configMsg && <div className="mb-4" style={{ color: configMsg.includes('Error') ? '#ef4444' : '#10b981' }}>{configMsg}</div>}
                <form onSubmit={handleConfigUpdate} className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" className="input" value={config.companyName || ''} onChange={(e) => setConfig({...config, companyName: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>UPI ID</label>
                            <input type="text" className="input" value={config.upiId || ''} onChange={(e) => setConfig({...config, upiId: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <div className="form-group">
                            <label>Upload QR Code Banner</label>
                            <input type="file" className="input" accept="image/png, image/jpeg" onChange={(e) => setQrFile(e.target.files[0])} />
                            {config.qrCodeUrl && (
                                <div className="mt-4">
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current QR Code:</p>
                                    <img src={`https://upi-jet.vercel.app/${config.qrCodeUrl}`} alt="QR" style={{ maxHeight: '100px', borderRadius: '8px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <button type="submit" className="btn btn-primary">Save Settings</button>
                    </div>
                </form>
            </div>

            <div className="flex justify-between items-center mb-4 mt-4">
                <h2>All Payments</h2>
                <div className="flex gap-4">
                    <button onClick={downloadCSV} className="btn btn-success" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}>
                        📥 Export Excel
                    </button>
                    <select className="input" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="glass-panel">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Transaction ID</th>
                                <th>Date</th>
                                <th>Proof</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => (
                                <tr key={payment._id}>
                                    <td>
                                        <div><strong>{payment.user?.name}</strong></div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{payment.user?.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{payment.user?.phone}</div>
                                    </td>
                                    <td>{payment.transactionId || 'N/A'}</td>
                                    <td>{new Date(payment.createdAt).toLocaleString()}</td>
                                    <td>
                                        <a href={`https://upi-jet.vercel.app/${payment.screenshotUrl}`} target="_blank" rel="noreferrer">
                                            <img src={`https://upi-jet.vercel.app/${payment.screenshotUrl}`} alt="proof" className="preview-img" />
                                        </a>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${payment.status}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td>
                                        {payment.status === 'pending' && (
                                            <div className="flex gap-4">
                                                <button className="btn btn-success" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => updateStatus(payment._id, 'verified')}>Approve</button>
                                                <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => updateStatus(payment._id, 'rejected')}>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No payments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
