// models/option.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    isRightAnswer: { type: Boolean, default: false },
    isMultiSelect: { type: Boolean, default: false } // Field indicating if option is multi-selectable
});

module.exports = mongoose.model('Option', optionSchema);
