// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    number: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    organization: { type: String },
    role: { type: String, enum: ['admin', 'technical_expert', 'user'], default: 'user' } // New field for user roles
});

module.exports = mongoose.model('User', userSchema);
