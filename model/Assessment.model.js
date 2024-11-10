// models/assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    sections: [
        {
            test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
            order: { type: Number, required: true }
        }
    ],
    instructions: { type: String, default: '' },
    totalTime: { type: Number, default: 0 }, // calculated as sum of sections' time
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Middleware to calculate total time before saving
assessmentSchema.pre('save', async function (next) {
    const testIds = this.sections.map(section => section.test);
    const tests = await mongoose.model('Test').find({ _id: { $in: testIds } });
    this.totalTime = tests.reduce((total, test) => total + test.timeAllocation, 0);
    next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
