const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, phone, email, password: hashedPassword });
        res.status(201).json({
            _id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role, token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        const query = email ? { email } : { phone };
        if(!email && !phone) return res.status(400).json({message: 'Please provide email or phone'});
        
        const user = await User.findOne(query);
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role, token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.json(req.user);
};
