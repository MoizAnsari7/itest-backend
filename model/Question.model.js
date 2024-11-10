// models/question.js
const mongoose = require('mongoose');
const QuestionType = require('./questionType'); // Import for reference

const optionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'audio'], required: true },
    isRightAnswer: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionType', // Reference to QuestionType collection
        required: true
    },
    options: [optionSchema],
    addedBy: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
