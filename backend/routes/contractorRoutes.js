// backend/routes/contractorRoutes.js
const express = require('express');
const { getContractorsByLocation } = require('../controllers/contractorController');
const router = express.Router();

router.get('/', getContractorsByLocation);

module.exports = router;
