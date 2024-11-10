// models/questionType.js
const mongoose = require('mongoose');

const questionTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, enum: ['mcq', 'mcq_two', 'paragraph', 'fill_in_the_blanks'] },
    description: { type: String }  // Optional field to describe the question type
});

module.exports = mongoose.model('QuestionType', questionTypeSchema);
