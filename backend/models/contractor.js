// backend/models/contractor.js
const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    serviceType: { type: String, required: true },
    charges: { type: Number, required: true },
});

module.exports = mongoose.model('Contractor', contractorSchema);
