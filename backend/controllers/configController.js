const Config = require('../models/Config');

exports.getConfig = async (req, res) => {
    try {
        let config = await Config.findOne();
        if (!config) {
            config = await Config.create({});
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateConfig = async (req, res) => {
    try {
        let config = await Config.findOne();
        if (!config) {
            config = await Config.create({});
        }
        
        if (req.body.companyName) config.companyName = req.body.companyName;
        if (req.body.upiId) config.upiId = req.body.upiId;
        if (req.file) {
            config.qrCodeUrl = `/uploads/${req.file.filename}`;
        }
        
        await config.save();
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
