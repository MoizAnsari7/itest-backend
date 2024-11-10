// routes/testInvitation.js
const express = require('express');
const router = express.Router();
const TestInvitation = require('../models/testInvitation');
const Assessment = require('../models/assessment');
const User = require('../models/user');
const { roleCheck } = require('../middleware/auth');

/**
 * @swagger
 * /test-invitations:
 *   post:
 *     summary: Create a new test invitation with a validity period linked to an assessment
 *     tags: [Test Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessment:
 *                 type: string
 *                 description: The ID of the assessment that contains the test
 *               user:
 *                 type: string
 *                 description: The ID of the user receiving the invitation
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 description: The start date/time of the validity period
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *                 description: The end date/time of the validity period
 *     responses:
 *       201:
 *         description: Test invitation created successfully
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post('/test-invitations', roleCheck(['hr', 'admin']), async (req, res) => {
    try {
        const { assessment, user, validFrom, validUntil } = req.body;
        const createdBy = req.user._id; // Assuming req.user contains the authenticated user's details

        // Validate the provided dates
        const now = new Date();
        if (new Date(validFrom) <= now) {
            return res.status(400).json({ message: "validFrom must be in the future." });
        }
        if (new Date(validUntil) <= new Date(validFrom)) {
            return res.status(400).json({ message: "validUntil must be after validFrom." });
        }

        // Check if the assessment exists
        const assessmentDoc = await Assessment.findById(assessment);
        if (!assessmentDoc) {
            return res.status(400).json({ message: "Assessment not found" });
        }

        const newInvitation = new TestInvitation({
            assessment,  // Reference to the assessment
            user,         // The user receiving the invitation
            validFrom: new Date(validFrom),
            validUntil: new Date(validUntil),
            createdBy
        });

        const savedInvitation = await newInvitation.save();
        res.status(201).json(savedInvitation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
