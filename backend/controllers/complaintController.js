// backend/controllers/complaintController.js
const Complaint = require('../models/complaint');

// Create a complaint
exports.createComplaint = async (req, res) => {
    try {
        const { name, contact, email, type, location, photo } = req.body;
        const complaint = new Complaint({ name, contact, email, type, location, photo });
        await complaint.save();
        res.status(201).json({ message: 'Complaint registered successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Error registering complaint', error: error.message });
    }
};

// Get complaint by ID
exports.getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaint', error: error.message });
    }
};
