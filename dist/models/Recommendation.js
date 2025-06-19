"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const recommendationSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    property: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Property", required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.default = mongoose_1.default.model("Recommendation", recommendationSchema);
