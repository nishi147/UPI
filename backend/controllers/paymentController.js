const Payment = require('../models/Payment');

exports.uploadPaymentProof = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        
        const { transactionId } = req.body;
        const screenshotUrl = req.file.path;

        const payment = await Payment.create({
            user: req.user._id,
            transactionId: transactionId || '',
            screenshotUrl,
            status: 'pending'
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        // Admin gets all payments, populate user
        const payments = await Payment.find().populate('user', 'name email phone').sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        await payment.save();

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
