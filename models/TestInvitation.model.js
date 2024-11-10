// models/testInvitation.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const testInvitationSchema = new mongoose.Schema({
    assessment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Assessment', 
        required: true 
    }, // Reference to the assessment
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // User receiving the invitation
    validFrom: { 
        type: Date, 
        required: true 
    }, // Start of validity period
    validUntil: { 
        type: Date, 
        required: true 
    }, // End of validity period
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'expired', 'rejected'], 
        default: 'pending' 
    }, // Status of the invitation
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Created by (HR or admin)
    passkey: { 
        type: String, 
        required: true, 
        unique: true 
    } // Unique passkey for each invitation
});

// Generate a random passkey before saving
testInvitationSchema.pre('save', function(next) {
    if (!this.passkey) {
        this.passkey = crypto.randomBytes(16).toString('hex'); // Generate a unique passkey
    }
    next();
});

module.exports = mongoose.model('TestInvitation', testInvitationSchema);
