// backend/routes/complaintRoutes.js
const express = require('express');
const { createComplaint, getComplaint } = require('../controllers/complaintController');
const router = express.Router();

router.post('/', createComplaint);
router.get('/:id', getComplaint);

module.exports = router;
