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
