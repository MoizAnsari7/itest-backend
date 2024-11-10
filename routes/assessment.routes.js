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


/**
 * @swagger
 * /assessments/{id}:
 *   get:
 *     summary: Get an assessment by ID
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assessment ID
 *     responses:
 *       200:
 *         description: An assessment object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assessment'
 *       404:
 *         description: Assessment not found
 */
router.get('/assessments/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id).populate('createdBy', 'email firstName lastName').populate('sections.test');
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
        res.status(200).json(assessment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /assessments/{id}:
 *   put:
 *     summary: Update an assessment by ID
 *     tags: [Assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assessment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assessment'
 *     responses:
 *       200:
 *         description: Assessment updated successfully
 *       404:
 *         description: Assessment not found
 */
router.put('/assessments/:id', async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
        res.status(200).json(assessment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});