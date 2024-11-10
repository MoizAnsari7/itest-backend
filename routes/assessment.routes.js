// routes/assessment.js
const express = require('express');
const router = express.Router();
const Assessment = require('../models/assessment');

/**
 * @swagger
 * /assessments:
 *   post:
 *     summary: Create a new assessment
 *     tags: [Assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sections
 *               - createdBy
 *             properties:
 *               sections:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     test:
 *                       type: string
 *                       description: ID of the test/section
 *                     order:
 *                       type: integer
 *                       description: Order of the test in the assessment
 *               instructions:
 *                 type: string
 *                 description: Instructions for the assessment
 *               createdBy:
 *                 type: string
 *                 description: ID of the user creating the assessment
 *     responses:
 *       200:
 *         description: Assessment created successfully
 *       500:
 *         description: Server error
 */
router.post('/assessments', async (req, res) => {
    try {
        const assessment = new Assessment(req.body);
        const savedAssessment = await assessment.save();
        res.status(200).json(savedAssessment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /assessments:
 *   get:
 *     summary: Get all assessments
 *     tags: [Assessments]
 *     responses:
 *       200:
 *         description: List of assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assessment'
 *       500:
 *         description: Server error
 */
router.get('/assessments', async (req, res) => {
    try {
        const assessments = await Assessment.find().populate('createdBy', 'email firstName lastName').populate('sections.test');
        res.status(200).json(assessments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});