const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               organization:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was created successfully
 *       500:
 *         description: Server error
 */
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});