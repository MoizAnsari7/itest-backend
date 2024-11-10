// middleware/auth.js
const User = require('../models/user');

const roleCheck = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

module.exports = { roleCheck };
