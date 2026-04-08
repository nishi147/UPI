const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    screenshotUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
