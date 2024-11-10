// models/question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionType', required: true },
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    isLibraryQuestion: { type: Boolean, default: true },
    selectionType: { type: String, enum: ['single', 'multi'], default: 'single' }, // New field to handle selection type
    fillInTheBlanks: { 
        type: [String], // Array of strings representing the blanks in the text
        required: function() { return this.questionType.name === 'fill_in_the_blanks'; }
    },
    paragraphText: {
        type: String, // Paragraph content for "paragraph" type questions
        required: function() { return this.questionType.name === 'paragraph'; }
    }
});

module.exports = mongoose.model('Question', questionSchema);
