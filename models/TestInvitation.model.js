// models/testInvitation.js
const mongoose = require('mongoose');

const testInvitationSchema = new mongoose.Schema({
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to User or CandidateProfile if separate
        required: true
    },
    passkey: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed', 'expired'], default: 'pending' },
    result: {
        score: { type: Number },
        status: { type: String, enum: ['passed', 'failed', 'not_attempted'], default: 'not_attempted' }
    },
    incidents: [{
        description: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    sentAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    validUntil: { type: Date },  // Expiry date for the invitation
});

module.exports = mongoose.model('TestInvitation', testInvitationSchema);
