const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'audio'], required: true },
    isRightAnswer: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: {
        type: String,
        enum: ['mcq_four', 'mcq_two', 'true_false', 'fill_in_the_blank'],
        required: true
    },
    options: [optionSchema],
    addedBy: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
