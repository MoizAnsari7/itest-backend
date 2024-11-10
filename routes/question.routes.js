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



/**
 * @swagger
 * /questionTypes:
 *   get:
 *     summary: Retrieve all question types
 *     tags: [QuestionTypes]
 *     responses:
 *       200:
 *         description: A list of question types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuestionType'
 *       500:
 *         description: Server error
 */
router.get('/questionTypes', async (req, res) => {
    try {
        const questionTypes = await QuestionType.find();
        res.status(200).json(questionTypes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /questionTypes/{id}:
 *   get:
 *     summary: Get a question type by ID
 *     tags: [QuestionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The question type ID
 *     responses:
 *       200:
 *         description: A question type object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionType'
 *       404:
 *         description: Question type not found
 */
router.get('/questionTypes/:id', async (req, res) => {
    try {
        const questionType = await QuestionType.findById(req.params.id);
        if (!questionType) return res.status(404).json({ message: 'Question type not found' });
        res.status(200).json(questionType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /questionTypes/{id}:
 *   put:
 *     summary: Update a question type by ID
 *     tags: [QuestionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The question type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionType'
 *     responses:
 *       200:
 *         description: Question type updated successfully
 *       404:
 *         description: Question type not found
 */
router.put('/questionTypes/:id', async (req, res) => {
    try {
        const questionType = await QuestionType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!questionType) return res.status(404).json({ message: 'Question type not found' });
        res.status(200).json(questionType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



/**
 * @swagger
 * /questionTypes/{id}:
 *   delete:
 *     summary: Delete a question type by ID
 *     tags: [QuestionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The question type ID
 *     responses:
 *       200:
 *         description: Question type deleted successfully
 *       404:
 *         description: Question type not found
 */
router.delete('/questionTypes/:id', async (req, res) => {
    try {
        const questionType = await QuestionType.findByIdAndDelete(req.params.id);
        if (!questionType) return res.status(404).json({ message: 'Question type not found' });
        res.status(200).json({ message: 'Question type deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;