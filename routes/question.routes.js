// routes/questionType.js
const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const QuestionType = require('../models/questionType');
const { roleCheck } = require('../middleware/auth');

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
 *               - createdBy
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [mcq_four, mcq_two, true_false, fill_in_the_blank]
 *               description:
 *                 type: string
 *               createdBy:
 *                 type: string
 *                 description: ID of the user creating this question type
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
        const questionTypes = await QuestionType.find().populate('createdBy', 'email firstName lastName');
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


/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get filtered questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Difficulty level of the question
 *       - in: query
 *         name: isLibraryQuestion
 *         schema:
 *           type: boolean
 *         description: Whether the question is a library question
 *       - in: query
 *         name: questionType
 *         schema:
 *           type: string
 *         description: The ID of the question type
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: The ID of the user who created the question
 *     responses:
 *       200:
 *         description: List of filtered questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       500:
 *         description: Server error
 */
router.get('/questions', async (req, res) => {
    try {
        const { difficulty, isLibraryQuestion, questionType, createdBy } = req.query;

        // Build the filter object based on query parameters
        let filter = {};
        if (difficulty) filter.difficulty = difficulty;
        if (isLibraryQuestion) filter.isLibraryQuestion = isLibraryQuestion === 'true';
        if (questionType) filter.questionType = questionType;
        if (createdBy) filter.createdBy = createdBy;

        // Fetch the filtered questions
        const questions = await Question.find(filter).populate('questionType').populate('options');
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question in the technical expert's library (with support for Paragraph and Fill-in-the-Blanks)
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *               questionType:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: For MCQ type questions
 *               fillInTheBlanks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of blanks to be filled (only for Fill in the Blanks)
 *               paragraphText:
 *                 type: string
 *                 description: Paragraph content (only for Paragraph type)
 *     responses:
 *       201:
 *         description: Question created successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/questions', roleCheck(['technical_expert']), async (req, res) => {
    try {
        const { questionText, questionType, options, difficulty, fillInTheBlanks, paragraphText } = req.body;
        const createdBy = req.user._id; // Assuming req.user contains the authenticated user's details

        // Find the question type by name
        const questionTypeDoc = await QuestionType.findOne({ name: questionType });
        if (!questionTypeDoc) return res.status(400).json({ message: 'Invalid question type' });

        let question = {
            questionText,
            questionType: questionTypeDoc._id,
            options,
            difficulty,
            createdBy,
            isLibraryQuestion: true
        };

        if (questionType === 'fill_in_the_blanks' && fillInTheBlanks) {
            question.fillInTheBlanks = fillInTheBlanks;
        }

        if (questionType === 'paragraph' && paragraphText) {
            question.paragraphText = paragraphText;
        }

        // Create and save the question
        const newQuestion = new Question(question);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;