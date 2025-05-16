const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
name: { type: String, required: true },
description: String,
assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
file: { type: String }, // File path or URL
endTime: { type: Date },
}, { timestamps: true }); // includes createdAt & updatedAt

module.exports = mongoose.model('Project', projectSchema);