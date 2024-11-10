// models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionType', required: true },
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }, // New field
    isLibraryQuestion: { type: Boolean, default: false } // New field
});

module.exports = mongoose.model('Question', questionSchema);
