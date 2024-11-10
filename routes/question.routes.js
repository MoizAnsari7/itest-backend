// routes/questionType.js
const express = require('express');
const router = express.Router();
const QuestionType = require('../models/questionType');

/**
 * @swagger
 * /questionTypes:
 *   post:
 *     summary: Create a new question type
 *     tags: [QuestionTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [mcq_four, mcq_two, true_false, fill_in_the_blank]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The question type was created
 *       500:
 *         description: Server error
 */
router.post('/questionTypes', async (req, res) => {
    try {
        const questionType = new QuestionType(req.body);
        const savedQuestionType = await questionType.save();
        res.status(200).json(savedQuestionType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
