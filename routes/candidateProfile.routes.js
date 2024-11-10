// routes/candidateProfile.js
const express = require('express');
const router = express.Router();
const CandidateProfile = require('../models/candidateProfile');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Candidate Profiles
 *   description: API endpoints for managing candidate profiles
 */

/**
 * @swagger
 * /candidate-profiles:
 *   post:
 *     summary: Create a candidate profile
 *     tags: [Candidate Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandidateProfile'
 *     responses:
 *       201:
 *         description: Candidate profile created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/candidate-profiles', authMiddleware, async (req, res) => {
    try {
        const { user, firstName, lastName, email, phone, education, experience, skills, resume, address } = req.body;

        // Check if a profile for this user already exists
        const existingProfile = await CandidateProfile.findOne({ user });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists for this user.' });
        }

        const profile = new CandidateProfile({
            user,
            firstName,
            lastName,
            email,
            phone,
            education,
            experience,
            skills,
            resume,
            address
        });

        const savedProfile = await profile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});