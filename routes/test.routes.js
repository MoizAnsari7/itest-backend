const express = require('express');
const router = express.Router();
const Test = require('../models/test');

/**
 * @swagger
 * /tests:
 *   post:
 *     summary: Create a new test
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questions
 *               - timeAllocation
 *               - totalQuestions
 *               - createdBy
 *             properties:
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: ID of the question
 *                     order:
 *                       type: integer
 *                       description: Order of the question in the test
 *               timeAllocation:
 *                 type: integer
 *                 description: Total time allocated for the test (in minutes)
 *               totalQuestions:
 *                 type: integer
 *                 description: Total number of questions in the test
 *               createdBy:
 *                 type: string
 *                 description: ID of the user creating the test
 *               isLibraryTest:
 *                 type: boolean
 *                 description: Whether this is a library test
 *     responses:
 *       200:
 *         description: Test created successfully
 *       500:
 *         description: Server error
 */
router.post('/tests', async (req, res) => {
    try {
        const test = new Test(req.body);
        const savedTest = await test.save();
        res.status(200).json(savedTest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



/**
 * @swagger
 * /tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: List of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 *       500:
 *         description: Server error
 */
router.get('/tests', async (req, res) => {
    try {
        const tests = await Test.find().populate('createdBy', 'email firstName lastName').populate('questions.question');
        res.status(200).json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /tests/{id}:
 *   get:
 *     summary: Get a test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The test ID
 *     responses:
 *       200:
 *         description: A test object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 */
router.get('/tests/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id).populate('createdBy', 'email firstName lastName').populate('questions.question');
        if (!test) return res.status(404).json({ message: 'Test not found' });
        res.status(200).json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



/**
 * @swagger
 * /tests/{id}:
 *   put:
 *     summary: Update a test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: Test updated successfully
 *       404:
 *         description: Test not found
 */
router.put('/tests/:id', async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!test) return res.status(404).json({ message: 'Test not found' });
        res.status(200).json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});