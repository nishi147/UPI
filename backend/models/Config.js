const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    companyName: { type: String, default: '' },
    upiId: { type: String, default: 'sundeep.srivastava007-1@okhdfcbank' },
    qrCodeUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Config', configSchema);
