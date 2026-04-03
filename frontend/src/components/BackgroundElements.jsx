import React from 'react';
import { CreditCard, Smartphone, ShieldCheck, Wallet, IndianRupee, QrCode } from 'lucide-react';
import './BackgroundElements.css';

const BackgroundElements = () => {
    return (
        <div className="bg-elements-container">
            <div className="bg-icon float-1"><CreditCard size={48} /></div>
            <div className="bg-icon float-2"><Smartphone size={64} /></div>
            <div className="bg-icon float-3"><ShieldCheck size={56} /></div>
            <div className="bg-icon float-4"><Wallet size={72} /></div>
            <div className="bg-icon float-5"><IndianRupee size={40} /></div>
            <div className="bg-icon float-6"><QrCode size={80} /></div>
        </div>
    );
};

export default BackgroundElements;
