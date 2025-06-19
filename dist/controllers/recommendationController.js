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
exports.getReceivedRecommendations = exports.recommendProperty = void 0;
const Recommendation_1 = __importDefault(require("../models/Recommendation"));
const User_1 = __importDefault(require("../models/User"));
const Property_1 = __importDefault(require("../models/Property"));
// recommend a property to another user by email
const recommendProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fromUserId = req.user.id;
    const { recipientEmail, propertyId } = req.body;
    try {
        const toUser = yield User_1.default.findOne({ emailId: recipientEmail });
        if (!toUser)
            return res.status(404).json({ message: "Recipient user not found" });
        const property = yield Property_1.default.findById(propertyId);
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        const alreadyRecommended = yield Recommendation_1.default.findOne({
            from: fromUserId,
            to: toUser._id,
            property: property._id
        });
        if (alreadyRecommended) {
            return res.status(400).json({ message: "You already recommended this property to this user" });
        }
        const recommendation = yield Recommendation_1.default.create({
            from: fromUserId,
            to: toUser._id,
            property: property._id
        });
        res.status(201).json({ message: "Property recommended successfully", recommendation });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to recommend property", error: err });
    }
});
exports.recommendProperty = recommendProperty;
// get all recommendations received
const getReceivedRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const recommendations = yield Recommendation_1.default.find({ to: userId })
            .populate("from", "name email")
            .populate("property");
        res.status(200).json(recommendations);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch recommendations", error: err });
    }
});
exports.getReceivedRecommendations = getReceivedRecommendations;
