"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    type: String,
    price: Number,
    state: String,
    city: String,
    areaSqFt: Number,
    bedrooms: Number,
    bathroom: Number,
    amenities: [String], // Split from CSV or pipe-delimited values
    furnished: String, // e.g., "Furnished", "Unfurnished", "Semi"
    availableFor: String, // e.g., "rent", "sale"
    listedBy: String, // e.g., "Agent", "Owner", "Builder"
    tags: [String], // Split from CSV or pipe-delimited values
    colorTheme: String,
    rating: Number,
    isVerified: Boolean,
    listingType: String, // "rent" or "sale"
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});
exports.default = mongoose.model('Property', propertySchema);
