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


/**
 * @swagger
 * /candidate-profiles/{id}:
 *   get:
 *     summary: Get a candidate profile by ID
 *     tags: [Candidate Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The profile ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.get('/candidate-profiles/:id', authMiddleware, async (req, res) => {
    try {
        const profile = await CandidateProfile.findById(req.params.id).populate('user');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /candidate-profiles/{id}:
 *   put:
 *     summary: Update a candidate profile by ID
 *     tags: [Candidate Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandidateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.put('/candidate-profiles/:id', authMiddleware, async (req, res) => {
    try {
        const profile = await CandidateProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/**
 * @swagger
 * /candidate-profiles/{id}:
 *   delete:
 *     summary: Delete a candidate profile by ID
 *     tags: [Candidate Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The profile ID
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.delete('/candidate-profiles/:id', authMiddleware, async (req, res) => {
    try {
        const profile = await CandidateProfile.findByIdAndDelete(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }
        res.status(200).json({ message: 'Profile deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;