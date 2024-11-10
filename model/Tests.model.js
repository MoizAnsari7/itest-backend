// models/test.js
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    questions: [
        {
            question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
            order: { type: Number, required: true }
        }
    ],
    timeAllocation: { type: Number, required: true }, // in minutes
    totalQuestions: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isLibraryTest: { type: Boolean, default: false }
});

module.exports = mongoose.model('Test', testSchema);
