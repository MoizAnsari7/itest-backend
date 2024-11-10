// models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionType',
        required: true
    },
    options: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    }],
    difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instruction: {
        type: String,
        required: false,  // Not required, but encouraged for guidance
        maxlength: 500    // Limit to 500 characters
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', questionSchema);
