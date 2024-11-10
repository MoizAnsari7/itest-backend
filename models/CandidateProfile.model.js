// models/candidateProfile.js
const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    education: { type: String, required: true }, // e.g., "Bachelor's in Computer Science"
    experience: { type: String }, // e.g., "3 years in software development"
    skills: [{ type: String }], // e.g., ["JavaScript", "Node.js", "React"]
    resume: { type: String }, // URL or path to the uploaded resume
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
