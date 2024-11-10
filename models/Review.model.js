// models/review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    testInvitation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestInvitation',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the candidate who provided the review
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5  // Star rating from 1 to 5
    },
    comments: {
        type: String,
        maxlength: 500  // Optional text feedback for suggestions
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
