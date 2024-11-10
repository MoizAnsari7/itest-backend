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


/**
 * @swagger
 * /tests/{id}:
 *   delete:
 *     summary: Delete a test by ID
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
 *         description: Test deleted successfully
 *       404:
 *         description: Test not found
 */
router.delete('/tests/:id', async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });
        res.status(200).json({ message: 'Test deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



/**
 * @swagger
 * /tests/{testId}/add-question:
 *   post:
 *     summary: Add a library question to a custom test
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the test
 *       - in: query
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question to add
 *     responses:
 *       200:
 *         description: Question added to test successfully
 *       404:
 *         description: Test or Question not found
 *       500:
 *         description: Server error
 */
router.post('/tests/:testId/add-question', async (req, res) => {
    try {
        const { testId } = req.params;
        const { questionId } = req.query;

        // Fetch the test and ensure it exists
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        // Add the question to the test if it isn't already present
        if (!test.questions.includes(questionId)) {
            test.questions.push(questionId);
            await test.save();
        }
        
        res.status(200).json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;