"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getAllProperties = exports.getMyProperties = exports.getPropertyById = exports.createProperty = void 0;
const Property_1 = __importDefault(require("../models/Property"));
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const property = new Property_1.default(Object.assign(Object.assign({}, req.body), { createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
        yield property.save();
        res.status(201).json("Property created successfully!", property);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create property", error: err });
    }
});
exports.createProperty = createProperty;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const property = yield Property_1.default.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.status(200).json(property);
    }
    catch (err) {
        res.status(500).json({ message: "Error retrieving property", error: err });
    }
});
exports.getPropertyById = getPropertyById;
const getMyProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID missing." });
        }
        const properties = yield Property_1.default.find({ createdBy: userId });
        if (!properties.length) {
            return res.status(404).json({ message: "No properties found for this user" });
        }
        res.status(200).json(properties);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user-specific properties", error: err });
    }
});
exports.getMyProperties = getMyProperties;
const getAllProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //added pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const properties = yield Property_1.default.find().skip(skip).limit(limit);
        const total = yield Property_1.default.countDocuments();
        const hasMore = page * limit < total;
        res.status(200).json({
            properties,
            hasMore
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching properties", error: err });
    }
});
exports.getAllProperties = getAllProperties;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const property = yield Property_1.default.findById(req.params.id);
    if (!property)
        return res.status(404).json({ message: "Property not found" });
    if (property.createdBy.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
        return res.status(403).json({ message: "Not authorized to update this property" });
    Object.assign(property, req.body);
    yield property.save();
    res.status(200).json("Property updated successfully!", property);
});
exports.updateProperty = updateProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const property = yield Property_1.default.findById(req.params.id);
    if (!property)
        return res.status(404).json({ message: "Property not found" });
    if (property.createdBy.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
        return res.status(403).json({ message: "Not authorized to delete this property" });
    yield property.deleteOne();
    res.status(200).json({ message: "Property deleted" });
});
exports.deleteProperty = deleteProperty;
