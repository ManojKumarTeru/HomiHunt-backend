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
exports.removeFavorite = exports.getFavorites = exports.addFavorite = void 0;
const Favorite_1 = __importDefault(require("../models/Favorite"));
const Property_1 = __importDefault(require("../models/Property"));
//adding property into favorite
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { propertyId } = req.body;
    try {
        const exists = yield Favorite_1.default.findOne({ user: userId, property: propertyId });
        if (exists)
            return res.status(400).json({ message: "Already in favorites" });
        const fav = yield Favorite_1.default.create({ user: userId, property: propertyId });
        res.status(201).json(fav);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to add to favorites", error: err });
    }
});
exports.addFavorite = addFavorite;
// geting all favorites for a user
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    // console.log(userId);
    try {
        const favorites = yield Favorite_1.default.find({ user: userId });
        // console.log("favorites :", favorites);
        const propertyIds = favorites.map(f => f.property);
        const properties = yield Property_1.default.find({ _id: { $in: propertyIds } });
        // console.log(properties);
        res.status(200).json(properties);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch favorites", error: err });
    }
});
exports.getFavorites = getFavorites;
//removing properties from favorites
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { propertyId } = req.params;
    try {
        yield Favorite_1.default.findOneAndDelete({ user: userId, property: propertyId });
        res.status(200).json({ message: "Removed from favorites" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to remove favorite", error: err });
    }
});
exports.removeFavorite = removeFavorite;
