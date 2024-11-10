// routes/review.js
const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const TestInvitation = require('../models/testInvitation');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API endpoints for managing candidate reviews
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Submit a review for an assessment
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testInvitation:
 *                 type: string
 *                 description: Test invitation ID
 *               rating:
 *                 type: integer
 *                 description: Rating from 1 to 5 stars
 *               comments:
 *                 type: string
 *                 description: Optional feedback comments
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Invalid input or assessment not completed
 *       500:
 *         description: Server error
 */
router.post('/reviews', authMiddleware, async (req, res) => {
    try {
        const { testInvitation, rating, comments } = req.body;

        // Verify that the test invitation is completed
        const invitation = await TestInvitation.findById(testInvitation);
        if (!invitation || invitation.status !== 'completed') {
            return res.status(400).json({ message: 'Assessment must be completed to submit a review.' });
        }

        // Create the review
        const review = new Review({
            testInvitation,
            candidate: req.user._id,
            rating,
            comments
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
