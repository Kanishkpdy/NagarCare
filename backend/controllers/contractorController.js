// backend/controllers/contractorController.js
const Contractor = require('../models/contractor');

// Get contractors by location
exports.getContractorsByLocation = async (req, res) => {
    const { location } = req.query;
    try {
        const contractors = await Contractor.find({ location: { $near: { $geometry: { type: "Point", coordinates: location } } } });
        res.json(contractors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contractors', error: error.message });
    }
};
