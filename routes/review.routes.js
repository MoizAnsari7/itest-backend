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


/**
 * @swagger
 * /reviews/assessment/{assessmentId}:
 *   get:
 *     summary: Get reviews for a specific assessment
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the assessment
 *     responses:
 *       200:
 *         description: List of reviews for the assessment
 *       404:
 *         description: Assessment not found
 *       500:
 *         description: Server error
 */
router.get('/reviews/assessment/:assessmentId', authMiddleware, async (req, res) => {
    try {
        const { assessmentId } = req.params;

        // Find reviews linked to assessments via TestInvitation
        const reviews = await Review.find()
            .populate({
                path: 'testInvitation',
                match: { assessment: assessmentId },
                select: 'assessment'
            })
            .populate('candidate', 'firstName lastName email')
            .exec();

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this assessment.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get a list of reviews with filters
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: assessmentId
 *         schema:
 *           type: string
 *         description: Filter by specific assessment ID
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Minimum star rating filter
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Maximum star rating filter
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the submission date range filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the submission date range filter
 *       - in: query
 *         name: candidateId
 *         schema:
 *           type: string
 *         description: Filter by candidate ID
 *     responses:
 *       200:
 *         description: List of filtered reviews
 *       500:
 *         description: Server error
 */
router.get('/reviews', authMiddleware, async (req, res) => {
    try {
        const { assessmentId, minRating, maxRating, startDate, endDate, candidateId } = req.query;

        // Build query object based on filters
        const query = {};

        if (assessmentId) {
            query.testInvitation = { $exists: true };
            query['testInvitation.assessment'] = assessmentId;
        }
        if (minRating || maxRating) {
            query.rating = {};
            if (minRating) query.rating.$gte = parseInt(minRating);
            if (maxRating) query.rating.$lte = parseInt(maxRating);
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        if (candidateId) {
            query.candidate = candidateId;
        }

        const reviews = await Review.find(query)
            .populate({
                path: 'testInvitation',
                populate: { path: 'assessment', select: 'title' }
            })
            .populate('candidate', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;