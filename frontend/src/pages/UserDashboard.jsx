import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const UserDashboard = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payments/my-payments');
            setPayments(res.data);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        }
    };

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-4 mt-4">
                <h2>My Payments</h2>
                <Link to="/payment" className="btn btn-primary">+ New Payment</Link>
            </div>
            
            <div className="glass-panel">
                {payments.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>You haven't made any payments yet.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Transaction ID</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <tr key={payment._id}>
                                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                        <td>{payment.transactionId || 'N/A'}</td>
                                        <td>
                                            <span className={`badge badge-${payment.status}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
